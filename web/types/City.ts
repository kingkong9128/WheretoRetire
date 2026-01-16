export interface Climate {
    averageTempSummer: number;
    averageTempWinter: number;
    temperatureRange: string; // e.g. "15-35°C"
    humidity: 'High' | 'Moderate' | 'Low';
    annualRainfall: number; // in mm
}

export interface NearestAirport {
    name: string;
    distance: number; // in km
    type: 'International' | 'Domestic';
}

export interface Healthcare {
    hospitalCount: number;
    score: number;
}

export interface City {
    id: number;
    name: string;
    state: string;
    lat: number;
    lng: number;
    description: string;
    climate: Climate;
    aqi: number; // Average annual AQI
    healthcare: Healthcare;
    costOfLiving: 'Low' | 'Medium' | 'High';
    nearestAirport: NearestAirport;
}
