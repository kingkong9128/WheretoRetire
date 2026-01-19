'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { City } from '@/types/City';
import { calculateMatchScore, UserPreferences } from '../utils/scoring';

// Dynamic import with no SSR
const Map = dynamic(() => import('./Map'), {
    ssr: false,
    loading: () => <div style={{ height: '100%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Map...</div>
});

const MapController = () => {
    const [allPlaces, setAllPlaces] = useState<City[]>([]);
    const [displayedPlaces, setDisplayedPlaces] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);

    // Scoring Preferences
    const [prefs, setPrefs] = useState<UserPreferences>({
        healthcareImportance: 5,
        cleanAirImportance: 5,
        warmthPreference: 5,
        lowCostImportance: 5
    });

    // Fetch all data once
    useEffect(() => {
        const initData = async () => {
            try {
                const res = await fetch('/api/places');
                const data = await res.json();
                setAllPlaces(data);
            } catch (error) {
                console.error("Failed to load cities", error);
            } finally {
                setLoading(false);
            }
        };
        initData();
    }, []);

    // Recalculate scores when prefs change
    useEffect(() => {
        if (allPlaces.length === 0) return;

        const scored = allPlaces.map(city => ({
            ...city,
            matchScore: calculateMatchScore(city, prefs)
        }));

        // Sort by match score descending
        scored.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

        // Filter out low matches (e.g. below 40%) to keep map clean? 
        // Or just show top 30?
        // Let's show Top 50 to ensure coverage but not chaos.
        setDisplayedPlaces(scored.slice(0, 50));

    }, [prefs, allPlaces]);

    const handlePrefChange = (key: keyof UserPreferences, value: number) => {
        setPrefs(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Weighted Filters Section */}
            <div style={{ padding: '25px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0' }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.2rem', color: '#111' }}>
                    🎓 Personalize Your Retirement
                    <span style={{ display: 'block', fontSize: '0.9rem', color: '#666', fontWeight: 'normal', marginTop: '5px' }}>
                        Adjust sliders to tell us what matters most to you. We'll rank 85+ cities to find your perfect match.
                    </span>
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '30px' }}>

                    {/* Healthcare Importance */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#333' }}>
                            🏥 Healthcare Quality
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.8rem', color: '#888' }}>Neutral</span>
                            <input
                                type="range" min="0" max="10" step="1"
                                value={prefs.healthcareImportance}
                                onChange={(e) => handlePrefChange('healthcareImportance', parseInt(e.target.value))}
                                style={{ flex: 1, accentColor: '#ef4444' }}
                            />
                            <span style={{ fontSize: '0.8rem', color: '#888' }}>Critical</span>
                        </div>
                    </div>

                    {/* Clean Air Importance */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#333' }}>
                            🍃 Clean Air (AQI)
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.8rem', color: '#888' }}>Neutral</span>
                            <input
                                type="range" min="0" max="10" step="1"
                                value={prefs.cleanAirImportance}
                                onChange={(e) => handlePrefChange('cleanAirImportance', parseInt(e.target.value))}
                                style={{ flex: 1, accentColor: '#10b981' }}
                            />
                            <span style={{ fontSize: '0.8rem', color: '#888' }}>Critical</span>
                        </div>
                    </div>

                    {/* Warmth Preference */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#333' }}>
                            ☀️ Climate Preference
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.8rem', color: '#888' }}>❄️ Cool</span>
                            <input
                                type="range" min="0" max="10" step="1"
                                value={prefs.warmthPreference}
                                onChange={(e) => handlePrefChange('warmthPreference', parseInt(e.target.value))}
                                style={{ flex: 1, accentColor: '#f59e0b' }}
                            />
                            <span style={{ fontSize: '0.8rem', color: '#888' }}>🔥 Warm</span>
                        </div>
                    </div>

                    {/* Cost Importance */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#333' }}>
                            💰 Low Cost of Living
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.8rem', color: '#888' }}>Whatever</span>
                            <input
                                type="range" min="0" max="10" step="1"
                                value={prefs.lowCostImportance}
                                onChange={(e) => handlePrefChange('lowCostImportance', parseInt(e.target.value))}
                                style={{ flex: 1, accentColor: '#6366f1' }}
                            />
                            <span style={{ fontSize: '0.8rem', color: '#888' }}>Vital</span>
                        </div>
                    </div>

                </div>
                <div style={{ marginTop: '20px', fontSize: '14px', color: '#666', borderTop: '1px solid #f0f0f0', paddingTop: '15px' }}>
                    Showing top <strong>{displayedPlaces.length}</strong> matches sorted by your unique score.
                </div>
            </div>

            {/* Map Section */}
            <section style={{ height: '70vh', minHeight: '500px', border: '1px solid #ddd', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <Map places={displayedPlaces} />
            </section>
        </div>
    );
};

export default MapController;
