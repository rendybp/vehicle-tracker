import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Vehicle } from '../types';
import { Truck, Clock, Gauge, Fuel, MapPin } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// Fix for default Leaflet icon not finding images in react-leaflet
delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: null,
    iconUrl: null,
    shadowUrl: null,
});

interface SingleVehicleMapProps {
    vehicle: Vehicle;
}

// Component to recenter map when vehicle coordinates change
const MapRecenter = ({ lat, lng }: { lat: number; lng: number }) => {
    const map = useMap();

    useEffect(() => {
        map.setView([lat, lng], 15);
    }, [lat, lng, map]);

    return null;
};

export const SingleVehicleMap = ({ vehicle }: SingleVehicleMapProps) => {
    // Create custom icon
    const createCustomIcon = (status: Vehicle['status']) => {
        const colorClass =
            status === 'ACTIVE' ? 'text-green-600' :
                status === 'MAINTENANCE' ? 'text-orange-600' :
                    'text-gray-600';

        const iconMarkup = renderToStaticMarkup(
            <div className={`bg-white p-1.5 rounded-full shadow-md border-2 border-white ${colorClass}`}>
                <Truck size={24} fill="currentColor" className="opacity-90" />
            </div>
        );

        return L.divIcon({
            html: iconMarkup,
            className: '', // Remove default leaflet class
            iconSize: [40, 40], // Slightly larger than fleet map
            iconAnchor: [20, 20],
            popupAnchor: [0, -20],
        });
    };

    return (
        <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 z-0">
            <MapContainer
                center={[vehicle.latitude, vehicle.longitude]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapRecenter lat={vehicle.latitude} lng={vehicle.longitude} />

                <Marker
                    position={[vehicle.latitude, vehicle.longitude]}
                    icon={createCustomIcon(vehicle.status)}
                >
                    <Popup className="custom-popup">
                        <div className="min-w-60 p-2">
                            <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                                <h3 className="font-bold text-gray-900 text-base">{vehicle.name}</h3>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${vehicle.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                        vehicle.status === 'MAINTENANCE' ? 'bg-orange-100 text-orange-700' :
                                            'bg-gray-100 text-gray-700'
                                    }`}>
                                    {vehicle.status}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-gray-50 p-2 rounded flex flex-col items-center justify-center text-center">
                                        <Gauge className="h-4 w-4 text-purple-500 mb-1" />
                                        <span className="text-[10px] text-gray-500 uppercase">Speed</span>
                                        <span className="font-semibold text-gray-900 text-sm">{vehicle.speed} km/h</span>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded flex flex-col items-center justify-center text-center">
                                        <Fuel className="h-4 w-4 text-blue-500 mb-1" />
                                        <span className="text-[10px] text-gray-500 uppercase">Fuel</span>
                                        <span className="font-semibold text-gray-900 text-sm">{vehicle.fuel_level}%</span>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-2 rounded flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Truck className="h-4 w-4 text-green-500" />
                                        <span className="text-xs font-medium text-gray-700">Odometer</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">{vehicle.odometer} km</span>
                                </div>

                                <div className="space-y-1 pt-2 border-t border-gray-100">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <MapPin className="h-3 w-3" />
                                        <span>{vehicle.latitude.toFixed(6)}, {vehicle.longitude.toFixed(6)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Clock className="h-3 w-3" />
                                        <span>Updated: {new Date(vehicle.updated_at).toLocaleTimeString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};
