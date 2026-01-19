import { City } from '@/types/City';

export interface UserPreferences {
    // Enabled Flags
    enableHealthcare: boolean;
    enableCleanAir: boolean;
    enableTemperature: boolean;
    enableLowCost: boolean;
    enableAirport: boolean;
    enableIntlAirport: boolean;
    enableNature: boolean;

    // Weights / Values
    healthcareImportance: number; // 0-10
    cleanAirImportance: number;   // 0-10
    warmthPreference: number;     // 0-10 (0=Cold, 10=Hot)
    lowCostImportance: number;    // 0-10
    airportDistImportance: number; // 0-10 (High = wants < 50km)
    intlAirportDistImportance: number; // 0-10
    naturePreference: 'Any' | 'Hill' | 'Coastal';
}

export function calculateMatchScore(city: City, prefs: UserPreferences): number {
    let score = 0;
    let totalWeight = 0;

    // 0. Landscape Match (High Priority)
    if (prefs.enableNature && prefs.naturePreference !== 'Any') {
        if (city.landscape === prefs.naturePreference) {
            score += 100 * 10; // Massive boost for hard match
            totalWeight += 10;
        } else {
            // Mismatch = 0 points for this weight block
            score += 0;
            totalWeight += 10;
        }
    }

    // 1. Healthcare Score
    if (prefs.enableHealthcare && prefs.healthcareImportance > 0) {
        let healthScore = city.healthcare.score * 10;
        if (city.healthcare.chains.length > 0) {
            healthScore += Math.min(20, city.healthcare.chains.length * 5);
        }
        healthScore = Math.min(100, healthScore);
        score += healthScore * prefs.healthcareImportance;
        totalWeight += prefs.healthcareImportance;
    }

    // 2. Air Quality
    if (prefs.enableCleanAir && prefs.cleanAirImportance > 0) {
        const cappedAqi = Math.min(city.aqi, 300);
        const normalizedAqi = ((300 - cappedAqi) / 300) * 100;
        score += normalizedAqi * prefs.cleanAirImportance;
        totalWeight += prefs.cleanAirImportance;
    }

    // 3. Climate (Stricter Logic)
    if (prefs.enableTemperature && prefs.warmthPreference > 0) {
        const idealTemp = 10 + (prefs.warmthPreference * 2.5);
        const avgCityTemp = (city.climate.averageTempSummer + city.climate.averageTempWinter) / 2;

        const diff = Math.abs(avgCityTemp - idealTemp);
        let tempScore = 100 - (Math.pow(diff, 1.8) * 2);
        tempScore = Math.max(0, tempScore);

        score += tempScore * 5;
        totalWeight += 5;
    }

    // 4. Low Cost
    if (prefs.enableLowCost && prefs.lowCostImportance > 0) {
        const price = city.realEstate.averagePricePerSqFt;
        const normalizedCost = Math.max(0, 100 - ((price - 2000) / 130));
        score += normalizedCost * prefs.lowCostImportance;
        totalWeight += prefs.lowCostImportance;
    }

    // 5. Domestic Airport
    if (prefs.enableAirport && prefs.airportDistImportance > 0) {
        const dist = city.nearestDomesticAirport.distance;
        const airportScore = Math.max(0, 100 - Math.max(0, dist - 20) * 0.8);

        score += airportScore * prefs.airportDistImportance;
        totalWeight += prefs.airportDistImportance;
    }

    // 6. International Airport
    if (prefs.enableIntlAirport && prefs.intlAirportDistImportance > 0) {
        const dist = city.nearestInternationalAirport.distance;
        const intlScore = Math.max(0, 100 - Math.max(0, dist - 30) * 0.5);

        score += intlScore * prefs.intlAirportDistImportance;
        totalWeight += prefs.intlAirportDistImportance;
    }

    if (totalWeight === 0) return 0;

    return Math.round(score / totalWeight);
}
