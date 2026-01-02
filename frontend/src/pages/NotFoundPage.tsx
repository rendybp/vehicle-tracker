import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { MapPinOff, Home, AlertCircle } from 'lucide-react';

export const NotFoundPage = () => {
    const navigate = useNavigate();

    const [startDelay] = useState(() => {
        const timeSinceLoad = performance.now();
        if (timeSinceLoad < 1500) {
            return 1.2;
        }
        return 0.1;
    });

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: startDelay,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const popUpVariants: Variants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: 'spring',
                stiffness: 200,
                damping: 20
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4 overflow-hidden relative">

            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/30 rounded-full blur-3xl will-change-transform"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.8, 0.2],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl will-change-transform"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.8, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            <motion.div
                className="z-10 text-center max-w-lg w-full"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >

                {/* 404 Icon Animation */}
                <motion.div
                    variants={popUpVariants}
                    className="mb-8 relative will-change-transform"
                >
                    <div className="inset-0 flex items-center justify-center pointer-events-none mb-4">
                        <motion.div
                            className="bg-brand-100 dark:bg-brand-900/30 p-6 rounded-3xl backdrop-blur-sm border border-brand-200 dark:border-brand-800/50 shadow-xl"
                            animate={{
                                y: [-10, 10, -10],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <motion.div
                                animate={{
                                    rotate: [0, 5, -5, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <MapPinOff className="w-16 h-16 text-brand-600 dark:text-brand-400" />
                            </motion.div>
                        </motion.div>
                    </div>

                    <motion.div
                        className="text-[150px] font-black text-gray-800 dark:text-gray-500 leading-none select-none"
                        variants={itemVariants}
                    >
                        404
                    </motion.div>
                </motion.div>

                {/* Text Content */}
                <motion.div variants={itemVariants}>
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
                            <Home className="w-5 h-5" />
                            Return Home
                        </Link>

                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 px-8 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer"
                        >
                            Go Back
                        </button>
                    </div>
                </motion.div>

                {/* Additional Warning */}
                <motion.div
                    variants={itemVariants}
                    className="mt-12 flex items-center justify-center gap-2 text-sm text-gray-400 dark:text-gray-500"
                >
                    <AlertCircle className="w-4 h-4" />
                    <span>Error Code: 404_PAGE_MISSING</span>
                </motion.div>

            </motion.div>
        </div>
    );
};