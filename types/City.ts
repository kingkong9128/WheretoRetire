export interface Climate {
    averageTempSummer: number;
    averageTempWinter: number;
    temperatureRange: string;
    humidity: string;
    annualRainfall: number;
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
    description: string;
    climate: Climate;
    healthcare: Healthcare;
    realEstate: RealEstate;
    costOfLiving: string;
    aqi: number;
    nearestDomesticAirport: {
        name: string;
        distance: number;
        code: string;
        driveTimeMinutes?: number;
    };
    nearestInternationalAirport: {
        name: string;
        distance: number;
        code: string;
        driveTimeMinutes?: number;
    };
    landscape: string;
    matchScore?: number;
    lat: number;
    lng: number;
}
