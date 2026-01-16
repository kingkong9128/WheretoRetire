import { City } from '@/types/City';

export interface UserPreferences {
    healthcareImportance: number; // 0-10
    cleanAirImportance: number;   // 0-10
    warmthPreference: number;     // 0-10 (0 = Cold, 10 = Hot)
    lowCostImportance: number;    // 0-10
}

export function calculateMatchScore(city: City, prefs: UserPreferences): number {
    let score = 0;
    let totalWeight = 0;

    // 1. Healthcare Score (Higher is better)
    if (prefs.healthcareImportance > 0) {
        // City Score is 0-10.
        const normalizedHealthcare = city.healthcare.score * 10; // 0-100
        score += normalizedHealthcare * prefs.healthcareImportance;
        totalWeight += prefs.healthcareImportance;
    }

    // 2. Air Quality (Lower AQI is better)
    if (prefs.cleanAirImportance > 0) {
        // Normalizing AQI: 0 (Best) to 300+ (Worst).
        // Let's cap at 300 for calculation.
        const cappedAqi = Math.min(city.aqi, 300);
        // Invert: 0 AQI should be 100 points, 300 AQI should be 0 points.
        const normalizedAqi = ((300 - cappedAqi) / 300) * 100;
        score += normalizedAqi * prefs.cleanAirImportance;
        totalWeight += prefs.cleanAirImportance;
    }

    // 3. Warmth Preference
    if (prefs.warmthPreference > 0) {
        // User wants Hot (10) -> Ideal Summer 40+, Winter 20+
        // User wants Cold (0) -> Ideal Summer <25, Winter <5

        // Scale user pref to target temp 15°C (pref 0) to 35°C (pref 10)
        const targetTemp = 15 + (prefs.warmthPreference * 2);

        // Calculate difference from city's average summer temp
        const diff = Math.abs(city.climate.averageTempSummer - targetTemp);

        // Normalize: 0 diff = 100 pts, >15 diff = 0 pts
        const normalizedTemp = Math.max(0, 100 - (diff * 6));

        score += normalizedTemp * (prefs.warmthPreference > 0 ? 5 : 0); // Fixed weight for temp matching? No, use slider as importance
        // Actually, "Warmth Preference" is usually "How much I like heat". 
        // Let's interpret "Importance" distinct from "Target". 
        // For simplicity V1: 
        // Slider = "Importance of Mild Weather" -> penalize extremes?
        // User Request: "select factors according to their importance".

        // Let's stick to interpretation: "Temperature Preference" acts as both target and importance?
        // Better: let's treat "Warmth" as a specific target match.
        // BUT the standard UI pattern is "Importance of X".
        // Let's assume "Climate Importance" slider + "Preferred Temp" slider?

        // To keep it simple: "Warmth Preference" slider (0=Chilly, 10=Hot).
        // And we assume High Importance (weight = 5 fixed).

        // REVISION: The prompt asks for "select factors according to their importance".
        // So we need specific importance sliders.
        // Let's add "Climate Importance" to the Prefs?
        // For now, let's use the passed `warmthPreference` as "Importance of being warm" (if high, wants hot places). 
        // If low (0), wants cold places? No, 0 usually means "Don't care" in importance sliders.

        // Let's use a standard "Importance" model for Climate too?
        // "Climate Comfort Importance" (0-10). If high, we look for "Ideal" (20-30C).
        // Let's stick to the interface defined: warmthPreference 0-10.
        // Interpretation: 5 is Neutral. 0 is Cold Lover. 10 is Heat Lover.
        // Deviation from 25C cost penalty?

        // Let's try: Target Temp = 10C + (warmthPreference * 2.5). Range 10C to 35C.
        // Importance = 5 (medium default).

        // BETTER APPROACH FOR V2: Split into "Target" and "Importance".
        // For this step, I'll assume warmthPreference is the TARGET temp proxy, and we assign a fixed high importance to it if it's set non-default??

        // Let's pivot:
        // warmthPreference IS the weight for "Warm Climate".
        // If 10 -> Favors high temps. score += normalizedHighTemp * 10
        // If 0 -> Favors low temps? Or just doesn't care about warmth?
        // Usually 0 importance means "ignore".

        // Let's go with: 
        // warmthPreference (Importance of Warm Weather). 
        // If 10: wants hottest cities.
        // If 0: ignores heat (doesn't specifically punish cold).

        // Users might want Cold. 
        // Let's Add "Cold Preference"?
        // Or just "Ideal Temperature" slider separately?

        // For simplicity/robustness:
        // warmthPreference indicates how much they want heat.
        // 0 = Neutral/Don't-care.
        // 10 = Wants Heat.

        // But most retirees want "Pleasant".
        // Let's change this to "Climate Stability Importance" (moderate temps).
        // If 10, penalize extremes (too hot OR too cold).
        // Ideal range 20-30C.

        // Let's use `warmthPreference` as "Importance of Moderate Climate" for now in the Code, 
        // effectively penalizing extremes.

        const idealTemp = 25;
        const diffFromIdeal = Math.abs(city.climate.averageTempSummer - idealTemp);
        const normalizedClimate = Math.max(0, 100 - (diffFromIdeal * 5)); // 100 if 25C, 0 if 45C or 5C.

        score += normalizedClimate * prefs.warmthPreference;
        totalWeight += prefs.warmthPreference;
    }

    // 4. Low Cost Importance
    if (prefs.lowCostImportance > 0) {
        let costScore = 0;
        if (city.costOfLiving === 'Low') costScore = 100;
        else if (city.costOfLiving === 'Medium') costScore = 50;
        else costScore = 0; // High cost

        score += costScore * prefs.lowCostImportance;
        totalWeight += prefs.lowCostImportance;
    }

    if (totalWeight === 0) return 0;

    return Math.round(score / totalWeight);
}
