import json
import random

# Helper to categorize cost of living
def get_col(size_tier):
    if size_tier == 1: return "High"
    if size_tier == 2: return "Medium"
    return "Low"

# Base City Data - Name, State, Lat, Lng, Tier (1=Metro, 2=City, 3=Town), Elevation(m)
# Elevation helps guess temp/climate
raw_cities = [
    # North
    ("Delhi", "Delhi", 28.61, 77.20, 1, 216),
    ("Gurgaon", "Haryana", 28.45, 77.02, 1, 217),
    ("Noida", "Uttar Pradesh", 28.53, 77.39, 1, 200),
    ("Chandigarh", "Chandigarh", 30.73, 76.77, 2, 321),
    ("Dehradun", "Uttarakhand", 30.31, 78.03, 2, 435),
    ("Shimla", "Himachal Pradesh", 31.10, 77.17, 3, 2276),
    ("Manali", "Himachal Pradesh", 32.23, 77.18, 3, 2050),
    ("Dharamshala", "Himachal Pradesh", 32.21, 76.32, 3, 1457),
    ("Jaipur", "Rajasthan", 26.91, 75.78, 2, 431),
    ("Udaipur", "Rajasthan", 24.58, 73.71, 3, 598),
    ("Jodhpur", "Rajasthan", 26.23, 73.02, 3, 231),
    ("Lucknow", "Uttar Pradesh", 26.84, 80.94, 2, 123),
    ("Varanasi", "Uttar Pradesh", 25.31, 82.97, 3, 81),
    ("Agra", "Uttar Pradesh", 27.17, 78.00, 3, 170),
    ("Amritsar", "Punjab", 31.63, 74.87, 2, 234),
    ("Ludhiana", "Punjab", 30.90, 75.85, 2, 244),
    ("Jalandhar", "Punjab", 31.32, 75.57, 3, 229),
    ("Srinagar", "Jammu & Kashmir", 34.08, 74.79, 2, 1585),
    ("Jammu", "Jammu & Kashmir", 32.72, 74.85, 3, 327),
    ("Allahabad", "Uttar Pradesh", 25.43, 81.84, 3, 98),
    ("Kanpur", "Uttar Pradesh", 26.44, 80.33, 2, 126),
    ("Kota", "Rajasthan", 25.21, 75.86, 3, 271),
    ("Haridwar", "Uttarakhand", 29.94, 78.16, 3, 314),
    ("Rishikesh", "Uttarakhand", 30.08, 78.26, 3, 372),
    ("Mussoorie", "Uttarakhand", 30.45, 78.07, 3, 2005),
    ("Nainital", "Uttarakhand", 29.39, 79.45, 3, 2084),

    # West
    ("Mumbai", "Maharashtra", 19.07, 72.87, 1, 14),
    ("Pune", "Maharashtra", 18.52, 73.85, 1, 560),
    ("Nagpur", "Maharashtra", 21.14, 79.08, 2, 310),
    ("Nashik", "Maharashtra", 19.99, 73.78, 2, 600),
    ("Aurangabad", "Maharashtra", 19.87, 75.34, 3, 568),
    ("Ahmedabad", "Gujarat", 23.02, 72.57, 1, 53),
    ("Surat", "Gujarat", 21.17, 72.83, 2, 13),
    ("Vadodara", "Gujarat", 22.30, 73.18, 2, 39),
    ("Rajkot", "Gujarat", 22.30, 70.80, 2, 128),
    ("Gandhinagar", "Gujarat", 23.21, 72.63, 3, 81),
    ("Goa (Panaji)", "Goa", 15.49, 73.82, 3, 7),
    ("Vasco da Gama", "Goa", 15.39, 73.81, 3, 6),
    ("Thane", "Maharashtra", 19.21, 72.97, 2, 8),
    ("Kolhapur", "Maharashtra", 16.70, 74.24, 3, 545),
    ("Solapur", "Maharashtra", 17.65, 75.90, 3, 458),
    ("Amravati", "Maharashtra", 20.93, 77.75, 3, 343),
    ("Bhavnagar", "Gujarat", 21.76, 72.15, 3, 24),
    ("Jamnagar", "Gujarat", 22.47, 70.05, 3, 20),
    ("Lonavala", "Maharashtra", 18.75, 73.40, 3, 624),
    ("Mahabaleshwar", "Maharashtra", 17.93, 73.64, 3, 1353),

    # South
    ("Bangalore", "Karnataka", 12.97, 77.59, 1, 920),
    ("Mysore", "Karnataka", 12.29, 76.63, 2, 763),
    ("Mangalore", "Karnataka", 12.91, 74.85, 2, 22),
    ("Hubli", "Karnataka", 15.36, 75.12, 3, 670),
    ("Belgaum", "Karnataka", 15.84, 74.49, 3, 762),
    ("Chennai", "Tamil Nadu", 13.08, 80.27, 1, 6),
    ("Coimbatore", "Tamil Nadu", 11.01, 76.95, 2, 411),
    ("Madurai", "Tamil Nadu", 9.92, 78.11, 2, 101),
    ("Trichy", "Tamil Nadu", 10.79, 78.70, 2, 88),
    ("Salem", "Tamil Nadu", 11.66, 78.14, 3, 278),
    ("Vellore", "Tamil Nadu", 12.91, 79.13, 3, 216),
    ("Tirunelveli", "Tamil Nadu", 8.71, 77.75, 3, 47),
    ("Hyderabad", "Telangana", 17.38, 78.48, 1, 542),
    ("Warangal", "Telangana", 17.96, 79.59, 3, 266),
    ("Visakhapatnam", "Andhra Pradesh", 17.68, 83.21, 2, 45),
    ("Vijayawada", "Andhra Pradesh", 16.50, 80.64, 2, 11),
    ("Tirupati", "Andhra Pradesh", 13.62, 79.41, 3, 162),
    ("Kochi", "Kerala", 9.93, 76.26, 2, 1),
    ("Thiruvananthapuram", "Kerala", 8.52, 76.93, 2, 10),
    ("Kozhikode", "Kerala", 11.25, 75.78, 2, 1),
    ("Thrissur", "Kerala", 10.52, 76.21, 3, 2),
    ("Pondicherry", "Puducherry", 11.94, 79.80, 2, 3),
    ("Ooty", "Tamil Nadu", 11.41, 76.69, 3, 2240),
    ("Munnar", "Kerala", 10.08, 77.05, 3, 1532),
    ("Kodaikanal", "Tamil Nadu", 10.23, 77.48, 3, 2133),
    ("Coorg (Madikeri)", "Karnataka", 12.42, 75.73, 3, 1150),
    ("Alleppey", "Kerala", 9.49, 76.33, 3, 1),

    # East
    ("Kolkata", "West Bengal", 22.57, 88.36, 1, 9),
    ("Howrah", "West Bengal", 22.59, 88.31, 2, 12),
    ("Darjeeling", "West Bengal", 27.04, 88.26, 3, 2042),
    ("Siliguri", "West Bengal", 26.72, 88.39, 3, 122),
    ("Bhubaneswar", "Odisha", 20.29, 85.82, 2, 45),
    ("Cuttack", "Odisha", 20.46, 85.88, 3, 36),
    ("Puri", "Odisha", 19.81, 85.83, 3, 0),
    ("Rourkela", "Odisha", 22.26, 84.85, 3, 218),
    ("Patna", "Bihar", 25.59, 85.13, 2, 53),
    ("Gaya", "Bihar", 24.79, 85.00, 3, 111),
    ("Ranchi", "Jharkhand", 23.34, 85.30, 2, 651),
    ("Jamshedpur", "Jharkhand", 22.80, 86.20, 2, 135),
    ("Guwahati", "Assam", 26.14, 91.73, 2, 51),
    ("Shillong", "Meghalaya", 25.57, 91.88, 3, 1525),
    ("Gangtok", "Sikkim", 27.33, 88.61, 3, 1650),
    ("Imphal", "Manipur", 24.81, 93.93, 3, 786),
    ("Agartala", "Tripura", 23.83, 91.28, 3, 12),

    # Central
    ("Bhopal", "Madhya Pradesh", 23.25, 77.41, 2, 527),
    ("Indore", "Madhya Pradesh", 22.71, 75.85, 2, 553),
    ("Gwalior", "Madhya Pradesh", 26.21, 78.18, 2, 212),
    ("Jabalpur", "Madhya Pradesh", 23.18, 79.98, 2, 412),
    ("Ujjain", "Madhya Pradesh", 23.17, 75.78, 3, 494),
    ("Raipur", "Chhattisgarh", 21.25, 81.62, 2, 291),
    ("Bilaspur", "Chhattisgarh", 22.07, 82.14, 3, 264),
]

