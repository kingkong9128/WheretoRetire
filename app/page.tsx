'use client';

import React from 'react';
import MapController from '../components/MapController';
import { motion } from 'framer-motion';

export default function Home() {
    return (
        <main className="h-[100dvh] bg-gray-50 flex flex-col overflow-hidden">
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm z-10"
            >
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Where to Retire? 🇮🇳</h1>
                        <p className="text-sm text-gray-500">Find your perfect city based on climate, healthcare, and cost.</p>
                    </div>
                </div>
            </motion.header>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex-1 p-4 lg:p-6 overflow-hidden max-w-[1600px] mx-auto w-full"
            >
                <MapController />
            </motion.div>
        </main>
    );
}
