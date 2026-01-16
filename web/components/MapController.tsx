'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { City } from '@/types/City';

// Dynamic import with no SSR
const Map = dynamic(() => import('./Map'), {
    ssr: false,
    loading: () => <div style={{ height: '100%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Map...</div>
});

const MapController = () => {
    const [places, setPlaces] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        maxTemp: 45,
        minHospitalScore: 0,
        maxAqi: 300
    });

    const fetchPlaces = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (filters.maxTemp < 45) queryParams.append('maxTemp', filters.maxTemp.toString());
            if (filters.minHospitalScore > 0) queryParams.append('minHospitalScore', filters.minHospitalScore.toString());
            if (filters.maxAqi < 300) queryParams.append('maxAqi', filters.maxAqi.toString());

            const res = await fetch(`/api/places?${queryParams.toString()}`);
            const data = await res.json();
            setPlaces(data);
        } catch (error) {
            console.error('Failed to fetch places:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaces();
    }, [filters]);

    const handleTempChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, maxTemp: parseInt(e.target.value) }));
    };

    const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, minHospitalScore: parseInt(e.target.value) }));
    };

    const handleAqiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, maxAqi: parseInt(e.target.value) }));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Filters Section */}
            <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Filters</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>

                    {/* Temperature Filter */}
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                            Max Summer Temperature: <span style={{ color: '#0070f3' }}>{filters.maxTemp}°C</span>
                        </label>
                        <input
                            type="range"
                            min="20"
                            max="45"
                            step="1"
                            value={filters.maxTemp}
                            onChange={handleTempChange}
                            style={{ width: '100%', accentColor: '#0070f3' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888' }}>
                            <span>20°C</span>
                            <span>45°C</span>
                        </div>
                    </div>

                    {/* Hospital Score Filter */}
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                            Min Hospital Score: <span style={{ color: '#0070f3' }}>{filters.minHospitalScore}+</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="10"
                            step="0.5"
                            value={filters.minHospitalScore}
                            onChange={handleScoreChange}
                            style={{ width: '100%', accentColor: '#0070f3' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888' }}>
                            <span>0</span>
                            <span>10</span>
                        </div>
                    </div>

                    {/* AQI Filter */}
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                            Max Average AQI: <span style={{ color: filters.maxAqi < 100 ? '#10b981' : filters.maxAqi < 200 ? '#f59e0b' : '#ef4444' }}>{filters.maxAqi}</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="300"
                            step="10"
                            value={filters.maxAqi}
                            onChange={handleAqiChange}
                            style={{ width: '100%', accentColor: '#0070f3' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888' }}>
                            <span>Clean (0)</span>
                            <span>Hazardous (300+)</span>
                        </div>
                    </div>

                </div>
                <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                    Found <strong>{places.length}</strong> locations matching your criteria.
                </div>
            </div>

            {/* Map Section */}
            <section style={{ height: '70vh', minHeight: '500px', border: '1px solid #ddd', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <Map places={places} />
            </section>
        </div>
    );
};

export default MapController;
