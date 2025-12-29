import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPinOff, Home, AlertCircle } from 'lucide-react';

export const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4 overflow-hidden ">

            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            <div className="z-10 text-center max-w-lg w-full">

                {/* 404 Animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, type: 'spring' }}
                    className=" mb-8"
                >
                    <div
                        className="inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <div className="bg-brand-100 dark:bg-brand-900/30 p-6 rounded-3xl backdrop-blur-sm border border-brand-200 dark:border-brand-800/50 shadow-xl">
                            <MapPinOff className="w-16 h-16 text-brand-600 dark:text-brand-400" />
                        </div>
                    </div>
                    <div className="text-[150px] font-black text-gray-200 dark:text-gray-800 leading-none select-none">
                        404
                    </div>
                </motion.div>

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Destination Not Found
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
                        The coordinates you're looking for don't exist in our map.
                        Let's get you back on track.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            to="/"
                            className="flex items-center gap-2 px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-brand-500/30 group"
                        >
                            <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                            Return Home
                        </Link>

                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2 px-8 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer"
                        >
                            Go Back
                        </button>
                    </div>
                </motion.div>

                {/* Additional Warning / Details (Optional) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-12 flex items-center justify-center gap-2 text-sm text-gray-400 dark:text-gray-500"
                >
                    <AlertCircle className="w-4 h-4" />
                    <span>Error Code: 404_PAGE_MISSING</span>
                </motion.div>

            </div>
        </div>
    );
};
