import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CheckCircle, Shield, TrendingUp, Cpu, Globe, Smartphone } from 'lucide-react';

export const ProductPage = () => {
    const features = [
        {
            icon: Globe,
            title: "Global Coverage",
            description: "Track your vehicles anywhere in the world with our advanced GPS technology."
        },
        {
            icon: Shield,
            title: "Enterprise Security",
            description: "Bank-grade encryption and role-based access control to keep your data safe."
        },
        {
            icon: TrendingUp,
            title: "Real-time Analytics",
            description: "Get instant insights into fleet performance, fuel usage, and driver behavior."
        },
        {
            icon: Cpu,
            title: "Smart Alerts",
            description: "Receive notifications for speeding, maintenance needs, and unauthorized use."
        },
        {
            icon: Smartphone,
            title: "Mobile Friendly",
            description: "Access your dashboard from any device with our fully responsive interface."
        },
        {
            icon: CheckCircle,
            title: "Reliable Uptime",
            description: "Count on us with 99.9% guaranteed uptime for your critical operations."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
            <Navbar />

            <main className="grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                        The Ultimate <span className="text-brand-600">Vehicle Tracking</span> Solution
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        Empower your logistics with a platform designed for efficiency, security, and growth. 
                        See why thousands of businesses trust us.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-800"
                        >
                            <div className="w-14 h-14 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center text-brand-600 mb-6">
                                <feature.icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Integration Section */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="bg-brand-600 text-white rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden"
                >
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6">Ready to optimize your fleet?</h2>
                        <p className="opacity-90 mb-8 text-lg">
                            Join the revolution in fleet management. Scalable, secure, and simple to use.
                        </p>
                        <button className="bg-white text-brand-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg">
                            Get Started Now
                        </button>
                    </div>
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};
