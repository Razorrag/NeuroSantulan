import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

export class PerformanceManager {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  private generateCacheKey(prefix: string, params: any[]): string {
    return `${prefix}:${JSON.stringify(params)}`;
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private cleanExpiredCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  async getCachedQuery<T>(
    cacheKey: string,
    queryFn: () => Promise<{ data: T | null; error: any }>,
    ttl: number = this.defaultTTL
  ): Promise<{ data: T | null; error: any }> {
    // Clean expired cache entries periodically
    if (Math.random() < 0.1) { // 10% chance to clean cache
      this.cleanExpiredCache();
    }

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && !this.isExpired(cached)) {
      return { data: cached.data, error: null };
    }

    // Execute query and cache result
    const result = await queryFn();
    
    if (result.data && !result.error) {
      this.cache.set(cacheKey, {
        data: result.data,
        timestamp: Date.now(),
        ttl
      });
    }

    return result;
  }

  async getCachedServices(ttl: number = this.defaultTTL): Promise<{ data: any[] | null; error: any }> {
    const cacheKey = 'services:active';
    
    return this.getCachedQuery(
      cacheKey,
      () => this.supabase.from('services').select('*').eq('is_active', true).order('name'),
      ttl
    );
  }

  async getCachedUserAppointments(
    userId: string,
    page: number = 1,
    limit: number = 10,
    ttl: number = this.defaultTTL
  ): Promise<{ data: any[] | null; error: any; count: number | null }> {
    const cacheKey = `appointments:user:${userId}:page:${page}:limit:${limit}`;
    
    return this.getCachedQuery(
      cacheKey,
      async () => {
        const offset = (page - 1) * limit;
        
        const { data, error, count } = await this.supabase
          .from('appointments')
          .select(`
            *,
            service:services(name, price),
            user:users(username, email)
          `, { count: 'exact' })
          .eq('user_id', userId)
          .order('appointment_date', { ascending: false })
          .range(offset, offset + limit - 1);

        return { data, error, count: count || null };
      },
      ttl
    );
  }

  async getCachedAdminDashboard(
    page: number = 1,
    limit: number = 20,
    statusFilter?: string,
    searchQuery?: string,
    ttl: number = this.defaultTTL
  ): Promise<{
    users: { data: any[] | null; error: any; count: number | null };
    appointments: { data: any[] | null; error: any; count: number | null };
  }> {
    const usersCacheKey = `admin:users:page:${page}:limit:${limit}`;
    const appointmentsCacheKey = `admin:appointments:page:${page}:limit:${limit}:status:${statusFilter || 'all'}:search:${searchQuery || 'none'}`;

    const [usersResult, appointmentsResult] = await Promise.all([
      this.getCachedQuery(
        usersCacheKey,
        async () => {
          const offset = (page - 1) * limit;
          const { data, error, count } = await this.supabase
            .from('users')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);
          return { data, error, count: count || null };
        },
        ttl
      ),
      this.getCachedQuery(
        appointmentsCacheKey,
        async () => {
          const offset = (page - 1) * limit;
          let query = this.supabase
            .from('appointments')
            .select(`
              *,
              service:services(name),
              user:users(username, email)
            `, { count: 'exact' })
            .order('appointment_date', { ascending: false })
            .range(offset, offset + limit - 1);

          if (statusFilter && statusFilter !== 'all') {
            query = query.eq('status', statusFilter);
          }

          if (searchQuery && searchQuery.trim()) {
            const search = `%${searchQuery.trim().toLowerCase()}%`;
            query = query.or(
              `user.username.ilike.${search},user.email.ilike.${search},service.name.ilike.${search}`
            );
          }

          const { data, error, count } = await query;
          return { data, error, count: count || null };
        },
        ttl
      )
    ]);

    return {
      users: usersResult,
      appointments: appointmentsResult
    };
  }

  invalidateCache(pattern?: string): void {
    if (pattern) {
      // Invalidate specific cache entries matching pattern
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      // Clear all cache
      this.cache.clear();
    }
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  // Pagination helper
  static calculatePagination(total: number, page: number, limit: number) {
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    return {
      total,
      totalPages,
      currentPage: page,
      limit,
      hasNextPage,
      hasPrevPage,
      startIndex: (page - 1) * limit + 1,
      endIndex: Math.min(page * limit, total)
    };
  }
}

// Debouncing utility for search inputs
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, wait);
  };
}

// Rate limiting utility
export class RateLimiter {
  private requests = new Map<string, number[]>();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, []);
    }
    
    const userRequests = this.requests.get(identifier)!;
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(timestamp => timestamp > windowStart);
    this.requests.set(identifier, validRequests);
    
    // Check if under limit
    if (validRequests.length < this.maxRequests) {
      validRequests.push(now);
      return true;
    }
    
    return false;
  }
}