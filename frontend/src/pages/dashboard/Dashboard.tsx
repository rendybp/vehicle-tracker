import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Activity, Wrench, AlertTriangle, Eye, EyeOff, type LucideIcon } from 'lucide-react';
import { vehicleService } from '../../services/vehicleService';
import type { Vehicle } from '../../types';
import { cn } from '../../lib/utils';
import { FleetMap } from '../../components/FleetMap';

export const Dashboard = () => {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hiddenStatuses, setHiddenStatuses] = useState<string[]>([]);

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

    const toggleStatus = (status: string) => {
        setHiddenStatuses(prev =>
            prev.includes(status)
                ? prev.filter(s => s !== status)
                : [...prev, status]
        );
    };

    const stats = {
        total: vehicles.length,
        active: vehicles.filter(v => v.status === 'ACTIVE').length,
        maintenance: vehicles.filter(v => v.status === 'MAINTENANCE').length,
        inactive: vehicles.filter(v => v.status === 'INACTIVE').length,
    };

    const filteredMapVehicles = vehicles.filter(v => !hiddenStatuses.includes(v.status));

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
                    icon={Car}
                    className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    onClick={() => navigate('/vehicles')}
                    isVisible={hiddenStatuses.length === 0}
                    onToggleVisibility={hiddenStatuses.length > 0 ? () => setHiddenStatuses([]) : undefined}
                />
                <StatsCard
                    label="Active"
                    value={stats.active}
                    icon={Activity}
                    className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                    onClick={() => navigate('/vehicles?status=ACTIVE')}
                    isVisible={!hiddenStatuses.includes('ACTIVE')}
                    onToggleVisibility={() => toggleStatus('ACTIVE')}
                />
                <StatsCard
                    label="Maintenance"
                    value={stats.maintenance}
                    icon={Wrench}
                    className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                    onClick={() => navigate('/vehicles?status=MAINTENANCE')}
                    isVisible={!hiddenStatuses.includes('MAINTENANCE')}
                    onToggleVisibility={() => toggleStatus('MAINTENANCE')}
                />
                <StatsCard
                    label="Inactive"
                    value={stats.inactive}
                    icon={AlertTriangle}
                    className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                    onClick={() => navigate('/vehicles?status=INACTIVE')}
                    isVisible={!hiddenStatuses.includes('INACTIVE')}
                    onToggleVisibility={() => toggleStatus('INACTIVE')}
                />
            </div>

            {/* Live Fleet Map */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Live Fleet Map</h2>
                <div className="w-full h-80 lg:h-96 rounded-lg overflow-hidden">
                    <FleetMap vehicles={filteredMapVehicles} />
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
                            {[...vehicles]
                                .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
                                .slice(0, 5)
                                .map(vehicle => (
                                    <tr
                                        key={vehicle.id}
                                        onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                                        className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                                    >
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
    onClick?: () => void;
    isVisible?: boolean;
    onToggleVisibility?: (e: React.MouseEvent) => void;
}

export const StatsCard = ({
    label,
    value,
    icon: Icon,
    className,
    onClick,
    isVisible = true,
    onToggleVisibility
}: StatsCardProps) => {
    const EyeIcon = isVisible ? Eye : EyeOff;

    return (
        <div
            onClick={onClick}
            className={cn(
                "group relative bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 flex items-center gap-4 transition-transform hover:-translate-y-1",
                onClick && "cursor-pointer hover:shadow-md active:scale-95 transition-all",
                !isVisible && "opacity-60"
            )}
        >
            {onToggleVisibility && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleVisibility(e);
                    }}
                    className="absolute top-3 right-3 p-3 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors opacity-100 lg:opacity-0 lg:group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer"
                    title={isVisible ? "Hide from map" : "Show on map"}
                >
                    <EyeIcon size={30} />
                </button>
            )}
            <div className={cn("p-3 rounded-lg", className)}>
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
            </div>
        </div>
    );
};

export const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
        ACTIVE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
        INACTIVE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
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
