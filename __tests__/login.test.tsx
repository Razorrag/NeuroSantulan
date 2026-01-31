import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../src/app/login/page';

// Mock GSAP at the module level
jest.mock('gsap', () => ({
  context: jest.fn().mockReturnValue({
    to: jest.fn(),
    revert: jest.fn(),
  }),
  to: jest.fn(),
  registerPlugin: jest.fn(),
}));

// Mock ScrollTrigger
jest.mock('gsap/ScrollTrigger', () => ({}));

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form by default', () => {
    render(<LoginPage />);
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Sign in to continue your journey')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  test('switches to signup form when clicking Sign Up', () => {
    render(<LoginPage />);
    
    const signUpButton = screen.getByText('Sign Up');
    fireEvent.click(signUpButton);
    
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByText('Start your journey to mental wellness')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
  });

  test('toggles password visibility', () => {
    render(<LoginPage />);
    
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
    const toggleButton = screen.getByRole('button');
    
    // Initially password should be hidden
    expect(passwordInput.type).toBe('password');
    
    // Click to show password
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');
    
    // Click again to hide
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  test('shows forgot password form', () => {
    render(<LoginPage />);
    
    const forgotPasswordLink = screen.getByText('Forgot Password?');
    fireEvent.click(forgotPasswordLink);
    
    expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
    expect(screen.getByText('Enter your email address and we\'ll send you a link to reset your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send Reset Link' })).toBeInTheDocument();
  });

  test('handles form submission', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
    
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Login functionality would be implemented here');
    });
    
    alertSpy.mockRestore();
  });

  test('handles Google OAuth button click', () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
    
    render(<LoginPage />);
    
    const googleButton = screen.getByText('Sign in with Google');
    fireEvent.click(googleButton);
    
    expect(alertSpy).toHaveBeenCalledWith('Google OAuth would be implemented here');
    
    alertSpy.mockRestore();
  });

  test('doctor login link is present', () => {
    render(<LoginPage />);
    
    const doctorLoginLink = screen.getByText('Doctor Login →');
    expect(doctorLoginLink).toBeInTheDocument();
    expect(doctorLoginLink.closest('a')).toHaveAttribute('href', '/doctor-login');
  });

  test('back to home link works', () => {
    render(<LoginPage />);
    
    const homeLink = screen.getByText('Back to Home');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.closest('a')).toHaveAttribute('href', '/');
  });
});
