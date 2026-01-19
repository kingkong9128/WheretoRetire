'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { City } from '@/types/City';
import { calculateMatchScore, UserPreferences } from '../utils/scoring';

const Map = dynamic(() => import('./Map'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">Loading Map...</div>
});

const MapController = () => {
    const [allPlaces, setAllPlaces] = useState<City[]>([]);
    const [displayedPlaces, setDisplayedPlaces] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCityId, setSelectedCityId] = useState<number | null>(null);

    const [prefs, setPrefs] = useState<UserPreferences>({
        enableHealthcare: true,
        enableCleanAir: true,
        enableTemperature: true,
        enableLowCost: false,
        enableAirport: false,
        enableIntlAirport: false,
        enableNature: false,
        healthcareImportance: 8,
        cleanAirImportance: 8,
        warmthPreference: 5,
        lowCostImportance: 5,
        airportDistImportance: 5,
        intlAirportDistImportance: 5,
        naturePreference: 'Any'
    });

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

    useEffect(() => {
        if (allPlaces.length === 0) return;

        const scored = allPlaces.map(city => ({
            ...city,
            matchScore: calculateMatchScore(city, prefs)
        }));

        scored.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        setDisplayedPlaces(scored.slice(0, 50));

    }, [prefs, allPlaces]);

    const handlePrefChange = (key: keyof UserPreferences, value: number | boolean | string) => {
        setPrefs(prev => ({ ...prev, [key]: value }));
    };

    const handleCitySelect = (city: City) => {
        setSelectedCityId(city.id);
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-4">

            {/* LEFT SIDEBAR: FILTERS */}
            <motion.aside
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full lg:w-80 bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-y-auto shrink-0 flex flex-col"
            >
                <div className="flex-1">
                    <h2 className="text-xl font-bold mb-1 text-gray-800">Preferences</h2>
                    <p className="text-sm text-gray-500 mb-6">Select & Tune criteria.</p>

                    <div className="space-y-6">
                        {/* Healthcare */}
                        <div className={!prefs.enableHealthcare ? 'opacity-50' : ''}>
                            <div className="flex items-center justify-between mb-2">
                                <label className="flex items-center gap-2 font-semibold text-gray-700 cursor-pointer">
                                    <input type="checkbox" checked={prefs.enableHealthcare}
                                        onChange={(e) => handlePrefChange('enableHealthcare', e.target.checked)}
                                        className="rounded text-blue-600 focus:ring-blue-500" />
                                    Healthcare
                                </label>
                                <span className="text-xs text-blue-600 font-medium">{prefs.healthcareImportance}/10</span>
                            </div>
                            <input type="range" min="0" max="10" value={prefs.healthcareImportance} disabled={!prefs.enableHealthcare}
                                onChange={(e) => handlePrefChange('healthcareImportance', parseInt(e.target.value))}
                                className="w-full accent-blue-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                        </div>

                        {/* Air Quality */}
                        <div className={!prefs.enableCleanAir ? 'opacity-50' : ''}>
                            <div className="flex items-center justify-between mb-2">
                                <label className="flex items-center gap-2 font-semibold text-gray-700 cursor-pointer">
                                    <input type="checkbox" checked={prefs.enableCleanAir}
                                        onChange={(e) => handlePrefChange('enableCleanAir', e.target.checked)}
                                        className="rounded text-green-600 focus:ring-green-500" />
                                    Clean Air
                                </label>
                                <span className="text-xs text-green-600 font-medium">{prefs.cleanAirImportance}/10</span>
                            </div>
                            <input type="range" min="0" max="10" value={prefs.cleanAirImportance} disabled={!prefs.enableCleanAir}
                                onChange={(e) => handlePrefChange('cleanAirImportance', parseInt(e.target.value))}
                                className="w-full accent-green-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                        </div>

                        {/* Warmth */}
                        <div className={!prefs.enableTemperature ? 'opacity-50' : ''}>
                            <div className="flex items-center justify-between mb-2">
                                <label className="flex items-center gap-2 font-semibold text-gray-700 cursor-pointer">
                                    <input type="checkbox" checked={prefs.enableTemperature}
                                        onChange={(e) => handlePrefChange('enableTemperature', e.target.checked)}
                                        className="rounded text-orange-600 focus:ring-orange-500" />
                                    Temperature
                                </label>
                                <span className="text-xs text-orange-600 font-medium">{prefs.warmthPreference}/10</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Cold</span>
                                <span>Hot</span>
                            </div>
                            <input type="range" min="0" max="10" value={prefs.warmthPreference} disabled={!prefs.enableTemperature}
                                onChange={(e) => handlePrefChange('warmthPreference', parseInt(e.target.value))}
                                className="w-full accent-orange-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                        </div>

                        {/* Cost */}
                        <div className={!prefs.enableLowCost ? 'opacity-50' : ''}>
                            <div className="flex items-center justify-between mb-2">
                                <label className="flex items-center gap-2 font-semibold text-gray-700 cursor-pointer">
                                    <input type="checkbox" checked={prefs.enableLowCost}
                                        onChange={(e) => handlePrefChange('enableLowCost', e.target.checked)}
                                        className="rounded text-indigo-600 focus:ring-indigo-500" />
                                    Low Cost
                                </label>
                                <span className="text-xs text-indigo-600 font-medium">{prefs.lowCostImportance}/10</span>
                            </div>
                            <input type="range" min="0" max="10" value={prefs.lowCostImportance} disabled={!prefs.enableLowCost}
                                onChange={(e) => handlePrefChange('lowCostImportance', parseInt(e.target.value))}
                                className="w-full accent-indigo-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                        </div>

                        {/* Domestic Airport */}
                        <div className={!prefs.enableAirport ? 'opacity-50' : ''}>
                            <div className="flex items-center justify-between mb-2">
                                <label className="flex items-center gap-2 font-semibold text-gray-700 cursor-pointer">
                                    <input type="checkbox" checked={prefs.enableAirport}
                                        onChange={(e) => handlePrefChange('enableAirport', e.target.checked)}
                                        className="rounded text-purple-600 focus:ring-purple-500" />
                                    Near Airport (Dom)
                                </label>
                                <span className="text-xs text-purple-600 font-medium">{prefs.airportDistImportance}/10</span>
                            </div>
                            <input type="range" min="0" max="10" value={prefs.airportDistImportance} disabled={!prefs.enableAirport}
                                onChange={(e) => handlePrefChange('airportDistImportance', parseInt(e.target.value))}
                                className="w-full accent-purple-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                        </div>

                        {/* Intl Airport */}
                        <div className={!prefs.enableIntlAirport ? 'opacity-50' : ''}>
                            <div className="flex items-center justify-between mb-2">
                                <label className="flex items-center gap-2 font-semibold text-gray-700 cursor-pointer">
                                    <input type="checkbox" checked={prefs.enableIntlAirport}
                                        onChange={(e) => handlePrefChange('enableIntlAirport', e.target.checked)}
                                        className="rounded text-pink-600 focus:ring-pink-500" />
                                    Near Intl Airport
                                </label>
                                <span className="text-xs text-pink-600 font-medium">{prefs.intlAirportDistImportance}/10</span>
                            </div>
                            <input type="range" min="0" max="10" value={prefs.intlAirportDistImportance} disabled={!prefs.enableIntlAirport}
                                onChange={(e) => handlePrefChange('intlAirportDistImportance', parseInt(e.target.value))}
                                className="w-full accent-pink-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                        </div>

                        {/* Nature / Landscape */}
                        <div className={!prefs.enableNature ? 'opacity-50' : ''}>
                            <div className="flex items-center justify-between mb-2">
                                <label className="flex items-center gap-2 font-semibold text-gray-700 cursor-pointer">
                                    <input type="checkbox" checked={prefs.enableNature}
                                        onChange={(e) => handlePrefChange('enableNature', e.target.checked)}
                                        className="rounded text-teal-600 focus:ring-teal-500" />
                                    Landscape
                                </label>
                            </div>
                            <select
                                value={prefs.naturePreference}
                                disabled={!prefs.enableNature}
                                onChange={(e) => handlePrefChange('naturePreference', e.target.value)}
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                            >
                                <option value="Any">Any Landscape</option>
                                <option value="Hill">⛰️ Mountains / Hills</option>
                                <option value="Coastal">🏖️ Beaches / Coastal</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-500 leading-relaxed bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                        ℹ️ Methodology & Data Sources
                    </h4>
                    <ul className="space-y-2">
                        <li>
                            <span className="font-semibold text-gray-800">🏥 Healthcare:</span> Deterministic mapping of major hospital chains (Apollo, Medanta, Manipal, etc.) to 100+ cities.
                        </li>
                        <li>
                            <span className="font-semibold text-gray-800">🌫️ Air Quality (AQI):</span> Based on 2024 Reference Indices (Source: IQAir). High penalties for NCR/Industrial zones.
                        </li>
                        <li>
                            <span className="font-semibold text-gray-800">🏠 Real Estate:</span> Estimated Price/SqFt based on 2024-25 Tier 1/2/3 market trends.
                        </li>
                        <li>
                            <span className="font-semibold text-gray-800">✈️ Connectivity:</span> Exact Geodesic distances to nearest domestic/intl airports.
                        </li>
                        <li>
                            <span className="font-semibold text-gray-800">🌡️ Scoring Logic:</span> "Cold" preference strictly penalizes Summer Heat ({'>'}25°C). "Warm" preference penalizes Winter Cold ({'<'}15°C).
                        </li>
                    </ul>
                    <p className="mt-3 text-[10px] text-gray-400 italic">
                        *Disclaimer: This tool is a retirement planning simulation. While data is based on real-world indices, specific values are estimates for the MVP. Please verify locally.
                    </p>
                </div>
            </motion.aside>

            {/* CENTER: MAP */}
            <motion.main
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative min-h-[400px]"
            >
                <Map places={displayedPlaces} selectedCityId={selectedCityId} />
            </motion.main>

            {/* RIGHT SIDEBAR: RANKED LIST */}
            <motion.aside
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full lg:w-80 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col shrink-0"
            >
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-bold text-gray-700">Top Matches</h3>
                    <p className="text-xs text-gray-500">{displayedPlaces.length} cities found</p>
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-2">
                    <AnimatePresence mode='popLayout'>
                        {displayedPlaces.map((city, idx) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                key={city.id}
                                onClick={() => handleCitySelect(city)}
                                className={`p-3 rounded-lg border cursor-pointer hover:shadow-md ${selectedCityId === city.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-300'}`}
                            >
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
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {displayedPlaces.length === 0 && !loading && (
                        <div className="p-4 text-center text-gray-400 text-sm">No matches found. Try adjusting filters.</div>
                    )}
                </div>
            </motion.aside>
        </div>
    );
};

export default MapController;
