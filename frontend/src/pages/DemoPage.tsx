import { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Ensure CSS is imported
import { Car, Gauge, Fuel, AlertCircle, Maximize } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// Fix for default Leaflet icon
delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: null,
    iconUrl: null,
    shadowUrl: null,
});

// Dummy Data
const dummyVehicles = [
    { id: '1', name: 'Jakarta Fleet 01', latitude: -6.2088, longitude: 106.8456, status: 'ACTIVE', speed: 45, fuel_level: 80 },
    { id: '2', name: 'Solo Logistics', latitude: -7.5755, longitude: 110.8243, status: 'INACTIVE', speed: 0, fuel_level: 65 },
    { id: '3', name: 'Gorontalo Transport', latitude: 0.5435, longitude: 123.0568, status: 'MAINTENANCE', speed: 0, fuel_level: 30 },
] as const;

// Helper to create custom icons
const createCustomIcon = (status: string) => {
    const statusClasses: Record<string, string> = {
        ACTIVE: 'text-green-600 border-green-500',
        MAINTENANCE: 'text-orange-600 border-orange-500',
        INACTIVE: 'text-red-600 border-red-500'
    };

    const activeClass = statusClasses[status] || statusClasses['INACTIVE'];

    const iconMarkup = renderToStaticMarkup(
        <div className={`flex items-center justify-center w-9 h-9 bg-white rounded-full shadow-md border-3 ${activeClass}`}>
            <Car size={27} color="currentColor" className="opacity-90" />
        </div>
    );

    return L.divIcon({
        html: iconMarkup,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18],
    });
};

// Map Controller to fit bounds and add restore control
const MapController = () => {
    const map = useMap();

    const fitAll = useCallback(() => {
        const bounds = L.latLngBounds(dummyVehicles.map(v => [v.latitude, v.longitude]));
        map.fitBounds(bounds, { padding: [50, 50] });
    }, [map]);

    useEffect(() => {
        fitAll();
    }, [fitAll]);

    // Add a custom control for "Restore View"
    useEffect(() => {
        const RestoreControl = L.Control.extend({
            options: {
                position: 'topright'
            },
            onAdd: function () {
                const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
                container.style.backgroundColor = 'white';
                container.style.width = '30px';
                container.style.height = '30px';
                container.style.cursor = 'pointer';
                container.style.display = 'flex';
                container.style.alignItems = 'center';
                container.style.justifyContent = 'center';
                container.title = 'Restore View';

                const icon = renderToStaticMarkup(<Maximize size={18} className="text-gray-700" />);
                container.innerHTML = icon;

                container.onclick = function (e) {
                    L.DomEvent.stopPropagation(e);
                    map.closePopup();
                    fitAll();
                }

                return container;
            }
        });

        const control = new RestoreControl();
        map.addControl(control);

        return () => {
            map.removeControl(control);
        };
    }, [map, fitAll]);

    return null;
};

// Vehicle Marker component with zoom functionality
const VehicleMarker = ({ vehicle }: { vehicle: typeof dummyVehicles[number] }) => {
    const map = useMap();

    const handleMarkerClick = () => {
        // Current zoom or target zoom
        const targetZoom = 18;

        // Project the marker's location to pixel coordinates at the target zoom
        const targetPoint = map.project([vehicle.latitude, vehicle.longitude], targetZoom);

        // Shift the center point up by 150 pixels (so the marker is lower)
        // to give space for the popup
        const newCenterPoint = new L.Point(targetPoint.x, targetPoint.y - 90);

        // Unproject back to LatLng
        const newCenter = map.unproject(newCenterPoint, targetZoom);

        map.flyTo(newCenter, targetZoom, {
            duration: 1.0
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
                <div className="max-w-50 p-2">
                    <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                        <h3 className="font-bold text-gray-900">{vehicle.name}</h3>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            vehicle.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                            vehicle.status === 'MAINTENANCE' ? 'bg-orange-100 text-orange-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                            {vehicle.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-2 rounded-lg flex flex-col items-center text-center">
                            <Gauge className="h-5 w-5 text-purple-500 mb-1" />
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Speed</span>
                            <span className="font-bold text-gray-900">{vehicle.speed} km/h</span>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-lg flex flex-col items-center text-center">
                            <Fuel className="h-5 w-5 text-blue-500 mb-1" />
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Fuel</span>
                            <span className="font-bold text-gray-900">{vehicle.fuel_level}%</span>
                        </div>
                    </div>
                </div>
            </Popup>
        </Marker>
    );
};

export const DemoPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
            <Navbar />

            <main className="grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full flex flex-col">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
                        Live <span className="text-brand-600">Demo</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Experience the power of real-time tracking with our interactive simulator.
                        Explore vehicle status, speed, and location.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="grow bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800 relative z-0 h-[600px]"
                >
                    {/* Map Info Overlay */}
                    <div className="absolute top-4 left-12 z-2000 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 max-w-xs">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-brand-600 mt-0.5" />
                            <div>
                                <h3 className="font-bold text-sm">Demo Mode</h3>
                                <p className="text-xs text-gray-500 mt-1">
                                    Click on the vehicle markers to view live telemetry data.
                                    This is a simulation using static data.
                                </p>
                            </div>
                        </div>
                    </div>

                    <MapContainer
                        center={[-2.5489, 118.0149]} // Indonesia Center
                        zoom={5}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapController />
                        
                        {dummyVehicles.map((vehicle) => (
                            <VehicleMarker key={vehicle.id} vehicle={vehicle} />
                        ))}
                    </MapContainer>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};
