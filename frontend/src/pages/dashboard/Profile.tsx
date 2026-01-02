import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Mail, Shield, CheckCircle, Pencil } from 'lucide-react';
import { UserFormModal } from '../../components/UserFormModal';
import { authService } from '../../services/authService';
import type { User } from '../../types';
import toast from 'react-hot-toast';

export const Profile = () => {
    const { user, setUser } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    if (!user) return <div>Loading...</div>;

    const handleUpdateProfile = async (data: Partial<User> & { password?: string }) => {
        try {
            setIsLoading(true);
            const response = await authService.updateProfile(data);
            if (response.success && response.data) {
                setUser(response.data);
                setIsEditing(false);
                toast.success('Profile updated successfully');
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const message = (error as any)?.response?.data?.message || 'Failed to update profile';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">My Profile</h1>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="bg-linear-to-r from-brand-600 to-brand-400 h-32 relative">
                </div>

                <div className="px-8 pb-8">
                    <div className="relative -mt-16 mb-6">
                        <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900 bg-white dark:bg-gray-800 flex items-center justify-center text-4xl font-bold text-gray-300 shadow-lg">
                            {user.name?.[0] || user.email[0]}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{user.name || 'Unnamed User'}</h2>
                                <p className="text-gray-500">{user.email}</p>
                            </div>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/20 dark:hover:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                            >
                                <Pencil className="h-4 w-4" /> Edit Profile
                            </button>
                        </div>

                        <div className="grid gap-4">
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                <Mail className="text-brand-600 h-5 w-5" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Email</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                <Shield className="text-brand-600 h-5 w-5" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Role</p>
                                    <p className="font-medium">{user.role}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                <CheckCircle className="text-brand-600 h-5 w-5" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Status</p>
                                    <p className="font-medium">Active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <UserFormModal
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                onSave={handleUpdateProfile}
                initialData={user}
                isLoading={isLoading}
                isProfile={true}
            />
        </div>
    );
};
