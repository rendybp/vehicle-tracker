import { useEffect } from 'react';

export const useAuthSync = () => {
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'vehicle-tracker-auth') {
                // If auth data is removed from localStorage, reload to sync state
                window.location.reload();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);
}