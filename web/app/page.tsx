import React from 'react';
import MapController from '../components/MapController';

export default function Home() {
    return (
        <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
            <header style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Where to Retire? 🇮🇳</h1>
                <p style={{ fontSize: '1.2rem', color: '#666', lineHeight: '1.5' }}>
                    Interactive map to help you find the perfect retirement location in India.
                    <br />
                    <small>Use the filters below to find your ideal destination based on climate and healthcare.</small>
                </p>
            </header>

            <MapController />

            <footer style={{ marginTop: '50px', textAlign: 'center', color: '#9ca3af', fontSize: '0.9rem' }}>
                <p>Project: WheretoRetire | All data is estimated for demonstration purposes.</p>
            </footer>
        </main>
    );
}
