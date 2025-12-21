
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Vehicle } from '../types';
import { Truck, Navigation } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useNavigate } from 'react-router-dom';

// Fix for default Leaflet icon not finding images in react-leaflet
// We are using custom icons so this might be redundant but good for safety
delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: null,
    iconUrl: null,
    shadowUrl: null,
});

interface FleetMapProps {
    vehicles: Vehicle[];
}

// Component to update map bounds based on vehicles
const MapUpdater = ({ vehicles }: { vehicles: Vehicle[] }) => {
    const map = useMap();

    useEffect(() => {
        if (vehicles.length > 0) {
            const bounds = L.latLngBounds(vehicles.map(v => [v.latitude, v.longitude]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [vehicles, map]);

    return null;
};

export const FleetMap = ({ vehicles }: FleetMapProps) => {
    const navigate = useNavigate();

    // Create custom icon
    const createCustomIcon = (status: Vehicle['status']) => {
        const colorClass =
            status === 'ACTIVE' ? 'text-green-600' :
                status === 'MAINTENANCE' ? 'text-orange-600' :
                    'text-gray-600';

        const iconMarkup = renderToStaticMarkup(
            <div className={`bg-white p-1.5 rounded-full shadow-md border-2 border-white ${colorClass}`}>
                <Truck size={20} fill="currentColor" className="opacity-90" />
            </div>
        );

        return L.divIcon({
            html: iconMarkup,
            className: '', // Remove default leaflet class to avoid box style
            iconSize: [36, 36],
            iconAnchor: [18, 18],
            popupAnchor: [0, -18],
        });
    };

    // Default center (can be anywhere, will be updated by MapUpdater)
    const defaultCenter: [number, number] = [40.7128, -74.0060]; // New York

    return (
        <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 z-0">
            <MapContainer
                center={defaultCenter}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true} // Enable scroll zoom
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapUpdater vehicles={vehicles} />

                {vehicles.map((vehicle) => (
                    <Marker
                        key={vehicle.id}
                        position={[vehicle.latitude, vehicle.longitude]}
                        icon={createCustomIcon(vehicle.status)}
                    >
                        <Popup className="custom-popup">
                            <div className="min-w-[200px] p-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold text-gray-900 text-sm">{vehicle.name}</h3>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${vehicle.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                            vehicle.status === 'MAINTENANCE' ? 'bg-orange-100 text-orange-700' :
                                                'bg-gray-100 text-gray-700'
                                        }`}>
                                        {vehicle.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                                    <div className="bg-gray-50 p-1.5 rounded">
                                        <p className="text-gray-500 mb-0.5">Speed</p>
                                        <p className="font-semibold text-gray-900">{vehicle.speed} km/h</p>
                                    </div>
                                    <div className="bg-gray-50 p-1.5 rounded">
                                        <p className="text-gray-500 mb-0.5">Fuel</p>
                                        <p className="font-semibold text-gray-900">{vehicle.fuel_level}%</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                                    className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 rounded transition-colors"
                                >
                                    <Navigation size={12} />
                                    View Details
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};
