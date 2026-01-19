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
        let maxAqi = 300;
        const cappedAqi = Math.min(city.aqi, maxAqi);
        // Normalized: 0 AQI = 100 score, 300 AQI = 0 score.
        const normalizedAqi = ((maxAqi - cappedAqi) / maxAqi) * 100;
        score += normalizedAqi * prefs.cleanAirImportance;
        totalWeight += prefs.cleanAirImportance;
    }

    // 3. Climate (Asymmetric Scoring)
    if (prefs.enableTemperature) {
        let tempScore = 0;

        if (prefs.warmthPreference < 5) {
            // WANTS COLD. Penalize Heat.
            // Ideal Summer Max: < 25°C.
            // Penalize heavily as it goes above 30°C.
            const summerTemp = city.climate.averageTempSummer;
            if (summerTemp <= 25) {
                tempScore = 100;
            } else {
                // e.g. 30C -> diff 5 -> score 100 - 25 = 75
                // e.g. 35C -> diff 10 -> score 100 - 100 = 0
                // e.g. 40C -> diff 15 -> score 0
                const diff = summerTemp - 25;
                tempScore = Math.max(0, 100 - (Math.pow(diff, 2)));
            }
        } else {
            // WANTS WARM. Penalize Cold.
            // Ideal Winter Min: > 15°C.
            // Penalize if it drops below 10°C.
            const winterTemp = city.climate.averageTempWinter;
            if (winterTemp >= 15) {
                tempScore = 100;
            } else {
                // e.g. 10C -> diff 5 -> score 75
                // e.g. 5C -> diff 10 -> score 0
                const diff = 15 - winterTemp;
                tempScore = Math.max(0, 100 - (Math.pow(diff, 2)));
            }
        }

        // Increase weight for Temperature as it's a primary comfort factor
        // If preference is very strong (0 or 10), apply higher weight.
        const weight = 15;
        score += tempScore * weight;
        totalWeight += weight;
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
