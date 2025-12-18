import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Truck, Fuel, Gauge, MapPin, Calendar, Clock, Edit, Trash2 } from 'lucide-react';
import { vehicleService } from '../../services/vehicleService';
import type { Vehicle } from '../../types';
import { StatusBadge } from './Dashboard';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

export const VehicleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                const response = await vehicleService.getById(parseInt(id));
                if (response.success) {
                    setVehicle(response.data);
                }
            } catch (error) {
                console.error('Failed to load vehicle', error);
                toast.error('Vehicle not found');
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleDelete = async () => {
        if (!vehicle || !confirm('Are you sure you want to delete this vehicle?')) return;
        try {
            await vehicleService.delete(vehicle.id);
            toast.success('Vehicle deleted');
            navigate('/vehicles');
        } catch (error) {
            console.error('Failed to delete vehicle', error);
            toast.error('Failed to delete vehicle');
        }
    };

    if (isLoading) return <div className="p-8">Loading...</div>;
    if (!vehicle) return <div className="p-8">Vehicle not found</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" /> Back to Vehicles
            </button>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{vehicle.name}</h1>
                    <div className="flex items-center gap-3">
                        <StatusBadge status={vehicle.status} />
                        <span className="text-sm text-gray-500">ID: #{vehicle.id}</span>
                    </div>
                </div>
                {user?.role === 'ADMIN' && (
                    <div className="flex gap-2">
                        <Link to={`/vehicles/${vehicle.id}/edit`} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-all">
                            <Edit className="h-4 w-4" /> Edit
                        </Link>
                        <button 
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 flex items-center gap-2 transition-all"
                        >
                            <Trash2 className="h-4 w-4" /> Delete
                        </button>
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    {/* Live Map Placeholder */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 h-96 flex flex-col">
                        <h2 className="text-lg font-semibold mb-4">Live Location</h2>
                        <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 flex-col gap-2">
                             <MapPin className="h-10 w-10 opacity-50" />
                             <p>Map Component Placeholder</p>
                             <div className="text-xs font-mono bg-gray-200 dark:bg-gray-900 px-2 py-1 rounded">
                                 Lat: {vehicle.latitude}, Lng: {vehicle.longitude}
                             </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Stats */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                        <h2 className="text-lg font-semibold mb-4">Vehicle Stats</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Fuel className="h-5 w-5 text-blue-500" />
                                    <span className="text-sm font-medium">Fuel Level</span>
                                </div>
                                <span className="font-bold">{vehicle.fuel_level}%</span>
                            </div>
                             <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Gauge className="h-5 w-5 text-purple-500" />
                                    <span className="text-sm font-medium">Speed</span>
                                </div>
                                <span className="font-bold">{vehicle.speed} km/h</span>
                            </div>
                             <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Truck className="h-5 w-5 text-green-500" />
                                    <span className="text-sm font-medium">Odometer</span>
                                </div>
                                <span className="font-bold">{vehicle.odometer} km</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                         <h2 className="text-lg font-semibold mb-4">Metadata</h2>
                         <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500 flex items-center gap-2"><Calendar className="h-3 w-3" /> Created</span>
                                <span>{new Date(vehicle.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 flex items-center gap-2"><Clock className="h-3 w-3" /> Last Update</span>
                                <span>{new Date(vehicle.updated_at).toLocaleString()}</span>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
