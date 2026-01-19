export interface Climate {
    averageTempSummer: number;
    averageTempWinter: number;
    temperatureRange: string;
    humidity: 'High' | 'Moderate' | 'Low';
    annualRainfall: number;
}

export interface AirportInfo {
    name: string;
    distance: number;
}

export interface Healthcare {
    hospitalCount: number;
    score: number;
    chains: string[];
}

export interface RealEstate {
    averagePricePerSqFt: number;
    currency: string;
}

export interface City {
    id: number;
    name: string;
    state: string;
    lat: number;
    lng: number;
    description: string;
    climate: Climate;
    aqi: number;
    healthcare: Healthcare;
    realEstate: RealEstate;
    costOfLiving: 'Low' | 'Medium' | 'High';
    nearestDomesticAirport: AirportInfo;
    nearestInternationalAirport: AirportInfo;
    matchScore?: number;
}
