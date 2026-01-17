import { NextResponse } from 'next/server';
import { City } from '@/types/City';

// Direct import of the JSON file
import citiesData from '../../../data/cities.json';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const maxTemp = searchParams.get('maxTemp');
    const minHospitalScore = searchParams.get('minHospitalScore');
    const maxAqi = searchParams.get('maxAqi');

    try {
        let cities: City[] = citiesData as City[];

        // Apply filters
        if (maxTemp) {
            const tempLimit = parseFloat(maxTemp);
            cities = cities.filter(city => city.climate.averageTempSummer <= tempLimit);
        }

        if (minHospitalScore) {
            const scoreLimit = parseFloat(minHospitalScore);
            cities = cities.filter(city => city.healthcare.score >= scoreLimit);
        }

        if (maxAqi) {
            const aqiLimit = parseFloat(maxAqi);
            cities = cities.filter(city => city.aqi <= aqiLimit);
        }

        return NextResponse.json(cities);
    } catch (error) {
        console.error('Error loading cities data:', error);
        return NextResponse.json({ error: 'Failed to load cities data' }, { status: 500 });
    }
}