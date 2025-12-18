import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { vehicleSchema, type VehicleFormData } from '../../lib/schemas';
import { vehicleService } from '../../services/vehicleService';
import { cn } from '../../lib/utils';

export const VehicleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(vehicleSchema),
        defaultValues: {
            status: 'ACTIVE',
            fuel_level: 100,
            odometer: 0,
            speed: 0,
            latitude: 0,
            longitude: 0,
        }
    });

    useEffect(() => {
        if (isEditing) {
            const loadVehicle = async () => {
                try {
                    const response = await vehicleService.getById(parseInt(id));
                    if (response.success) {
                        const { name, status, fuel_level, odometer, speed, latitude, longitude } = response.data;
                        reset({ name, status, fuel_level, odometer, speed, latitude, longitude });
                    }
                } catch (error) {
                    console.error('Failed to load vehicle details', error);
                    toast.error('Failed to load vehicle details');
                    navigate('/vehicles');
                }
            };
            loadVehicle();
        }
    }, [id, isEditing, navigate, reset]);

    const onSubmit = async (data: VehicleFormData) => {
        setIsLoading(true);
        try {
            if (isEditing) {
                await vehicleService.update(parseInt(id), data);
                toast.success('Vehicle updated successfully');
            } else {
                await vehicleService.create(data);
                toast.success('Vehicle created successfully');
            }
            navigate('/vehicles');
        } catch (error) {
            console.error(error);
            toast.error(isEditing ? 'Failed to update vehicle' : 'Failed to create vehicle');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors mb-6"
            >
                <ArrowLeft className="h-4 w-4" /> Cancel
            </button>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                    {isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Vehicle Name</label>
                        <input
                            {...register('name')}
                            className={cn(
                                "w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-brand-500",
                                errors.name && "border-red-500"
                            )}
                            placeholder="e.g. Ford Transit #104"
                        />
                        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <select
                                {...register('status')}
                                className="w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                                <option value="MAINTENANCE">Maintenance</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Fuel Level (%)</label>
                            <input
                                type="number"
                                {...register('fuel_level')}
                                className="w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Odometer (km)</label>
                            <input
                                type="number"
                                {...register('odometer')}
                                className="w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Speed (km/h)</label>
                            <input
                                type="number"
                                {...register('speed')}
                                className="w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Latitude</label>
                            <input
                                type="number"
                                step="any"
                                {...register('latitude')}
                                className="w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Longitude</label>
                            <input
                                type="number"
                                step="any"
                                {...register('longitude')}
                                className="w-full px-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-70 transition-colors"
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {isEditing ? 'Save Changes' : 'Create Vehicle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
