import { useEffect, useState } from 'react';
import { Truck, Activity, Wrench, AlertTriangle, type LucideIcon } from 'lucide-react';
import { vehicleService } from '../../services/vehicleService';
import type { Vehicle } from '../../types';
import { cn } from '../../lib/utils';

export const Dashboard = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await vehicleService.getAll();
                if (response.success) {
                    setVehicles(response.data);
                }
            } catch (error) {
                console.error('Failed to load dashboard data', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const stats = {
        total: vehicles.length,
        active: vehicles.filter(v => v.status === 'ACTIVE').length,
        maintenance: vehicles.filter(v => v.status === 'MAINTENANCE').length,
        inactive: vehicles.filter(v => v.status === 'INACTIVE').length,
    };

    if (isLoading) {
        return <div className="p-8 text-center">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="mt-6 sm:mt-0 text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    label="Total Vehicles"
                    value={stats.total}
                    icon={Truck}
                    className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                />
                <StatsCard
                    label="Active"
                    value={stats.active}
                    icon={Activity}
                    className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                />
                <StatsCard
                    label="Maintenance"
                    value={stats.maintenance}
                    icon={Wrench}
                    className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                />
                <StatsCard
                    label="Inactive"
                    value={stats.inactive}
                    icon={AlertTriangle}
                    className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                />
            </div>

            {/* Map Placeholder */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Live Fleet Map</h2>
                <div className="w-full h-96 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                        <Truck className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="font-medium">Map Component Placeholder</p>
                        <p className="text-sm">Interactive map will be implemented here</p>
                    </div>
                </div>
            </div>

            {/* Quick List */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Recent Vehicles</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-100 dark:border-gray-800 text-gray-500">
                            <tr>
                                <th className="pb-3 font-medium">Name</th>
                                <th className="pb-3 font-medium">Status</th>
                                <th className="pb-3 font-medium">Fuel</th>
                                <th className="pb-3 font-medium">Speed</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {vehicles.slice(0, 5).map(vehicle => (
                                <tr key={vehicle.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="py-3 font-medium text-gray-900 dark:text-gray-100">{vehicle.name}</td>
                                    <td className="py-3">
                                        <StatusBadge status={vehicle.status} />
                                    </td>
                                    <td className="py-3 text-gray-600 dark:text-gray-400">{vehicle.fuel_level}%</td>
                                    <td className="py-3 text-gray-600 dark:text-gray-400">{vehicle.speed} km/h</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {vehicles.length === 0 && (
                        <p className="text-center text-gray-500 py-4">No vehicles found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    className?: string;
}

export const StatsCard = ({ label, value, icon: Icon, className }: StatsCardProps) => (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 flex items-center gap-4 transition-transform hover:-translate-y-1">
        <div className={cn("p-3 rounded-lg", className)}>
            <Icon className="h-6 w-6" />
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
    </div>
);

export const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
        ACTIVE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
        INACTIVE: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700',
        MAINTENANCE: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    };
    return (
        <span className={cn(
            "px-2.5 py-0.5 rounded-full text-xs font-medium border",
            styles[status as keyof typeof styles] || styles.INACTIVE
        )}>
            {status}
        </span>
    );
};
