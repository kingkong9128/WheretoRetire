'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { City } from '@/types/City';
import { calculateMatchScore, UserPreferences } from '../utils/scoring';
import { calculateDriveTime, formatTime } from '../utils/driveTime';

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
        minHospitalCount: 5, // Default constraint

        cleanAirImportance: 8,
        maxAqi: 200, // Default constraint

        warmthPreference: 5,


        lowCostImportance: 5,
        maxPriceSqFt: 15000, // Default constraint

        airportDistImportance: 5,
        maxDriveTimeDomestic: 2, // Default constraint (Domestic)
        maxDriveTimeInternational: 4, // Default constraint (Intl)

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

        let filtered = allPlaces;

        // 1. HARD FILTER: Nature
        if (prefs.enableNature && prefs.naturePreference !== 'Any') {
            filtered = filtered.filter(city => city.landscape === prefs.naturePreference);
        }

        // 2. HARD FILTER: Cost
        if (prefs.enableLowCost) {
            filtered = filtered.filter(city => city.realEstate.averagePricePerSqFt <= prefs.maxPriceSqFt);
        }

        // 3. HARD FILTER: AQI
        if (prefs.enableCleanAir) {
            filtered = filtered.filter(city => city.aqi <= prefs.maxAqi);
        }

        // 4. HARD FILTER: Healthcare
        if (prefs.enableHealthcare) {
            filtered = filtered.filter(city => city.healthcare.hospitalCount >= prefs.minHospitalCount);
        }

        const scored = filtered.map(city => {
            // Pre-calculate drive times dynamically
            city.nearestDomesticAirport.driveTimeMinutes = calculateDriveTime(
                city.nearestDomesticAirport.distance,
                city.landscape
            );
            city.nearestInternationalAirport.driveTimeMinutes = calculateDriveTime(
                city.nearestInternationalAirport.distance,
                city.landscape
            );

            return {
                ...city,
                matchScore: calculateMatchScore(city, prefs)
            };
        });

        // 5. HARD FILTER: Drive Time (Post Calculation)
        let finalDisplay = scored;

        // Filter Domestic
        if (prefs.enableAirport) {
            finalDisplay = finalDisplay.filter(c => (c.nearestDomesticAirport.driveTimeMinutes || 999) <= (prefs.maxDriveTimeDomestic * 60));
        }

        // Filter International
        if (prefs.enableIntlAirport) {
            finalDisplay = finalDisplay.filter(c => (c.nearestInternationalAirport.driveTimeMinutes || 999) <= (prefs.maxDriveTimeInternational * 60));
        }

        finalDisplay.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        setDisplayedPlaces(finalDisplay.slice(0, 50));

    }, [prefs, allPlaces]);

    const [showFilters, setShowFilters] = useState(false);

    const handlePrefChange = (key: keyof UserPreferences, value: number | boolean | string) => {
        setPrefs(prev => ({ ...prev, [key]: value }));
    };

    const handleCitySelect = (city: City) => {
        setSelectedCityId(city.id);
    };

    return (
        <div className="flex flex-col lg:flex-row h-full gap-4 relative">

            {/* MOBILE: FILTER TOGGLE BUTTON (Floating Overlay) */}
            <div className="lg:hidden absolute top-4 right-4 z-[500]">
                <button
                    onClick={() => setShowFilters(true)}
                    className="bg-white text-blue-600 px-4 py-2 rounded-full font-bold shadow-lg border border-blue-100 flex items-center gap-2 text-sm"
                >
                    <span className="text-lg">⚡</span>
                    <span>Filters</span>
                    <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full text-xs">{displayedPlaces.length}</span>
                </button>
            </div>

            {/* LEFT SIDEBAR: FILTERS */}
            <motion.aside
                initial={false}
                animate={typeof window !== 'undefined' && window.innerWidth < 1024 ? (showFilters ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }) : { x: 0, opacity: 1 }}
                className={`
                    bg-white p-6 shadow-xl border border-gray-100 overflow-y-auto flex flex-col
                    lg:w-80 lg:rounded-xl lg:static lg:border lg:shadow-sm
                    fixed inset-0 z-[9999] w-full h-full lg:h-auto
                    ${showFilters ? 'block' : 'hidden lg:flex'}
                `}
            >
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-4 lg:mb-1">
                        <h2 className="text-xl font-bold text-gray-800">Preferences</h2>
                        {/* MOBILE CLOSE */}
                        <button
                            onClick={() => setShowFilters(false)}
                            className="lg:hidden p-2 bg-gray-100 rounded-full text-gray-600"
                        >
                            ✕
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Tune your retirement criteria.</p>

                    {/* SEARCH BAR */}
                    <div className="mb-6 relative">
                        <input
                            type="text"
                            placeholder="Search for a city..."
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            onChange={(e) => {
                                const term = e.target.value.toLowerCase();
                                if (term.length > 2) {
                                    const match = displayedPlaces.find(p => p.name.toLowerCase().includes(term));
                                    if (match) handleCitySelect(match);
                                }
                            }}
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
                    </div>

                    <div className="space-y-6">
                        {/* Healthcare */}
                        <div className={!prefs.enableHealthcare ? 'opacity-50' : ''}>
                            <div className="flex items-center justify-between mb-2">
                                <label className="flex items-center gap-2 font-semibold text-gray-700 cursor-pointer">
                                    <input type="checkbox" checked={prefs.enableHealthcare}
                                        onChange={(e) => handlePrefChange('enableHealthcare', e.target.checked)}
                                        className="rounded text-blue-600 focus:ring-blue-500" />
                                    Healthcare Stats
                                </label>
                                <span className="text-xs text-blue-600 font-medium">{prefs.minHospitalCount}+ hospitals</span>
                            </div>
                            <input type="range" min="5" max="50" step="5" value={prefs.minHospitalCount} disabled={!prefs.enableHealthcare}
                                onChange={(e) => handlePrefChange('minHospitalCount', parseInt(e.target.value))}
                                className="w-full accent-blue-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                        </div>

                        {/* Air Quality */}
                        <div className={!prefs.enableCleanAir ? 'opacity-50' : ''}>
                            <div className="flex items-center justify-between mb-2">
                                <label className="flex items-center gap-2 font-semibold text-gray-700 cursor-pointer">
                                    <input type="checkbox" checked={prefs.enableCleanAir}
                                        onChange={(e) => handlePrefChange('enableCleanAir', e.target.checked)}
                                        className="rounded text-green-600 focus:ring-green-500" />
                                    Max AQI Limit
                                </label>
                            </div>
                            <select
                                value={prefs.maxAqi}
                                disabled={!prefs.enableCleanAir}
                                onChange={(e) => handlePrefChange('maxAqi', parseInt(e.target.value))}
                                className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white outline-none"
                            >
                                <option value="50">Good ({'<'}50)</option>
                                <option value="100">Satisfactory ({'<'}100)</option>
                                <option value="150">Moderate ({'<'}150)</option>
                                <option value="200">Poor ({'<'}200)</option>
                                <option value="300">Any (Up to 300)</option>
                            </select>
                        </div>

                        {/* Warmth (Keep as Ranking Weight) */}
                        <div className={!prefs.enableTemperature ? 'opacity-50' : ''}>
                            <div className="flex items-center justify-between mb-2">
                                <label className="flex items-center gap-2 font-semibold text-gray-700 cursor-pointer">
                                    <input type="checkbox" checked={prefs.enableTemperature}
                                        onChange={(e) => handlePrefChange('enableTemperature', e.target.checked)}
                                        className="rounded text-orange-600 focus:ring-orange-500" />
                                    Temperature Pref
                                </label>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Like Cold</span>
                                <span>Like Hot</span>
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
                                    Max Budget (₹/sqft)
                                </label>
                                <span className="text-xs text-indigo-600 font-medium">₹{prefs.maxPriceSqFt}</span>
                            </div>
                            <input type="range" min="3000" max="40000" step="1000" value={prefs.maxPriceSqFt} disabled={!prefs.enableLowCost}
                                onChange={(e) => handlePrefChange('maxPriceSqFt', parseInt(e.target.value))}
                                className="w-full accent-indigo-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                        </div>

                        {/* Domestic Airport */}
                        <div className={!prefs.enableAirport ? 'opacity-50' : ''}>
                            <div className="flex items-center justify-between mb-2">
                                <label className="flex items-center gap-2 font-semibold text-gray-700 cursor-pointer">
                                    <input type="checkbox" checked={prefs.enableAirport}
                                        onChange={(e) => handlePrefChange('enableAirport', e.target.checked)}
                                        className="rounded text-purple-600 focus:ring-purple-500" />
                                    Domestic Airport (Max Time)
                                </label>
                                <span className="text-xs text-purple-600 font-medium">{prefs.maxDriveTimeDomestic} hrs</span>
                            </div>
                            <input type="range" min="1" max="8" step="0.5" value={prefs.maxDriveTimeDomestic} disabled={!prefs.enableAirport}
                                onChange={(e) => handlePrefChange('maxDriveTimeDomestic', parseFloat(e.target.value))}
                                className="w-full accent-purple-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                        </div>

                        {/* Intl Airport */}
                        <div className={!prefs.enableIntlAirport ? 'opacity-50' : ''}>
                            <div className="flex items-center justify-between mb-2">
                                <label className="flex items-center gap-2 font-semibold text-gray-700 cursor-pointer">
                                    <input type="checkbox" checked={prefs.enableIntlAirport}
                                        onChange={(e) => handlePrefChange('enableIntlAirport', e.target.checked)}
                                        className="rounded text-pink-600 focus:ring-pink-500" />
                                    Intl Airport (Max Time)
                                </label>
                                <span className="text-xs text-pink-600 font-medium">{prefs.maxDriveTimeInternational} hrs</span>
                            </div>
                            <input type="range" min="1" max="8" step="0.5" value={prefs.maxDriveTimeInternational} disabled={!prefs.enableIntlAirport}
                                onChange={(e) => handlePrefChange('maxDriveTimeInternational', parseFloat(e.target.value))}
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

                    {/* MOBILE: SHOW RESULTS BUTTON */}
                    <button
                        onClick={() => setShowFilters(false)}
                        className="mt-6 w-full py-3 bg-green-600 text-white rounded-lg font-bold shadow-md lg:hidden"
                    >
                        Show {displayedPlaces.length} Cities
                    </button>
                </div>
            </motion.aside>

            {/* CENTER: MAP */}
            <motion.main
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:flex-1 h-[35vh] lg:h-auto shrink-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative"
            >
                <Map places={displayedPlaces} selectedCityId={selectedCityId} />
            </motion.main>

            {/* RIGHT SIDEBAR: RANKED LIST */}
            <motion.aside
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full lg:w-80 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col lg:shrink-0 flex-1 min-h-0"
            >
                <div className="p-4 border-b border-gray-100 bg-gray-50 hidden lg:block">
                    <h3 className="font-bold text-gray-700">Top Matches</h3>
                    <p className="text-xs text-gray-500">{displayedPlaces.length} cities found</p>
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-2 pb-32 lg:pb-2">
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
