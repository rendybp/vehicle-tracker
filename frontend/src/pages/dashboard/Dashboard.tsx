import { Truck } from 'lucide-react';

export const Dashboard = () => {

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard Overview</h1>

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
                    </table>
                </div>
            </div>
        </div>
    );
};
