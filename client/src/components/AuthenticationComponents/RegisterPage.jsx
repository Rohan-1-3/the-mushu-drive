import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../lib/api';

function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Check password match in real-time
        if (name === 'confirmPassword' || name === 'password') {
            const password = name === 'password' ? value : formData.password;
            const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
            setPasswordMatch(password === confirmPassword || confirmPassword === '');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setPasswordMatch(false);
            return;
        }

        setIsLoading(true);

        try {
            await authApi.register({
                username: formData.username,
                password: formData.password,
                firstname: formData.firstName,
                lastname: formData.lastName
            });
            navigate('/login');
            // Handle successful registration (e.g., redirect or show a success message)
        } catch (error) {
            // Handle registration error (e.g., show an error message)
            console.error('Registration error:', error);
        } finally {
            setIsLoading(false);
        }
        
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/10 shadow-2xl p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-12 h-12 rotate-45 rounded-lg shadow-lg bg-primary mx-auto mb-4"></div>
                    <h2 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">Join Mini Drive</h2>
                    <p className="text-text-light/70 dark:text-text-dark/70">Create your account to get started</p>
                </div>

                                <div className="space-y-3">
                    {/* Google OAuth */}
                    <button
                        type="button"
                        className="w-full px-6 py-3 rounded-xl border border-white/30 dark:border-white/20 bg-white/5 dark:bg-black/20 backdrop-blur-sm text-text-light dark:text-text-dark hover:bg-white/10 dark:hover:bg-black/30 transition-all duration-300 flex items-center justify-center space-x-3 group"
                    >
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span className="font-medium">Continue with Google</span>
                    </button>

                    {/* GitHub OAuth */}
                    <button
                        type="button"
                        className="w-full px-6 py-3 rounded-xl border border-white/30 dark:border-white/20 bg-white/5 dark:bg-black/20 backdrop-blur-sm text-text-light dark:text-text-dark hover:bg-white/10 dark:hover:bg-black/30 transition-all duration-300 flex items-center justify-center space-x-3 group"
                    >
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span className="font-medium">Continue with GitHub</span>
                    </button>
                </div>

                <div className="my-6 flex items-center">
                    <div className="flex-1 border-t border-white/20 dark:border-white/10"></div>
                    <span className="px-4 text-sm text-text-light/60 dark:text-text-dark/60 bg-white/5 dark:bg-black/20 rounded-full">
                        or continue with
                    </span>
                    <div className="flex-1 border-t border-white/20 dark:border-white/10"></div>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Fields Row */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* First Name Field */}
                        <div className="relative">
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 pt-6 pb-2 bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/30 dark:border-white/20 rounded-xl text-text-light dark:text-text-dark placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 peer"
                                placeholder=""
                                id="firstName"
                            />
                            <label
                                htmlFor="firstName"
                                className="absolute left-4 top-2 text-xs text-text-light/60 dark:text-text-dark/60 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-text-light/50 peer-placeholder-shown:dark:text-text-dark/50 peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary dark:peer-focus:text-accent2-dark font-medium"
                            >
                                First Name
                            </label>
                        </div>

                        {/* Last Name Field */}
                        <div className="relative">
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 pt-6 pb-2 bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/30 dark:border-white/20 rounded-xl text-text-light dark:text-text-dark placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 peer"
                                placeholder=""
                                id="lastName"
                            />
                            <label
                                htmlFor="lastName"
                                className="absolute left-4 top-2 text-xs text-text-light/60 dark:text-text-dark/60 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-text-light/50 peer-placeholder-shown:dark:text-text-dark/50 peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary dark:peer-focus:text-accent2-dark font-medium"
                            >
                                Last Name
                            </label>
                        </div>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 pt-6 pb-2 bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/30 dark:border-white/20 rounded-xl text-text-light dark:text-text-dark placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 peer"
                            placeholder=""
                            id="username"
                        />
                        <label
                            htmlFor="username"
                            className="absolute left-4 top-2 text-xs text-text-light/60 dark:text-text-dark/60 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-text-light/50 peer-placeholder-shown:dark:text-text-dark/50 peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary dark:peer-focus:text-accent2-dark font-medium"
                        >
                            Username
                        </label>
                    </div>

                    {/* Password Field */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 pt-6 pb-2 pr-12 bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/30 dark:border-white/20 rounded-xl text-text-light dark:text-text-dark placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 peer"
                            placeholder=""
                            id="password"
                        />
                        <label
                            htmlFor="password"
                            className="absolute left-4 top-2 text-xs text-text-light/60 dark:text-text-dark/60 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-text-light/50 peer-placeholder-shown:dark:text-text-dark/50 peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary dark:peer-focus:text-accent2-dark font-medium"
                        >
                            Password
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-4 text-text-light/50 dark:text-text-dark/50 hover:text-text-light dark:hover:text-text-dark transition-colors duration-300"
                        >
                            {showPassword ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-4 pt-6 pb-2 pr-12 bg-white/10 dark:bg-black/20 backdrop-blur-sm border rounded-xl text-text-light dark:text-text-dark placeholder-transparent focus:outline-none transition-all duration-300 peer ${
                                passwordMatch 
                                    ? 'border-white/30 dark:border-white/20 focus:ring-2 focus:ring-primary focus:border-primary' 
                                    : 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                            }`}
                            placeholder=""
                            id="confirmPassword"
                        />
                        <label
                            htmlFor="confirmPassword"
                            className={`absolute left-4 top-2 text-xs transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-text-light/50 peer-placeholder-shown:dark:text-text-dark/50 peer-focus:top-2 peer-focus:text-xs font-medium ${
                                passwordMatch 
                                    ? 'text-text-light/60 dark:text-text-dark/60 peer-focus:text-primary dark:peer-focus:text-accent2-dark' 
                                    : 'text-red-500 peer-focus:text-red-500'
                            }`}
                        >
                            Confirm Password
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-4 text-text-light/50 dark:text-text-dark/50 hover:text-text-light dark:hover:text-text-dark transition-colors duration-300"
                        >
                            {showConfirmPassword ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                        {!passwordMatch && formData.confirmPassword && (
                            <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading || !passwordMatch}
                        className="w-full px-8 py-4 rounded-xl text-white bg-primary hover:bg-accent1 dark:bg-primary dark:hover:bg-accent1 focus:outline-none focus:ring-4 focus:ring-accent2-dark focus:ring-offset-2 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Creating Account...</span>
                            </div>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center">
                    <p className="text-text-light/70 dark:text-text-dark/70">
                        Already have an account?{' '}
                        <Link 
                            to="/login" 
                            className="text-primary dark:text-accent2-dark hover:underline font-semibold transition-colors duration-300"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;