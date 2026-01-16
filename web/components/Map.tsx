'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { City } from '@/types/City';
import { useEffect } from 'react';

// Icons fix for Leaflet in React/Next.js
const iconUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png';

const customIcon = new L.Icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface MapProps {
    places: City[];
}

const Map = ({ places }: MapProps) => {

    // Fix for map not rendering correctly sometimes on load
    useEffect(() => {
        window.dispatchEvent(new Event('resize'));
    }, [places]);

    return (
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%', minHeight: '500px' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {places.map((place) => (
                <Marker key={place.id} position={[place.lat, place.lng]} icon={customIcon}>
                    <Popup>
                        <div style={{ fontFamily: 'sans-serif', minWidth: '200px' }}>
                            <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{place.name}, {place.state}</h3>
                            <p style={{ margin: 0, color: '#555', fontSize: '14px' }}>{place.description}</p>
                            <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #eee' }} />
                            <div style={{ fontSize: '13px', lineHeight: '1.4' }}>
                                <div><strong>Summer Temp:</strong> {place.climate.averageTempSummer}°C</div>
                                <div><strong>Humidity:</strong> {place.climate.humidity}</div>
                                <div><strong>Healthcare Score:</strong> {place.healthcare.score}/10</div>
                                <div><strong>Ranked Hospitals:</strong> ~{place.healthcare.hospitalCount}</div>
                                <div><strong>Cost of Living:</strong> {place.costOfLiving}</div>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;
