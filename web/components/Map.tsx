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
                        <div style={{ fontFamily: 'sans-serif', minWidth: '220px' }}>
                            <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#333' }}>{place.name}, {place.state}</h3>
                            <p style={{ margin: 0, color: '#666', fontSize: '13px', fontStyle: 'italic', marginBottom: '8px' }}>{place.description}</p>

                            <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #eee' }} />

                            <div style={{ fontSize: '13px', lineHeight: '1.5', display: 'grid', gridTemplateColumns: '1fr', gap: '4px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <strong>Temp Range:</strong>
                                    <span>{place.climate.temperatureRange}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <strong>Rainfall:</strong>
                                    <span>{place.climate.annualRainfall} mm</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <strong>AQI (Avg):</strong>
                                    <span style={{
                                        color: place.aqi <= 50 ? '#10b981' : place.aqi <= 100 ? '#f59e0b' : '#ef4444',
                                        fontWeight: 'bold'
                                    }}>{place.aqi}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <strong>Health Score:</strong>
                                    <span style={{ color: '#2563eb', fontWeight: 'bold' }}>{place.healthcare.score}/10</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <strong>Cost of Living:</strong>
                                    <span>{place.costOfLiving}</span>
                                </div>

                                <hr style={{ margin: '6px 0', border: 'none', borderTop: '1px dashed #eee' }} />

                                <div style={{ fontSize: '12px' }}>
                                    <strong>✈️ Nearest Airport:</strong><br />
                                    {place.nearestAirport.name} ({place.nearestAirport.distance} km)
                                    <span style={{ display: 'block', color: '#888', fontSize: '11px' }}>{place.nearestAirport.type}</span>
                                </div>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;
