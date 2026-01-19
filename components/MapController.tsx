'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { City } from '@/types/City';
import { calculateMatchScore, UserPreferences } from '../utils/scoring';

// Dynamic import for Map
const Map = dynamic(() => import('./Map'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">Loading Map...</div>
});

const MapController = () => {
    const [allPlaces, setAllPlaces] = useState<City[]>([]);
    const [displayedPlaces, setDisplayedPlaces] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCityId, setSelectedCityId] = useState<number | null>(null);

    // Initial Prefs
    const [prefs, setPrefs] = useState<UserPreferences>({
        healthcareImportance: 5,
        cleanAirImportance: 5,
        warmthPreference: 5,
        lowCostImportance: 5
    });

    // Fetch Data
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

    // Scoring & Filtering
    useEffect(() => {
        if (allPlaces.length === 0) return;

        const scored = allPlaces.map(city => ({
            ...city,
            matchScore: calculateMatchScore(city, prefs)
        }));

        scored.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        setDisplayedPlaces(scored.slice(0, 50)); // Top 50

    }, [prefs, allPlaces]);

    const handlePrefChange = (key: keyof UserPreferences, value: number) => {
        setPrefs(prev => ({ ...prev, [key]: value }));
    };

    const handleCitySelect = (city: City) => {
        setSelectedCityId(city.id);
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-4">

            {/* LEFT SIDEBAR: FILTERS */}
            <aside className="w-full lg:w-80 bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-y-auto shrink-0">
                <h2 className="text-xl font-bold mb-1 text-gray-800">Preferences</h2>
                <p className="text-sm text-gray-500 mb-6">Tune your perfect retirement.</p>

                <div className="space-y-8">
                    {/* Healthcare */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="font-semibold text-gray-700">Healthcare</label>
                            <span className="text-xs text-blue-600 font-medium">{prefs.healthcareImportance}/10</span>
                        </div>
                        <input type="range" min="0" max="10" value={prefs.healthcareImportance}
                            onChange={(e) => handlePrefChange('healthcareImportance', parseInt(e.target.value))}
                            className="w-full accent-blue-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                        <p className="text-xs text-gray-400 mt-1">Weight given to top hospitals.</p>
                    </div>

                    {/* Air Quality */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="font-semibold text-gray-700">Clean Air</label>
                            <span className="text-xs text-green-600 font-medium">{prefs.cleanAirImportance}/10</span>
                        </div>
                        <input type="range" min="0" max="10" value={prefs.cleanAirImportance}
                            onChange={(e) => handlePrefChange('cleanAirImportance', parseInt(e.target.value))}
                            className="w-full accent-green-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                        <p className="text-xs text-gray-400 mt-1">Weight given to low AQI.</p>
                    </div>

                    {/* Warmth */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="font-semibold text-gray-700">Temperature</label>
                            <span className="text-xs text-orange-600 font-medium">{prefs.warmthPreference}/10</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Cool</span>
                            <span>Hot</span>
                        </div>
                        <input type="range" min="0" max="10" value={prefs.warmthPreference}
                            onChange={(e) => handlePrefChange('warmthPreference', parseInt(e.target.value))}
                            className="w-full accent-orange-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                    </div>

                    {/* Cost */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="font-semibold text-gray-700">Low Cost</label>
                            <span className="text-xs text-indigo-600 font-medium">{prefs.lowCostImportance}/10</span>
                        </div>
                        <input type="range" min="0" max="10" value={prefs.lowCostImportance}
                            onChange={(e) => handlePrefChange('lowCostImportance', parseInt(e.target.value))}
                            className="w-full accent-indigo-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                        <p className="text-xs text-gray-400 mt-1">Favor cheaper real estate.</p>
                    </div>
                </div>
            </aside>

            {/* CENTER: MAP */}
            <main className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative min-h-[400px]">
                <Map places={displayedPlaces} selectedCityId={selectedCityId} />
            </main>

            {/* RIGHT SIDEBAR: RANKED LIST */}
            <aside className="w-full lg:w-80 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col shrink-0">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-bold text-gray-700">Top Matches</h3>
                    <p className="text-xs text-gray-500">{displayedPlaces.length} cities found</p>
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-2">
                    {displayedPlaces.map((city, idx) => (
                        <div key={city.id}
                            onClick={() => handleCitySelect(city)}
                            className={`p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md ${selectedCityId === city.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-300'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm">{idx + 1}. {city.name}</h4>
                                    <span className="text-xs text-gray-500">{city.state}</span>
                                </div>
                                <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                                    {city.matchScore}%
                                </div>
                            </div>
                            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                                <span>🏠 ₹{city.realEstate.averagePricePerSqFt}/sqft</span>
                                <span>🏥 {city.healthcare.score}/10</span>
                            </div>
                        </div>
                    ))}
                    {displayedPlaces.length === 0 && !loading && (
                        <div className="p-4 text-center text-gray-400 text-sm">No matches found. Try adjusting filters.</div>
                    )}
                </div>
            </aside>
        </div>
    );
};

export default MapController;