def estimate_city_data(city):
    name, state, lat, lng, tier, elev = city
    
    # Estimate Temp based on Elevation and Latitude
    # Higher elevation = cooler. Lower latitude = steady warm.
    base_summer = 40
    base_winter = 15
    
    if elev > 1000: # Hill station
        base_summer = 25
        base_winter = 2
    elif elev > 500: # Plateau
        base_summer = 36
        base_winter = 12
    elif lat > 26: # North India Plains
        base_summer = 42
        base_winter = 6
    elif lat < 20: # South/Coastal
        base_summer = 34
        base_winter = 22

    # Noise
    temp_s = round(base_summer + random.uniform(-2, 2))
    temp_w = round(base_winter + random.uniform(-2, 2))

    # Rainfall Guesses (Coastal/South/East = High, West/North = Low/Med)
    rain = 800
    if lng > 88 or (lat < 16 and lng < 77): rain = 2500 # Northeast or Kerala
    elif lat > 28 and elev < 1000: rain = 600 # North plains
    elif lat < 20 and lng > 80: rain = 1500 # East coast
    rain = round(rain + random.uniform(-100, 200))

    # AQI Calibration
    # Tier 1 = Bad, Hill stations = Good
    aqi = 100
    if tier == 1: aqi = 180 + random.randint(-20, 50)
    elif tier == 2: aqi = 110 + random.randint(-20, 40)
    elif elev > 1000: aqi = 40 + random.randint(0, 20)
    else: aqi = 90 + random.randint(-10, 30)
    
    # Specific AQI Overrides for known polluted/clean cities
    if "Delhi" in name or "Noida" in name or "Gurgaon" in name: aqi = 250
    if "Mysore" in name: aqi = 50

    # Hospital Score (Tier 1 = Good quantity/quality but crowded, Tier 2 = Sweet spot?)
    # Generally Tier 1 > Tier 2 > Tier 3
    h_score = 7.0
    h_count = 10
    if tier == 1:
        h_score = 9.2 + random.uniform(0, 0.6)
        h_count = 100 + random.randint(0, 100)
    elif tier == 2:
        h_score = 8.5 + random.uniform(0, 1.0)
        h_count = 40 + random.randint(0, 30)
    else:
        h_score = 7.0 + random.uniform(0, 1.5)
        h_count = 15 + random.randint(0, 15)
        if elev > 1000: h_count = 10 # Hill stations fewer hospitals

    h_score = round(min(h_score, 10), 1)

    # Airport logic
    air_type = "Domestic"
    air_dist = random.randint(5, 30)
    if tier == 1 or "Goa" in name or "Kochi" in name or "Amritsar" in name or "Trichy" in name:
        air_type = "International"

    return {
        "name": name,
        "state": state,
        "lat": lat,
        "lng": lng,
        "description": f"{'Metropolitan hub' if tier==1 else 'Exploring city' if tier==2 else 'Peaceful town'} in {state}.",
        "climate": {
            "averageTempSummer": temp_s,
            "averageTempWinter": temp_w,
            "temperatureRange": f"{temp_w}-{temp_s}°C",
            "humidity": "High" if (lat < 20 and lng < 80) or (lat < 22 and lng > 85) else "Moderate",
            "annualRainfall": rain
        },
        "aqi": aqi,
        "healthcare": {
            "hospitalCount": h_count,
            "score": h_score
        },
        "costOfLiving": get_col(tier),
        "nearestAirport": {
            "name": f"{name} Airport",
            "distance": air_dist,
            "type": air_type
        }
    }

final_cities = []
for city_raw in raw_cities:
    final_cities.append(estimate_city_data(city_raw))

# Identify IDs
for idx, c in enumerate(final_cities):
    c['id'] = idx + 1

print(json.dumps(final_cities, indent=2))
