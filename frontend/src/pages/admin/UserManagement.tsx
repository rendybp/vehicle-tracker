import { useEffect, useState } from 'react';
import { User as UserIcon, Shield, Mail, Calendar, Search, Plus, Filter, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { userService } from '../../services/userService';
import type { UserResponse, RegisterRequest } from '../../types';
import { useAuthStore } from '../../stores/authStore';
import { DeleteConfirmationModal } from '../../components/DeleteConfirmationModal';
import { UserFormModal } from '../../components/UserFormModal';

type FilterRole = 'ALL' | 'ADMIN' | 'USER';
type FilterStatus = 'ALL' | 'ACTIVE' | 'INACTIVE';

export const UserManagement = () => {
    const currentUser = useAuthStore((state) => state.user);
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Search & Filter
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<FilterRole>('ALL');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Modals
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const loadUsers = async () => {
        try {
            const response = await userService.getAll();
            if (response.success && response.data) {
                setUsers(response.data);
            }
        } catch (error) {
            console.error('Failed to load users', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleSaveUser = async (data: RegisterRequest & { is_active: boolean | string }) => {
        setIsSaving(true);
        try {
            // Convert string boolean if needed
            const formattedData = {
                ...data,
                is_active: data.is_active === 'true' || data.is_active === true
            };

            if (selectedUser) {
                await userService.update(selectedUser.id, formattedData);
                toast.success('User updated successfully');
            } else {
                await userService.create(formattedData);
                toast.success('User created successfully');
            }
            await loadUsers();
            setIsFormOpen(false);
            setSelectedUser(null);
        } catch (error) {
            console.error('Failed to save user', error);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const message = (error as any)?.response?.data?.message || 'Failed to save user';
            if (message.toLowerCase().includes('email')) {
                toast.error('Email is already in use');
            } else {
                toast.error(message);
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        try {
            await userService.delete(selectedUser.id);
            toast.success('User deleted successfully');
            await loadUsers();
            setIsDeleteOpen(false);
            setSelectedUser(null);
        } catch (error) {
            console.error('Failed to delete user', error);
            toast.error('Failed to delete user');
        }
    };

    const confirmDelete = (user: UserResponse) => {
        setSelectedUser(user);
        setIsDeleteOpen(true);
    };

    const openEditModal = (user: UserResponse) => {
        setSelectedUser(user);
        setIsFormOpen(true);
    };

    const openAddModal = () => {
        setSelectedUser(null);
        setIsFormOpen(true);
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'ALL' || user.role === filterRole;
        const matchesStatus = filterStatus === 'ALL' ||
            (filterStatus === 'ACTIVE' ? user.is_active : !user.is_active);

        return matchesSearch && matchesRole && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">User Management</h1>
                <button
                    onClick={openAddModal}
                    className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 flex items-center gap-2 transition-colors w-fit shadow-lg shadow-brand-600/20 cursor-pointer"
                >
                    <Plus className="h-4 w-4" />
                    Add User
                </button>
            </div>

            {/* Filters Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-brand-500 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="flex gap-2 relative">
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors cursor-pointer ${isFilterOpen ? 'ring-2 ring-brand-500 border-transparent' : ''}`}
                    >
                        <Filter className="h-4 w-4" />
                        <span className="hidden sm:inline">Filters</span>
                    </button>

                    {/* Filter Dropdown */}
                    {isFilterOpen && (
                        <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="p-4 space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Role</label>
                                    <div className="flex flex-wrap gap-2">
                                        {(['ALL', 'ADMIN', 'USER'] as FilterRole[]).map((role) => (
                                            <button
                                                key={role}
                                                onClick={() => setFilterRole(role)}
                                                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${filterRole === role
                                                    ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-500 text-brand-700 dark:text-brand-400'
                                                    : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700'
                                                    }`}
                                            >
                                                {role}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Status</label>
                                    <div className="flex flex-wrap gap-2">
                                        {(['ALL', 'ACTIVE', 'INACTIVE'] as FilterStatus[]).map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => setFilterStatus(status)}
                                                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${filterStatus === status
                                                    ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-500 text-brand-700 dark:text-brand-400'
                                                    : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700'
                                                    }`}
                                            >
                                                {status.charAt(0) + status.slice(1).toLowerCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
                                <button
                                    onClick={() => {
                                        setFilterRole('ALL');
                                        setFilterStatus('ALL');
                                    }}
                                    className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 font-medium cursor-pointer"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-gray-500">
                            <tr>
                                <th className="px-6 py-4 font-medium">User</th>
                                <th className="px-6 py-4 font-medium hidden sm:table-cell">Role</th>
                                <th className="px-6 py-4 font-medium hidden md:table-cell">Info</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-gray-500">Loading users...</td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Search className="h-8 w-8 mb-2 opacity-20" />
                                            <p>No users found matching your filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-600 flex items-center justify-center font-bold text-xs">
                                                    {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-gray-100">{user.name || 'Unnamed'}</div>
                                                    <div className="text-xs text-gray-500">{user.email}</div>
                                                    {/* Mobile Role/Info */}
                                                    <div className="sm:hidden flex items-center gap-2 mt-1 text-xs text-gray-400">
                                                        <span>{user.role}</span>
                                                        <span>•</span>
                                                        <span>{user.is_active ? 'Active' : 'Inactive'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden sm:table-cell">
                                            <div className="flex items-center gap-2">
                                                {user.role === 'ADMIN' ? <Shield className="h-4 w-4 text-purple-500" /> : <UserIcon className="h-4 w-4 text-gray-400" />}
                                                <span className={user.role === 'ADMIN' ? "text-purple-600 font-medium" : "text-gray-600"}>{user.role}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 hidden md:table-cell">
                                            <div className="flex flex-col gap-1 text-xs">
                                                <div className="flex items-center gap-1">
                                                    <Mail className="h-3 w-3" /> {user.email}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" /> Joined {new Date(user.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${user.is_active ? 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' : 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30'}`}>
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity opacity-100">
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    disabled={currentUser?.id === user.id}
                                                    className={`p-1.5 rounded-lg transition-colors ${currentUser?.id === user.id
                                                        ? 'text-gray-300 cursor-not-allowed'
                                                        : 'text-gray-400 hover:text-brand-600 hover:bg-brand-50 cursor-pointer'
                                                        }`}
                                                    title={currentUser?.id === user.id ? "You cannot edit yourself" : "Edit User"}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(user)}
                                                    disabled={currentUser?.id === user.id}
                                                    className={`p-1.5 rounded-lg transition-colors ${currentUser?.id === user.id
                                                        ? 'text-gray-300 cursor-not-allowed'
                                                        : 'text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer'
                                                        }`}
                                                    title={currentUser?.id === user.id ? "You cannot delete yourself" : "Delete User"}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <UserFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSave={handleSaveUser}
                initialData={selectedUser}
                isLoading={isSaving}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteUser}
                title={selectedUser ? "Delete User" : "Delete Item"}
                message="Are you sure you want to delete this user? This action cannot be undone and they will lose all access."
                itemName={selectedUser?.name || selectedUser?.email}
                confirmText="Delete User"
            />
        </div>
    );
};
