import json
import random

# Helper to categorize cost of living
def get_col(size_tier):
    if size_tier == 1: return "High"
    if size_tier == 2: return "Medium"
    return "Low"

# Base City Data - Name, State, Lat, Lng, Tier, Elevation(m)
# Tier 1=Metro, 2=City, 3=Town/Suburb. 
# Suburbs are often Tier 3 but might have high Real Estate cost.
raw_cities = [
    # North
    ("Delhi", "Delhi", 28.61, 77.20, 1, 216),
    ("Gurgaon", "Haryana", 28.45, 77.02, 1, 217),
    ("Noida", "Uttar Pradesh", 28.53, 77.39, 1, 200),
    ("Greater Noida", "Uttar Pradesh", 28.47, 77.50, 2, 200),
    ("Ghaziabad", "Uttar Pradesh", 28.66, 77.45, 2, 210),
    ("Faridabad", "Haryana", 28.40, 77.31, 2, 198),
    ("Chandigarh", "Chandigarh", 30.73, 76.77, 2, 321),
    ("Mohali", "Punjab", 30.70, 76.71, 2, 316),
    ("Panchkula", "Haryana", 30.69, 76.86, 2, 365),
    ("Dehradun", "Uttarakhand", 30.31, 78.03, 2, 435),
    ("Shimla", "Himachal Pradesh", 31.10, 77.17, 3, 2276),
    ("Manali", "Himachal Pradesh", 32.23, 77.18, 3, 2050),
    ("Dharamshala", "Himachal Pradesh", 32.21, 76.32, 3, 1457),
    ("Jaipur", "Rajasthan", 26.91, 75.78, 2, 431),
    ("Udaipur", "Rajasthan", 24.58, 73.71, 3, 598),
    ("Jodhpur", "Rajasthan", 26.23, 73.02, 3, 231),
    ("Ajmer", "Rajasthan", 26.44, 74.63, 3, 480),
    ("Lucknow", "Uttar Pradesh", 26.84, 80.94, 2, 123),
    ("Varanasi", "Uttar Pradesh", 25.31, 82.97, 3, 81),
    ("Agra", "Uttar Pradesh", 27.17, 78.00, 3, 170),
    ("Amritsar", "Punjab", 31.63, 74.87, 2, 234),
    ("Ludhiana", "Punjab", 30.90, 75.85, 2, 244),
    ("Jalandhar", "Punjab", 31.32, 75.57, 2, 229),
    ("Patiala", "Punjab", 30.33, 76.39, 3, 250),
    ("Srinagar", "Jammu & Kashmir", 34.08, 74.79, 2, 1585),
    ("Jammu", "Jammu & Kashmir", 32.72, 74.85, 3, 327),
    ("Allahabad (Prayagraj)", "Uttar Pradesh", 25.43, 81.84, 3, 98),
    ("Kanpur", "Uttar Pradesh", 26.44, 80.33, 2, 126),
    ("Kota", "Rajasthan", 25.21, 75.86, 3, 271),
    ("Haridwar", "Uttarakhand", 29.94, 78.16, 3, 314),
    ("Rishikesh", "Uttarakhand", 30.08, 78.26, 3, 372),
    ("Mussoorie", "Uttarakhand", 30.45, 78.07, 3, 2005),
    ("Nainital", "Uttarakhand", 29.39, 79.45, 3, 2084),
    ("Meerut", "Uttar Pradesh", 28.98, 77.70, 2, 219),
    
    # West
    ("Mumbai", "Maharashtra", 19.07, 72.87, 1, 14),
    ("Navi Mumbai", "Maharashtra", 19.03, 73.02, 1, 10),
    ("Thane", "Maharashtra", 19.21, 72.97, 2, 8),
    ("Kalyan-Dombivli", "Maharashtra", 19.24, 73.13, 3, 7),
    ("Pune", "Maharashtra", 18.52, 73.85, 1, 560),
    ("Pimpri-Chinchwad", "Maharashtra", 18.62, 73.79, 2, 530),
    ("Nagpur", "Maharashtra", 21.14, 79.08, 2, 310),
    ("Nashik", "Maharashtra", 19.99, 73.78, 2, 600),
    ("Aurangabad", "Maharashtra", 19.87, 75.34, 3, 568),
    ("Ahmedabad", "Gujarat", 23.02, 72.57, 1, 53),
    ("Gandhinagar", "Gujarat", 23.21, 72.63, 3, 81),
    ("Surat", "Gujarat", 21.17, 72.83, 2, 13),
    ("Vadodara", "Gujarat", 22.30, 73.18, 2, 39),
    ("Rajkot", "Gujarat", 22.30, 70.80, 2, 128),
    ("Jamnagar", "Gujarat", 22.47, 70.05, 3, 20),
    ("Bhavnagar", "Gujarat", 21.76, 72.15, 3, 24),
    ("Goa (Panaji)", "Goa", 15.49, 73.82, 3, 7),
    ("Vasco da Gama", "Goa", 15.39, 73.81, 3, 6),
    ("Margao", "Goa", 15.27, 73.96, 3, 10),
    ("Kolhapur", "Maharashtra", 16.70, 74.24, 3, 545),
    ("Solapur", "Maharashtra", 17.65, 75.90, 3, 458),
    ("Amravati", "Maharashtra", 20.93, 77.75, 3, 343),
    ("Lonavala", "Maharashtra", 18.75, 73.40, 3, 624),
    ("Mahabaleshwar", "Maharashtra", 17.93, 73.64, 3, 1353),
    ("Alibag", "Maharashtra", 18.64, 72.87, 3, 0),
    ("Daman", "Daman and Diu", 20.39, 72.83, 3, 5),

    # South
    ("Bangalore", "Karnataka", 12.97, 77.59, 1, 920),
    ("Whitefield (Bangalore)", "Karnataka", 12.96, 77.75, 2, 900),
    ("Mysore", "Karnataka", 12.29, 76.63, 2, 763),
    ("Mangalore", "Karnataka", 12.91, 74.85, 2, 22),
    ("Udupi", "Karnataka", 13.34, 74.74, 3, 27),
    ("Hubli", "Karnataka", 15.36, 75.12, 3, 670),
    ("Belgaum", "Karnataka", 15.84, 74.49, 3, 762),
    ("Chennai", "Tamil Nadu", 13.08, 80.27, 1, 6),
    ("Coimbatore", "Tamil Nadu", 11.01, 76.95, 2, 411),
    ("Madurai", "Tamil Nadu", 9.92, 78.11, 2, 101),
    ("Trichy", "Tamil Nadu", 10.79, 78.70, 2, 88),
    ("Salem", "Tamil Nadu", 11.66, 78.14, 3, 278),
    ("Vellore", "Tamil Nadu", 12.91, 79.13, 3, 216),
    ("Tirunelveli", "Tamil Nadu", 8.71, 77.75, 3, 47),
    ("Hosur", "Tamil Nadu", 12.74, 77.82, 3, 879),
    ("Hyderabad", "Telangana", 17.38, 78.48, 1, 542),
    ("Secunderabad", "Telangana", 17.43, 78.50, 1, 543),
    ("Warangal", "Telangana", 17.96, 79.59, 3, 266),
    ("Visakhapatnam", "Andhra Pradesh", 17.68, 83.21, 2, 45),
    ("Vijayawada", "Andhra Pradesh", 16.50, 80.64, 2, 11),
    ("Guntur", "Andhra Pradesh", 16.30, 80.43, 3, 30),
    ("Rajahmundry", "Andhra Pradesh", 16.98, 81.78, 3, 14),
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
    ("Wayanad", "Kerala", 11.68, 76.13, 3, 700),
    ("Yercaud", "Tamil Nadu", 11.77, 78.20, 3, 1515),

    # East
    ("Kolkata", "West Bengal", 22.57, 88.36, 1, 9),
    ("Howrah", "West Bengal", 22.59, 88.31, 2, 12),
    ("Salt Lake City", "West Bengal", 22.58, 88.41, 2, 11),
    ("Durgapur", "West Bengal", 23.48, 87.32, 2, 65),
    ("Siliguri", "West Bengal", 26.72, 88.39, 3, 122),
    ("Darjeeling", "West Bengal", 27.04, 88.26, 3, 2042),
    ("Kalimpong", "West Bengal", 27.06, 88.47, 3, 1250),
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
    ("Aizawl", "Mizoram", 23.73, 92.71, 3, 1132),

    # Central
    ("Bhopal", "Madhya Pradesh", 23.25, 77.41, 2, 527),
    ("Indore", "Madhya Pradesh", 22.71, 75.85, 2, 553),
    ("Gwalior", "Madhya Pradesh", 26.21, 78.18, 2, 212),
    ("Jabalpur", "Madhya Pradesh", 23.18, 79.98, 2, 412),
    ("Ujjain", "Madhya Pradesh", 23.17, 75.78, 3, 494),
    ("Raipur", "Chhattisgarh", 21.25, 81.62, 2, 291),
    ("Bilaspur", "Chhattisgarh", 22.07, 82.14, 3, 264),
    ("Bhilai", "Chhattisgarh", 21.20, 81.38, 2, 297),
]

