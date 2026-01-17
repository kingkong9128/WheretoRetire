import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { City } from '@/types/City';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const maxTemp = searchParams.get('maxTemp');
    const minHospitalScore = searchParams.get('minHospitalScore');
    const maxAqi = searchParams.get('maxAqi');

    try {
        // Read data from JSON file
        const jsonDirectory = path.join(process.cwd(), 'data');
        const filePath = path.join(jsonDirectory, 'cities.json');
        
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'Cities data not found' }, { status: 404 });
        }
        
        const fileContents = fs.readFileSync(filePath, 'utf8');
        let cities: City[] = JSON.parse(fileContents);

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
        console.error('Error reading cities data:', error);
        return NextResponse.json({ error: 'Failed to load cities data' }, { status: 500 });
    }
}
