import { City } from '@/types/City';

export interface UserPreferences {
    healthcareImportance: number; // 0-10
    cleanAirImportance: number;   // 0-10
    warmthPreference: number;     // 0-10
    lowCostImportance: number;    // 0-10
}

export function calculateMatchScore(city: City, prefs: UserPreferences): number {
    let score = 0;
    let totalWeight = 0;

    // 1. Healthcare Score (Higher is better)
    if (prefs.healthcareImportance > 0) {
        // Base score 0-10 -> 0-100
        let healthScore = city.healthcare.score * 10;

        // Bonus for having major chains (up to 20 extra points)
        if (city.healthcare.chains.length > 0) {
            healthScore += Math.min(20, city.healthcare.chains.length * 5);
        }

        // Cap at 100
        healthScore = Math.min(100, healthScore);

        score += healthScore * prefs.healthcareImportance;
        totalWeight += prefs.healthcareImportance;
    }

    // 2. Air Quality (Lower AQI is better)
    if (prefs.cleanAirImportance > 0) {
        // Cap worst at 300
        const cappedAqi = Math.min(city.aqi, 300);
        const normalizedAqi = ((300 - cappedAqi) / 300) * 100;
        score += normalizedAqi * prefs.cleanAirImportance;
        totalWeight += prefs.cleanAirImportance;
    }

    // 3. Climate / Warmth Preference
    if (prefs.warmthPreference > 0) {
        // Preference for "Moderate to Warm" vs "Cold"?
        // Let's implement simple logic: User Preference 0-10.
        // 5 = Neutral/Moderate (25C ideal).
        // 10 = Likes Hot (35C ideal).
        // 0 = Likes Cold (15C ideal).

        const idealTemp = 15 + (prefs.warmthPreference * 2); // Map 0->15, 10->35
        const diff = Math.abs(city.climate.averageTempSummer - idealTemp);

        // 100 points if match, 0 if >15 degrees off
        const normalizedTemp = Math.max(0, 100 - (diff * 6));

        score += normalizedTemp * 5; // Fixed weight of 5 for Climate IF preference set
        totalWeight += 5;

        // Note: Using fixed weight here to behave like other sliders if they were set to 5.
        // Or we can use `prefs.warmthPreference` as importance? 
        // The implementation plan suggested using it as Target. Let's stick to fixed weight impact for now.
    }

    // 4. Low Cost / Real Estate Preference
    if (prefs.lowCostImportance > 0) {
        // Real Estate Price per SqFt. Low is better.
        // Range: 2500 (Cheap) to 40000 (Expensive).
        // Normalize: 2500 -> 100, 20000+ -> 0.

        const price = city.realEstate.averagePricePerSqFt;
        const normalizedCost = Math.max(0, 100 - ((price - 2500) / 175)); // roughly decreases 1 pt per 175 INR increase

        score += normalizedCost * prefs.lowCostImportance;
        totalWeight += prefs.lowCostImportance;
    }

    // 5. Connectivity Bonus (Implicit)
    // If we had a "Connectivity Importance" slider, we'd use it.
    // For now, let's just add a small flat bonus to total score if Intl Airport is close (<50km)
    // to differentiate Tier 1/2 from remote towns, as retirees often travel.
    // We won't weight it heavily.
    if (city.nearestInternationalAirport.distance < 60) {
        score += 5 * 2; // Flat 10 points bonus equivalent? 
        // No, need to integrate into weighted average or post-process.
        // Let's ignore for calculation purity unless user asked.
    }

    if (totalWeight === 0) return 0;

    return Math.round(score / totalWeight);
}
