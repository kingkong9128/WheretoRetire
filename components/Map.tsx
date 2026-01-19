'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { City } from '@/types/City';
import L from 'leaflet';

// Fix Leaflet Icon
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
    places: City[];
    selectedCityId?: number | null;
}

// Sub-component to handle map movement
const MapUpdater = ({ selectedCity }: { selectedCity: City | undefined }) => {
    const map = useMap();
    useEffect(() => {
        if (selectedCity) {
            map.flyTo([selectedCity.lat, selectedCity.lng], 10, {
                duration: 1.5
            });
        }
    }, [selectedCity, map]);
    return null;
};

const Map = ({ places, selectedCityId }: MapProps) => {
    const activeCity = places.find(p => p.id === selectedCityId);

    return (
        <MapContainer center={[22.5, 79.5]} zoom={5} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapUpdater selectedCity={activeCity} />

            {places.map((city) => (
                <Marker key={city.id} position={[city.lat, city.lng]}>
                    <Popup className="custom-popup">
                        <div className="p-1 min-w-[200px]">
                            <h3 className="font-bold text-lg mb-1">{city.name}</h3>
                            <p className="text-xs text-gray-500 mb-2">{city.state}</p>

                            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                <div className="bg-blue-50 p-2 rounded">
                                    <div className="text-xs text-gray-500">Match</div>
                                    <div className="font-bold text-blue-600">{city.matchScore}%</div>
                                </div>
                                <div className="bg-green-50 p-2 rounded">
                                    <div className="text-xs text-gray-500">AQI</div>
                                    <div className={`font-bold ${city.aqi > 150 ? 'text-red-600' : 'text-green-600'}`}>{city.aqi}</div>
                                </div>
                            </div>

                            <div className="space-y-2 text-xs border-t pt-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Real Estate:</span>
                                    <span className="font-medium">₹{city.realEstate.averagePricePerSqFt}/sqft</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Summer/Winter:</span>
                                    <span className="font-medium">{city.climate.temperatureRange}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Healthcare:</span>
                                    <span className="font-medium text-right">{city.healthcare.score}/10 ({city.healthcare.hospitalCount} hosps)</span>
                                </div>
                                {city.healthcare.chains.length > 0 && (
                                    <div className="text-gray-400 italic">
                                        Top Chains: {city.healthcare.chains.slice(0, 2).join(', ')}...
                                    </div>
                                )}
                                <div className="pt-2 mt-2 border-t">
                                    <div className="font-semibold text-gray-700 mb-1">Airports</div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>✈️ {city.nearestDomesticAirport.distance}km (Dom)</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>✈️ {city.nearestInternationalAirport.distance}km (Intl)</span>
                                    </div>
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
