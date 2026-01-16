'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamic import with no SSR, as Leaflet requires window
const Map = dynamic(() => import('../components/Map'), {
    ssr: false,
    loading: () => <div style={{ height: '100%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Map...</div>
});

export default function Home() {
    return (
        <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
            <header style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Where to Retire? 🇮🇳</h1>
                <p style={{ fontSize: '1.2rem', color: '#666', lineHeight: '1.5' }}>
                    Interactive map to help you find the perfect retirement location in India.
                    <br />
                    <small>Currently showing calibrated top destinations.</small>
                </p>
            </header>

            <section style={{ height: '70vh', minHeight: '500px', border: '1px solid #ddd', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <Map />
            </section>

            <div style={{ marginTop: '30px', padding: '20px', background: '#f9fafb', borderRadius: '8px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Comming Soon Features</h2>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#4b5563' }}>
                    <li>Filter by Weather (Temperature, Humidity, Air Quality)</li>
                    <li>Healthcare Access Score (Hospital density)</li>
                    <li>Cost of Living Index</li>
                    <li>Safety & Pollution Heatmaps</li>
                </ul>
            </div>

            <footer style={{ marginTop: '50px', textAlign: 'center', color: '#9ca3af', fontSize: '0.9rem' }}>
                <p>Project: WheretoRetire | Phase 1: Barebones Map</p>
            </footer>
        </main>
    );
}
