export interface Climate {
    averageTempSummer: number;
    averageTempWinter: number;
    humidity: 'High' | 'Moderate' | 'Low';
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
    healthcare: Healthcare;
    costOfLiving: 'Low' | 'Medium' | 'High';
}
