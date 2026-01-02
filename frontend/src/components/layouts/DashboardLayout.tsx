import { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Car, Users, LogOut, Menu, X, MapPin, User, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/authService';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

export const DashboardLayout = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileUserMenuOpen, setIsMobileUserMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await authService.logout();
            logout();
            toast.success('Logged out successfully');
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
            // Force logout client-side even if server fails
            logout();
            navigate('/login');
        }
    };

    const navItems = [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', roles: ['USER', 'ADMIN'] },
        { label: 'Vehicles', icon: Car, href: '/vehicles', roles: ['USER', 'ADMIN'] },
        // Admin Routes
        { label: 'User Management', icon: Users, href: '/admin/users', roles: ['ADMIN'] },
    ];

    const filteredNavItems = navItems.filter(item =>
        user && item.roles.includes(user.role)
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors duration-300">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed h-full z-10 transition-colors duration-300">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-brand-600" />
                    <Link to="/">
                        <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Vehicle Tracker</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {filteredNavItems.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800 relative">
                    {/* User Menu Drop-up */}
                    <AnimatePresence>
                        {isUserMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)}></div>
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute bottom-full left-4 right-4 mb-2 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 py-1 z-20 origin-bottom"
                                >
                                    <Link 
                                        to="/profile" 
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-brand-600 transition-colors"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        <User className="h-4 w-4" />
                                        Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors cursor-pointer"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    <button 
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left cursor-pointer group"
                    >
                        <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-600 flex items-center justify-center font-bold">
                            {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-brand-600 transition-colors">{user?.name || 'User'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                        </div>
                        <ChevronUp className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-2000 px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-brand-600" />
                    <Link to="/">
                        <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Vehicle Tracker</span>
                    </Link>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 dark:text-gray-400 cursor-pointer">
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-10 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            {/* Mobile Sidebar */}
            <aside className={cn(
                "fixed top-16 bottom-0 right-0 w-64 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 z-2000 md:hidden transition-transform duration-300 transform flex flex-col",
                isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            )}>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {filteredNavItems.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </NavLink>
                    ))}
                    <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
                        <button 
                            onClick={() => setIsMobileUserMenuOpen(!isMobileUserMenuOpen)}
                            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left cursor-pointer group"
                        >
                            <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-600 flex items-center justify-center font-bold">
                                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-brand-600 transition-colors">{user?.name || 'User'}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                            </div>
                            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isMobileUserMenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {/* Mobile User Menu (Accordion) */}
                        <AnimatePresence>
                            {isMobileUserMenuOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className="mt-2 space-y-1 p-2 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm">
                                        <Link 
                                            to="/profile" 
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm hover:text-brand-600 transition-all rounded-lg"
                                            onClick={() => {
                                                setIsMobileUserMenuOpen(false);
                                                setIsMobileMenuOpen(false);
                                            }}
                                        >
                                            <User className="h-4 w-4" />
                                            Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 transition-colors rounded-lg cursor-pointer"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 pt-16 md:pt-0 p-4 sm:p-6 lg:p-8 overflow-y-auto h-screen scroll-smooth">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
