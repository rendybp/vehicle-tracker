import { useEffect, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Shield, User as UserIcon, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import type { User } from '../types';
import { registerSchema, editUserSchema } from '../lib/schemas';

// Unified type for the form
interface UserFormData {
    name: string;
    email: string;
    role?: "USER" | "ADMIN";
    is_active?: boolean | string;
    password?: string;
    confirmPassword?: string;
}

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSave: (data: any) => Promise<void>; 
    initialData?: User | null;
    isLoading?: boolean;
}

export const UserFormModal = ({ isOpen, onClose, onSave, initialData, isLoading }: UserFormModalProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<UserFormData>({
        resolver: zodResolver(initialData ? editUserSchema : registerSchema) as Resolver<UserFormData>,
        defaultValues: {
            role: 'USER',
            is_active: 'true'
        }
    });

    // Reset form when modal opens or initialData changes
    useEffect(() => {
        if (isOpen) {
            // Reset state only if needed to avoid redundant updates
            if (showPassword) setShowPassword(false);
            if (showConfirmPassword) setShowConfirmPassword(false);
            
            if (initialData) {
                reset({
                    email: initialData.email,
                    name: initialData.name || '',
                    role: initialData.role,
                    is_active: String(initialData.is_active),
                    password: '',
                    confirmPassword: ''
                });
            } else {
                reset({
                    email: '',
                    name: '',
                    role: 'USER',
                    is_active: 'true',
                    password: '',
                    confirmPassword: ''
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, initialData, reset]);

    const onSubmit = (data: UserFormData) => {
        const submitData = { ...data };
        // Clean up empty passwords for edit mode
        if (initialData && !submitData.password) {
            delete submitData.password;
            delete submitData.confirmPassword;
        }
        onSave(submitData);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 z-10"
                    >
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                {initialData ? 'Edit User' : 'Add New User'}
                            </h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        {...register('name')}
                                        type="text"
                                        className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-brand-500'} bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 outline-none transition-all`}
                                        placeholder="John Doe"
                                    />
                                </div>
                                {errors.name && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.name.message}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        {...register('email')}
                                        type="email"
                                        className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-brand-500'} bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                                        placeholder="john@example.com"
                                        disabled={!!initialData} 
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.email.message}</p>}
                            </div>

                            {/* Password Fields */}
                            <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-gray-800">
                                {initialData && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                        Leave password blank to keep current password
                                    </div>
                                )}
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                {...register('password')}
                                                type={showPassword ? "text" : "password"}
                                                className={`w-full pl-10 pr-10 py-2 rounded-lg border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-brand-500'} bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 outline-none transition-all`}
                                                placeholder={initialData ? "New password" : "••••••"}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {errors.password && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.password.message}</p>}
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                {...register('confirmPassword')}
                                                type={showConfirmPassword ? "text" : "password"}
                                                className={`w-full pl-10 pr-10 py-2 rounded-lg border ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-brand-500'} bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 outline-none transition-all`}
                                                placeholder={initialData ? "Confirm new" : "••••••"}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {errors.confirmPassword.message}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Role
                                    </label>
                                    <div className="relative">
                                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <select
                                            {...register('role')}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 outline-none appearance-none"
                                        >
                                            <option value="USER">User</option>
                                            <option value="ADMIN">Admin</option>
                                        </select>
                                    </div>
                                </div>

                                {initialData && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Status
                                        </label>
                                        <div className="relative">
                                            <select
                                                {...register('is_active')}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 outline-none appearance-none"
                                            >
                                                <option value="true">Active</option>
                                                <option value="false">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-lg shadow-brand-600/20 transition-all flex items-center gap-2"
                                >
                                    {isLoading ? 'Saving...' : (
                                        <>
                                            <Save className="h-4 w-4" /> Save User
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
