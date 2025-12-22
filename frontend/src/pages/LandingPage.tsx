import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Shield, TrendingUp, Clock, Truck, Users, Activity, CheckCircle, LayoutDashboard, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export const LandingPage = () => {
  const { user, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      toast.success('Logged out successfully');
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Logout failed', error);
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <MapPin className="h-8 w-8 text-brand-600" />
              <a href="#top">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-brand-600 to-brand-400">
                  Vehicle Tracker
                </span>
              </a>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-brand-700 dark:text-brand-300 font-medium text-sm">
                      {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm font-medium hidden sm:block text-gray-700 dark:text-gray-200">
                      {user.name || user.email}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setIsDropdownOpen(false)}
                        ></div>
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 py-1 z-20 origin-top-right"
                        >
                          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
                            <p className="text-xs text-gray-500 font-medium truncate">Signed in as</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{user.name || user.email}</p>
                          </div>

                          <Link
                            to="/dashboard"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-brand-600 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </Link>

                          <Link
                            to="/dashboard/profile"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-brand-600 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <User className="w-4 h-4" />
                            Profile
                          </Link>

                          <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                            >
                              <LogOut className="w-4 h-4" />
                              Logout
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium hover:text-brand-600 transition-colors">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-all hover:shadow-lg hover:shadow-brand-500/30"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              Track Your Fleet <br />
              <span className="text-brand-600">In Real-Time</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg">
              Powerful vehicle management solution with live tracking, detailed role-based access, and comprehensive reporting.
            </p>
            <div className="flex gap-4">
              <Link
                to="/register"
                className="px-8 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-all hover:shadow-lg hover:shadow-brand-500/30 flex items-center gap-2"
              >
                Start Tracking <TrendingUp className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="px-8 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                Learn More
              </a>
            </div>
          </motion.div>

          <div className="relative perspective-1000">
            {/* 3D Floating Element Container */}
            <motion.div
              initial={{ opacity: 0, rotateY: -20, rotateX: 10 }}
              animate={{ opacity: 1, rotateY: 0, rotateX: 0 }}
              transition={{ duration: 1, type: "spring" }}
              className="relative z-10"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Floating Card */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-2xl skew-y-1"
              >
                {/* Simulated Map Background */}
                <div className="h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 bg-gray-100 dark:bg-gray-800 rounded-2xl relative overflow-hidden mb-4 group">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')] opacity-30"></div>

                  {/* Animated Path */}
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M -10 75 Q 25 20 50 45 T 110 65"
                      fill="none"
                      stroke="currentColor"
                      className="text-brand-500 animate-dash"
                      style={{ strokeWidth: '0.8', strokeDasharray: '2 1' }}
                    />
                  </svg>

                  {/* Moving Vehicle Marker */}
                  <motion.div
                    className="absolute z-20 bg-brand-600 rounded-full text-white shadow-lg border-2 border-white dark:border-gray-900 flex items-center justify-center"
                    style={{
                      width: '50px',
                      height: '50px',
                      // translate(-50%, -50%) penting agar TITIK TENGAH lingkaran ada di garis
                      x: "-50%",
                      y: "-50%",
                      left: 0,
                      top: 0
                    }}
                    animate={{
                      // Koordinat ini sudah dihitung agar pas dengan lekukan Q (Quadratic Bezier)
                      left: ["-10%", "5%", "20%", "35%", "50%", "65%", "80%", "95%", "110%"],
                      top: ["75%", "55%", "41%", "37%", "44%", "57%", "63%", "66%", "65%"]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="relative flex items-center justify-center">
                      <Truck className="h-6 w-6" />
                      {/* Pulse Effect */}
                      <span className="absolute -inset-2 rounded-full bg-brand-500/30 animate-ping"></span>

                    </div>
                  </motion.div>

                  {/* Floating POI Markers */}
                  <motion.div
                    className="absolute text-brand-400 opacity-50"
                    style={{ top: '15%', left: '20%' }}
                    animate={{ y: [0, -8, 0], opacity: [0.5, 0.7, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                  </motion.div>
                  <motion.div
                    className="absolute text-brand-400 opacity-50"
                    style={{ top: '25%', right: '20%' }}
                    animate={{ y: [0, -8, 0], opacity: [0.5, 0.7, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.75 }}
                  >
                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                  </motion.div>
                  <motion.div
                    className="absolute text-brand-400 opacity-50"
                    style={{ top: '75%', right: '65%' }}
                    animate={{ y: [0, -8, 0], opacity: [0.5, 0.7, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  >
                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                  </motion.div>
                </div>

                {/* Stats Row */}
                <div className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl flex-1">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-600">
                      <Activity className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <p className="font-bold text-gray-900 dark:text-gray-100">Moving</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl flex-1">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Speed</p>
                      <p className="font-bold text-gray-900 dark:text-gray-100">65 km/h</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Decorative Background Blob */}
              <div className="absolute -inset-10 bg-linear-to-tr from-brand-500 to-purple-500 opacity-20 blur-3xl rounded-full -z-10 animate-pulse"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Truck, label: 'Vehicles', value: '1,000+' },
              { icon: Users, label: 'Active Users', value: '500+' },
              { icon: Activity, label: 'Uptime', value: '99.9%' },
              { icon: CheckCircle, label: 'Support', value: '24/7' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <stat.icon className="h-8 w-8 mx-auto text-brand-600 mb-2" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose Vehicle Tracker?</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Everything you need to manage your fleet efficiently and securely.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Clock, title: 'Real-Time Tracking', desc: 'Monitor your vehicles live on the map with minimal latency.' },
            { icon: Shield, title: 'Role-Based Security', desc: 'Secure access controls for admins and standard users.' },
            { icon: TrendingUp, title: 'History & Analytics', desc: 'Analyze historical data and fleet performance over time.' },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-transparent hover:border-brand-500/20 transition-all hover:shadow-2xl hover:shadow-brand-500/10"
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center text-brand-600 mb-6">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Vehicle Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};
