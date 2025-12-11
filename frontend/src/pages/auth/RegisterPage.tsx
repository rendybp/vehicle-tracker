import { useState } from 'react';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Loader2, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerSchema, type RegisterFormData } from '../../lib/schemas';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import { cn } from '../../lib/utils';

export const RegisterPage = () => {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        try {
            // Create final data object, excluding confirmPassword and forcing role to USER
            const finalData = {
                name: data.name,
                email: data.email,
                password: data.password,
                role: "USER" as const,
            };

            const response = await authService.register(finalData);
            if (response.success && response.data) {
                setAuth(response.data.user, response.data.accessToken);
                toast.success('Account created successfully!');
                navigate('/dashboard');
            }
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            console.error(error);
            const msg = error.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700"
            >
                <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>
                <div className="text-center mb-3">
                    <div className="bg-brand-100 dark:bg-brand-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-600">
                        <UserPlus className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create Account</h1>
                    <p className="text-gray-500 text-sm mt-2">Join us to start tracking your fleet</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                        <input
                            type="text"
                            {...register('name')}
                            className={cn(
                                "w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all",
                                errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-200 dark:border-gray-700"
                            )}
                            placeholder="John Doe"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                        <input
                            type="email"
                            {...register('email')}
                            className={cn(
                                "w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all",
                                errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-200 dark:border-gray-700"
                            )}
                            placeholder="you@example.com"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register('password')}
                                className={cn(
                                    "w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all pr-10",
                                    errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-200 dark:border-gray-700"
                                )}
                                placeholder="Min. 8 chars, A-Z, a-z, 0-9, special"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                {...register('confirmPassword')}
                                className={cn(
                                    "w-full px-4 py-2 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all pr-10",
                                    errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "border-gray-200 dark:border-gray-700"
                                )}
                                placeholder="Confirm your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>



                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link to="/login" className="text-brand-600 font-medium hover:underline">
                        Sign in
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};
