import { toast } from 'sonner';

export class AppError extends Error {
  code: string;
  details?: string;
  userMessage?: string;

  constructor(code: string, message: string, userMessage?: string, details?: string) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.userMessage = userMessage || message;
    this.details = details;
  }
}

export class ErrorHandler {
  static handleDatabaseError(error: any): AppError {
    // Safely log error details without circular reference issues
    const errorDetails = ErrorHandler.safeErrorStringify(error);
    console.error('Database error:', errorDetails);
    
    // Handle specific Supabase errors
    if (error.code === '23505') {
      return new AppError(
        'DUPLICATE_ENTRY',
        'A record with this information already exists',
        'This appointment time is already taken. Please choose a different time.'
      );
    }
    
    if (error.code === '23503') {
      return new AppError(
        'FOREIGN_KEY_VIOLATION',
        'Referenced record not found',
        'Invalid service or user. Please try again.'
      );
    }
    
    if (error.code === '23514') {
      return new AppError(
        'CHECK_CONSTRAINT_VIOLATION',
        'Data validation failed',
        'Please check your input and try again.'
      );
    }
    
    if (error.message?.includes('permission denied')) {
      return new AppError(
        'PERMISSION_DENIED',
        'Access denied',
        'You do not have permission to perform this action.'
      );
    }
    
    return new AppError(
      'DATABASE_ERROR',
      error.message || 'Database operation failed',
      'An error occurred. Please try again later.'
    );
  }

  /**
   * Safely converts error objects to string without circular reference issues
   */
  private static safeErrorStringify(error: any): string {
    try {
      // Try to extract useful information from the error
      if (!error) {
        return 'Unknown error';
      }

      // Handle different error types
      if (typeof error === 'string') {
        return error;
      }

      if (error instanceof Error) {
        return `${error.name}: ${error.message}`;
      }

      // For complex objects, extract key properties
      const errorInfo: any = {};
      
      // Extract standard error properties
      if (error.message) errorInfo.message = error.message;
      if (error.code) errorInfo.code = error.code;
      if (error.details) errorInfo.details = error.details;
      if (error.hint) errorInfo.hint = error.hint;
      if (error.status) errorInfo.status = error.status;
      
      // Try to get stack trace if available
      if (error.stack) {
        errorInfo.stack = error.stack.split('\n').slice(0, 3).join('\n');
      }

      // Convert to JSON safely with circular reference handling
      try {
        return JSON.stringify(errorInfo, null, 2);
      } catch (jsonError) {
        // If JSON.stringify fails (likely due to circular references), 
        // create a simple string representation
        const parts: string[] = [];
        for (const [key, value] of Object.entries(errorInfo)) {
          try {
            // Try to stringify each property individually
            JSON.stringify(value);
            parts.push(`${key}: ${JSON.stringify(value)}`);
          } catch {
            // If a property can't be stringified, just show its type
            parts.push(`${key}: [${typeof value}]`);
          }
        }
        return `{ ${parts.join(', ')} }`;
      }
    } catch (e) {
      // Fallback if anything goes wrong
      return `Error processing error: ${String(error)}`;
    }
  }
  
  static handleValidationError(field: string, value: any): AppError {
    return new AppError(
      'VALIDATION_ERROR',
      `Invalid ${field}: ${value}`,
      `Please provide a valid ${field}.`
    );
  }
  
  static handleBusinessRuleError(rule: string): AppError {
    return new AppError(
      'BUSINESS_RULE_VIOLATION',
      `Business rule violated: ${rule}`,
      `Cannot complete action: ${rule}`
    );
  }
  
  static showToastError(error: AppError): void {
    toast.error(error.userMessage || error.message, {
      duration: 5000,
      position: 'top-right'
    });
  }
  
  static showToastSuccess(message: string): void {
    toast.success(message, {
      duration: 3000,
      position: 'top-right'
    });
  }
  
  static showToastWarning(message: string): void {
    toast.warning(message, {
      duration: 4000,
      position: 'top-right'
    });
  }
}