import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Fuel, Gauge, SlidersHorizontal, Plus, X, Check, ArrowUp, ArrowDown } from 'lucide-react';
import { vehicleService } from '../../services/vehicleService';
import type { Vehicle } from '../../types';
import { StatusBadge } from './Dashboard';
import { useAuthStore } from '../../stores/authStore';

type SortField = 'fuel_level' | 'odometer' | 'speed' | 'updated_at' | 'created_at';
type SortOrder = 'asc' | 'desc';
type FilterStatus = 'ALL' | 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';

export const VehicleList = () => {
    const { user } = useAuthStore();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Filter & Sort State
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
    const [sortField, setSortField] = useState<SortField>('updated_at');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    
    const filterRef = useRef<HTMLDivElement>(null);

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

    // Close filter dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        };

        if (isFilterOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isFilterOpen]);

    const filteredVehicles = vehicles
        .filter(v => {
            const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'ALL' || v.status === filterStatus;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            let aValue: string | number = a[sortField];
            let bValue: string | number = b[sortField];

            // Handle date strings
            if (sortField === 'updated_at' || sortField === 'created_at') {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            }

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

    const toggleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc'); // Default to desc for new field
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="mt-6 sm:mt-0 text-2xl font-bold text-gray-900 dark:text-gray-100">Vehicles</h1>
                {user?.role === 'ADMIN' && (
                    <Link 
                        to="/vehicles/new" 
                        className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 flex items-center gap-2 transition-colors w-fit"
                    >
                        <Plus className="h-4 w-4" /> 
                        Add Vehicle
                    </Link>
                )}
            </div>

            {/* Filters */}
            <div className="flex gap-4 relative z-10">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search vehicles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-brand-500 outline-none transition-all text-gray-900 dark:text-gray-100"
                    />
                </div>
                <div className="relative" ref={filterRef}>
                    <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors ${isFilterOpen ? 'ring-2 ring-brand-500 border-transparent' : ''}`}
                    >
                        <SlidersHorizontal className="h-4 w-4" /> Filter
                    </button>

                    {/* Filter Dropdown */}
                    {isFilterOpen && (
                        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden z-20">
                            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Filters & Sort</h3>
                                <button 
                                    onClick={() => setIsFilterOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            
                            <div className="p-4 space-y-6">
                                {/* Status Filter */}
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(['ALL', 'ACTIVE', 'INACTIVE', 'MAINTENANCE'] as FilterStatus[]).map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => setFilterStatus(status)}
                                                className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                                                    filterStatus === status
                                                        ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-500 text-brand-700 dark:text-brand-400'
                                                        : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700'
                                                }`}
                                            >
                                                {status.charAt(0) + status.slice(1).toLowerCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Sort Fields */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sort By</label>
                                        <button 
                                            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                                            className="text-xs flex items-center gap-1 text-brand-600 hover:text-brand-700 dark:text-brand-400"
                                        >
                                            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                                            {sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                        </button>
                                    </div>
                                    <div className="space-y-1">
                                        {[
                                            { id: 'fuel_level', label: 'Fuel Level', icon: Fuel },
                                            { id: 'odometer', label: 'Odometer', icon: Gauge },
                                            { id: 'speed', label: 'Speed', icon: Gauge },
                                            { id: 'updated_at', label: 'Last Modified', icon: null },
                                            { id: 'created_at', label: 'Last Added', icon: null },
                                        ].map((field) => (
                                            <button
                                                key={field.id}
                                                onClick={() => toggleSort(field.id as SortField)}
                                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                                                    sortField === field.id
                                                        ? 'bg-gray-50 dark:bg-gray-800 text-brand-600 dark:text-brand-400 font-medium'
                                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {field.icon && <field.icon className="h-4 w-4 opacity-70" />}
                                                    <span>{field.label}</span>
                                                </div>
                                                {sortField === field.id && (
                                                    <Check className="h-4 w-4" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-end">
                                <button
                                    onClick={() => {
                                        setFilterStatus('ALL');
                                        setSortField('updated_at');
                                        setSortOrder('desc');
                                    }}
                                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                >
                                    Reset to Defaults
                                </button>
                            </div>
                        </div>
                    )}
                </div>
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
                                <span>
                                    {new Date(vehicle.updated_at).toLocaleDateString()}
                                    <span className="ml-1 opacity-50">
                                        {new Date(vehicle.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </span>
                                <span className="group-hover:text-brand-600 transition-colors">View Details &rarr;</span>
                            </div>
                        </Link>
                    ))}
                    {filteredVehicles.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                            <Search className="h-12 w-12 mb-4 opacity-20" />
                            <p className="text-lg font-medium">No vehicles found</p>
                            <p className="text-sm opacity-70">Try adjusting your search or filters</p>
                            <button 
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterStatus('ALL');
                                }}
                                className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
