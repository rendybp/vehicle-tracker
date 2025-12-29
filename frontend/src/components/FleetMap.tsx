
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Vehicle } from '../types';
import { Car, Navigation, Gauge, Fuel } from 'lucide-react';
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

const createCustomIcon = (status: Vehicle['status']) => {
    const statusClasses = {
        ACTIVE: 'text-green-600 border-green-500',
        MAINTENANCE: 'text-orange-600 border-orange-500',
        INACTIVE: 'text-red-600 border-red-500' // Default / Inactive
    };

    const activeClass = statusClasses[status] || statusClasses['INACTIVE'];

    const iconMarkup = renderToStaticMarkup(
        <div className={`flex items-center justify-center w-9 h-9 bg-white rounded-full shadow-md border-3 ${activeClass}`}>
            <Car size={27} color="currentColor" className="opacity-90" />
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

const VehicleMarker = ({ vehicle }: { vehicle: Vehicle }) => {
    const navigate = useNavigate();
    const map = useMap();

    const handleMarkerClick = () => {
        map.flyTo([vehicle.latitude, vehicle.longitude], 16, {
            duration: 1.5 // Animation duration
        });
    };

    return (
        <Marker
            key={vehicle.id}
            position={[vehicle.latitude, vehicle.longitude]}
            icon={createCustomIcon(vehicle.status)}
            eventHandlers={{
                click: handleMarkerClick,
            }}
        >
            <Popup className="custom-popup">
                <div className="min-w-[200px] p-1">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-900 text-sm">{vehicle.name}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${vehicle.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                            vehicle.status === 'MAINTENANCE' ? 'bg-orange-100 text-orange-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                            {vehicle.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
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

                    <button
                        onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                        className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 rounded transition-colors cursor-pointer"
                    >
                        <Navigation size={12} />
                        View Details
                    </button>
                </div>
            </Popup>
        </Marker>
    );
};

export const FleetMap = ({ vehicles }: FleetMapProps) => {
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
                    <VehicleMarker key={vehicle.id} vehicle={vehicle} />
                ))}
            </MapContainer>
        </div>
    );
};
