import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { City } from '@/types/City';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const maxTemp = searchParams.get('maxTemp');
    const minHospitalScore = searchParams.get('minHospitalScore');
    const maxAqi = searchParams.get('maxAqi');

    // Read data from JSON file
    const jsonDirectory = path.join(process.cwd(), 'data');
    const fileContents = fs.readFileSync(jsonDirectory + '/cities.json', 'utf8');
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
}
