import { useState, useEffect } from 'react';

interface AddressData {
    display_name: string;
    road?: string;
    village?: string;
    suburb?: string;
    city_district?: string;
    city?: string;
    regency?: string;
    state?: string;
    postcode?: string;
    country?: string;
}

export const useReverseGeocoding = (lat: number | undefined, lon: number | undefined) => {
    const [address, setAddress] = useState<AddressData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!lat || !lon) return;

        const fetchAddress = async () => {
            setLoading(true);
            setError(null);
            try {
                // Nominatim API - format=jsonv2 memberikan detail alamat yang lebih terstruktur
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2&addressdetails=1`,
                    {
                        headers: {
                            'Accept-Language': 'id-ID,id;q=0.9', // Prioritaskan bahasa Indonesia
                            'User-Agent': 'VehicleTrackerApp/1.0' // Sesuaikan dengan nama aplikasi kamu
                        }
                    }
                );

                if (!response.ok) throw new Error('Gagal mengambil data lokasi');

                const data = await response.json();
                
                // Nominatim mengelompokkan detail di dalam objek 'address'
                setAddress({
                    display_name: data.display_name,
                    road: data.address.road,
                    village: data.address.village || data.address.suburb || data.address.hamlet,
                    suburb: data.address.suburb,
                    city_district: data.address.city_district || data.address.county,
                    city: data.address.city || data.address.town,
                    regency: data.address.city || data.address.county,
                    state: data.address.state,
                    postcode: data.address.postcode,
                    country: data.address.country
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
            } finally {
                setLoading(false);
            }
        };

        // Debounce sederhana agar tidak membombardir API jika koordinat berubah sangat cepat
        const timeoutId = setTimeout(fetchAddress, 800);
        return () => clearTimeout(timeoutId);
    }, [lat, lon]);

    return { address, loading, error };
};