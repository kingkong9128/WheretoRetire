
// Estimates based on Indian Road Conditions (2025)
const SPEEDS = {
    "Hill": 30,      // Winding roads, slow (e.g., Shimla, Ooty)
    "Coastal": 50,   // Often single lane highways
    "Plain": 60,     // National Highways
    "Metro": 65      // Connects to Expressways
};

/**
 * Calculates estimated drive time in minutes based on distance and landscape type.
 */
export function calculateDriveTime(distanceKm: number, landscape: string): number {
    // Default to Plain speed if unknown
    const speed = SPEEDS[landscape as keyof typeof SPEEDS] || 50;

    // Time = Distance / Speed * 60 min
    // Add 15 mins buffer strictly for traffic/stops
    return Math.round((distanceKm / speed) * 60) + 15;
}

export function formatTime(minutes: number): string {
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
}
