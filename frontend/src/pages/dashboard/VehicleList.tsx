import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Fuel, Gauge, SlidersHorizontal, Plus } from 'lucide-react';
import { vehicleService } from '../../services/vehicleService';
import type { Vehicle } from '../../types';
import { StatusBadge } from './Dashboard';
import { useAuthStore } from '../../stores/authStore';

export const VehicleList = () => {
    const { user } = useAuthStore();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await vehicleService.getAll();
                if (response.success) {
                    setVehicles(response.data);
                }
            } catch (error) {
                console.error('Failed to load vehicles', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredVehicles = vehicles.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="mt-6 sm:mt-0 text-2xl font-bold text-gray-900 dark:text-gray-100">Vehicles</h1>
                {user?.role === 'ADMIN' && (
                    <button className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 flex items-center gap-2 transition-colors">
                        <Plus className="h-4 w-4" /> Add Vehicle
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search vehicles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                    />
                </div>
                <button className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors">
                    <SlidersHorizontal className="h-4 w-4" /> Filter
                </button>
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="text-center py-12">Loading vehicles...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredVehicles.map(vehicle => (
                        <Link
                            to={`/vehicles/${vehicle.id}`}
                            key={vehicle.id}
                            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-500/10 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">{vehicle.name}</div>
                                <StatusBadge status={vehicle.status} />
                            </div>

                            <div className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Fuel className="h-4 w-4" />
                                    <span>{vehicle.fuel_level}% Fuel</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Gauge className="h-4 w-4" />
                                    <span>{vehicle.speed} km/h</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs text-gray-400">
                                <span>Updated {new Date(vehicle.updated_at).toLocaleDateString()}</span>
                                <span className="group-hover:text-brand-600 transition-colors">View Details &rarr;</span>
                            </div>
                        </Link>
                    ))}
                    {filteredVehicles.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No vehicles found matching your search.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