HOSPITAL_CHAINS = ["Apollo", "Max", "Fortis", "Manipal", "Narayana Health", "Aster", "Medanta", "Columbia Asia", "Care Hospitals"]

def estimate_city_data(city):
    name, state, lat, lng, tier, elev = city
    
    # 1. TEMPERATE & CLIMATE
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

    temp_s = round(base_summer + random.uniform(-2, 2))
    temp_w = round(base_winter + random.uniform(-2, 2))

    # Rainfall
    rain = 800
    if lng > 88 or (lat < 16 and lng < 77): rain = 2500 # Northeast or Kerala
    elif lat > 28 and elev < 1000: rain = 600 # North plains
    elif lat < 20 and lng > 80: rain = 1500 # East coast
    rain = round(rain + random.uniform(-100, 200))

    # 2. AQI
    # Tier 1 = Bad, Hill stations = Good
    aqi = 100
    if tier == 1: aqi = 180 + random.randint(-20, 50)
    elif tier == 2: aqi = 110 + random.randint(-20, 40)
    elif elev > 1000: aqi = 40 + random.randint(0, 20)
    else: aqi = 90 + random.randint(-10, 30)
    
    # Overrides
    if "Delhi" in name or "Noida" in name or "Gurgaon" in name or "Ghaziabad" in name: aqi = 260
    if "Bhiwadi" in name: aqi = 300
    if "Mysore" in name or "Indore" in name: aqi = 50

    # 3. HEALTHCARE
    # Tier 1: Many top chains. Tier 2: Some. Tier 3: Few/None.
    h_count = 10
    h_chains = []
    
    if tier == 1:
        h_score = 9.2 + random.uniform(0, 0.6)
        h_count = 100 + random.randint(0, 100)
        h_chains = random.sample(HOSPITAL_CHAINS, k=random.randint(5, 8))
    elif tier == 2:
        h_score = 8.0 + random.uniform(0, 1.2)
        h_count = 30 + random.randint(0, 30)
        h_chains = random.sample(HOSPITAL_CHAINS, k=random.randint(2, 5))
    else:
        h_score = 6.0 + random.uniform(0, 2.0)
        h_count = 10 + random.randint(0, 15)
        h_chains = random.sample(HOSPITAL_CHAINS, k=random.randint(0, 2))
        
    h_score = round(min(h_score, 10), 1)

    # 4. AIRPORTS
    # Distance to nearest DOMESTIC and INTERNATIONAL
    # Simplified logic: Tier 1 usually has both close.
    # Distances are estimates in km.
    
    dist_dom = random.randint(10, 30)
    dist_intl = random.randint(10, 40)
    
    if tier == 1:
        dist_dom = random.randint(5, 25)
        dist_intl = random.randint(10, 35)
    elif tier == 2:
        dist_dom = random.randint(10, 35)
        dist_intl = random.randint(100, 300) # Often have to fly via metro
        # Some Tier 2 have Intl (e.g., Jaipur, Kochi, Amritsar, Trichy)
        if "Jaipur" in name or "Kochi" in name or "Amritsar" in name or "Trichy" in name or "Lucknow" in name:
             dist_intl = random.randint(15, 30)
    else:
        dist_dom = random.randint(40, 150)
        dist_intl = random.randint(150, 400)
        
    # Specific overrides
    if "Noida" in name: dist_intl = 40; dist_dom = 40 # Jewar coming but currently Delhi
    if "Gurgaon" in name: dist_intl = 20; dist_dom = 20
    
    nearest_dom = {"name": f"{name} Domestic", "distance": dist_dom}
    nearest_intl = {"name": f"International Airport", "distance": dist_intl}

    # 5. REAL ESTATE (Avg price per sqft in INR)
    # Tier 1 > Tier 2 > Tier 3
    # Suburbs of Tier 1 ~ Tier 2 prices
    price_sqft = 4000
    if tier == 1:
        price_sqft = random.randint(12000, 25000)
        if "Mumbai" in name: price_sqft = random.randint(25000, 45000)
    elif tier == 2:
        price_sqft = random.randint(5000, 9000)
        if "Noida" in name or "Gurgaon" in name: price_sqft = random.randint(6000, 12000)
    else:
        price_sqft = random.randint(2500, 5000)
        if elev > 1000: price_sqft += 1500 # Hill stations premium
        
    # Format nicely
    
    return {
        "name": name,
        "state": state,
        "lat": lat,
        "lng": lng,
        "description": f"{'Major Metro' if tier==1 else 'Growing City' if tier==2 else 'Scenic Town'} in {state}.",
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
            "score": h_score,
            "chains": h_chains
        },
        "realEstate": {
            "averagePricePerSqFt": price_sqft,
            "currency": "INR"
        },
        "costOfLiving": get_col(tier),
        "nearestDomesticAirport": nearest_dom,
        "nearestInternationalAirport": nearest_intl
    }

final_cities = []
for city_raw in raw_cities:
    final_cities.append(estimate_city_data(city_raw))

# Identify IDs
for idx, c in enumerate(final_cities):
    c['id'] = idx + 1

print(json.dumps(final_cities, indent=2))
