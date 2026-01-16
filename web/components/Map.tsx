'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

// Sample data - Top Retirement Destinations in India
const places = [
    { id: 1, name: "Kochi, Kerala", lat: 9.9312, lng: 76.2673, description: "Coastal city, good healthcare, moderate climate." },
    { id: 2, name: "Dehradun, Uttarakhand", lat: 30.3165, lng: 78.0322, description: "Hill station, pleasant weather, peaceful." },
    { id: 3, name: "Pune, Maharashtra", lat: 18.5204, lng: 73.8567, description: "Cultural hub, moderate climate, excellent hospitals." },
    { id: 4, name: "Coimbatore, Tamil Nadu", lat: 11.0168, lng: 76.9558, description: "Pleasant climate, good healthcare infrastructure." },
    { id: 5, name: "Chandigarh", lat: 30.7333, lng: 76.7794, description: "Planned city, green, organized." },
    { id: 6, name: "Mysore, Karnataka", lat: 12.2958, lng: 76.6394, description: "Cleanest city, heritage, relaxed pace." },
    { id: 7, name: "Goa", lat: 15.2993, lng: 74.1240, description: "Beaches, relaxed lifestyle, good community." }
];

const Map = () => {
    return (
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%', minHeight: '500px' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {places.map((place) => (
                <Marker key={place.id} position={[place.lat, place.lng]} icon={customIcon}>
                    <Popup>
                        <div style={{ fontFamily: 'sans-serif' }}>
                            <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{place.name}</h3>
                            <p style={{ margin: 0, color: '#555' }}>{place.description}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;
