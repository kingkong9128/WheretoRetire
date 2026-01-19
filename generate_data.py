import json
import random
import math

# --- Real Data Sources ---

# Major Airports (Real Coordinates)
AIRPORTS = {
    # International
    "DEL": {"name": "Indira Gandhi Intl (Delhi)", "lat": 28.5562, "lng": 77.1000, "type": "intl"},
    "BOM": {"name": "Chhatrapati Shivaji Maharaj Intl (Mumbai)", "lat": 19.0896, "lng": 72.8656, "type": "intl"},
    "BLR": {"name": "Kempegowda Intl (Bangalore)", "lat": 13.1986, "lng": 77.7066, "type": "intl"},
    "MAA": {"name": "Chennai Intl", "lat": 12.9941, "lng": 80.1709, "type": "intl"},
    "COK": {"name": "Cochin Intl", "lat": 10.1518, "lng": 76.3930, "type": "intl"},
    "HYD": {"name": "Rajiv Gandhi Intl (Hyderabad)", "lat": 17.2403, "lng": 78.4294, "type": "intl"},
    "CCU": {"name": "Netaji Subhash Chandra Bose Intl (Kolkata)", "lat": 22.6547, "lng": 88.4467, "type": "intl"},
    "AMD": {"name": "Sardar Vallabhbhai Patel Intl (Ahmedabad)", "lat": 23.0732, "lng": 72.6347, "type": "intl"},
    "GOI": {"name": "Dabolim (Goa)", "lat": 15.3800, "lng": 73.8314, "type": "intl"},
    "TRV": {"name": "Thiruvananthapuram Intl", "lat": 8.4821, "lng": 76.9200, "type": "intl"},
    "ATQ": {"name": "Sri Guru Ram Dass Jee Intl (Amritsar)", "lat": 31.7096, "lng": 74.7973, "type": "intl"},
    "JAI": {"name": "Jaipur Intl", "lat": 26.8289, "lng": 75.8056, "type": "intl"},
    "LKO": {"name": "Chaudhary Charan Singh Intl (Lucknow)", "lat": 26.7606, "lng": 80.8893, "type": "intl"},
    "IXC": {"name": "Chandigarh Intl", "lat": 30.6735, "lng": 76.7885, "type": "intl"},
    "IXB": {"name": "Bagdogra (Siliguri)", "lat": 26.6812, "lng": 88.3286, "type": "intl"}, # Limited intl
    "BBI": {"name": "Biju Patnaik Intl (Bhubaneswar)", "lat": 20.2444, "lng": 85.8178, "type": "intl"},
    "TRZ": {"name": "Tiruchirappalli Intl", "lat": 10.7654, "lng": 78.7097, "type": "intl"},
    "CJB": {"name": "Coimbatore Intl", "lat": 11.0275, "lng": 77.0434, "type": "intl"},
    "NAG": {"name": "Dr. Babasaheb Ambedkar Intl (Nagpur)", "lat": 21.0922, "lng": 79.0472, "type": "intl"},
    "IXE": {"name": "Mangalore Intl", "lat": 12.9613, "lng": 74.8901, "type": "intl"},
    "CCJ": {"name": "Calicut Intl (Kozhikode)", "lat": 11.1367, "lng": 75.9553, "type": "intl"},
    "VNS": {"name": "Lal Bahadur Shastri Intl (Varanasi)", "lat": 25.4525, "lng": 82.8591, "type": "intl"},

    # Domestic Only (Selected Major)
    "DED": {"name": "Dehradun (Jolly Grant)", "lat": 30.1897, "lng": 78.1803, "type": "dom"},
    "UDR": {"name": "Maharana Pratap (Udaipur)", "lat": 24.6172, "lng": 73.8961, "type": "dom"},
    "JDH": {"name": "Jodhpur", "lat": 26.2515, "lng": 73.0489, "type": "dom"},
    "BDQ": {"name": "Vadodara", "lat": 22.3361, "lng": 73.2264, "type": "dom"},
    "STV": {"name": "Surat", "lat": 21.1139, "lng": 72.7419, "type": "dom"},
    "IXZ": {"name": "Port Blair", "lat": 11.6410, "lng": 92.7297, "type": "dom"},
    "IXR": {"name": "Birsa Munda (Ranchi)", "lat": 23.3143, "lng": 85.3217, "type": "dom"},
    "PAT": {"name": "Jay Prakash Narayan (Patna)", "lat": 25.5913, "lng": 85.0880, "type": "dom"},
    "RPR": {"name": "Swami Vivekananda (Raipur)", "lat": 21.1804, "lng": 81.7388, "type": "dom"},
    "IDR": {"name": "Devi Ahilya Bai Holkar (Indore)", "lat": 22.7217, "lng": 75.8011, "type": "dom"},
    "BHO": {"name": "Raja Bhoj (Bhopal)", "lat": 23.2875, "lng": 77.3378, "type": "dom"},
    "GAU": {"name": "Lokpriya Gopinath Bordoloi (Guwahati)", "lat": 26.1061, "lng": 91.5859, "type": "dom"}, 
    "VTZ": {"name": "Visakhapatnam", "lat": 17.7211, "lng": 83.2245, "type": "dom"},
    "VGA": {"name": "Vijayawada", "lat": 16.5304, "lng": 80.7968, "type": "dom"},
    "PNY": {"name": "Pondicherry", "lat": 11.9683, "lng": 79.8114, "type": "dom"},
    "MYQ": {"name": "Mysore", "lat": 12.2280, "lng": 76.6413, "type": "dom"}
}

# Real Hospital Chains (Reference Map)
# Map partial city Name -> List of Chains known to be there.
KNOWN_HOSPITAL_CHAINS = {
    "Delhi": ["Apollo", "Max", "Fortis", "Medanta", "Manipal", "Sir Ganga Ram", "BLK"],
    "Gurgaon": ["Medanta", "Fortis", "Max", "Artemis", "Paras"],
    "Noida": ["Apollo", "Max", "Fortis", "Kailash", "Jaypee"],
    "Bangalore": ["Manipal", "Apollo", "Fortis", "Aster", "Narayana Health", "Sakra", "Columbia Asia"],
    "Whitefield": ["Manipal", "Cloudnine", "Columbia Asia", "Narayana Health"],
    "Mumbai": ["Kokilaben", "Lilavati", "Breach Candy", "Fortis", "Apollo", "Hiranandani", "Nanavati"],
    "Chennai": ["Apollo", "Fortis", "MIOT", "Kauvery", "SIMS", "Chettinad"],
    "Hyderabad": ["Apollo", "KIMS", "Yashoda", "Aster", "Care Hospitals", "Rainbow"],
    "Kolkata": ["Apollo", "Fortis", "Medica", "AMRI", "Peerless"],
    "Pune": ["Ruby Hall", "Jehangir", "Aditya Birla", "Sahyadri", "Manipal"],
    "Ahmedabad": ["Apollo", "Zydus", "Sterling", "HCG", "Sal", "KD"],
    "Jaipur": ["Fortis", "Narayana Health", "Manipal", "Eternal", "SDMH"],
    "Lucknow": ["Medanta", "Apollo", "Sahara", "Midland"],
    "Kochi": ["Aster", "Amrita", "Lisie", "Lakeshore", "Rajagiri"],
    "Coimbatore": ["Kovai Medical", "Ganga", "PSG", "Royal Care"],
    "Mysore": ["Apollo", "Manipal", "Columbia Asia", "JSS"],
    "Chandigarh": ["PGIMER", "Fortis", "Max", "Mukat"],
    "Indore": ["Apollo", "Bombay Hospital", "Choithram", "Medanta"],
    "Bhubaneswar": ["Apollo", "AMRI", "SUM", "Kalinga"],
    "Visakhapatnam": ["Apollo", "Care", "KIMS", "SevenHills"],
    "Trivandrum": ["KIMS", "Ananthapuri", "Cosmopolitan"],
    "Goa": ["Manipal", "Healthway", "Victor", "Galaxy"],
    "Nagpur": ["Kingsway", "Wockhardt", "Alexis", "Care"],
    "Dehradun": ["Max", "Synergy", "Jolly Grant"],
    "Bhopal": ["Bansal", "Chirayu", "Narmada"],
    "Raipur": ["Ramkrishna", "NH MMI", "Balco"],
    "Ranchi": ["Medica", "Orchid", "Rajendra"],
    "Patna": ["Paras", "Ruban", "IGIMS"],
    "Guwahati": ["Apollo", "GNRC", "Narayana Health", "Excelcare"],
    "Ludhiana": ["DMC", "CMC", "Fortis", "SPS"],
    "Surat": ["Sunshine", "Mahavir", "Kiran"],
    "Vadodara": ["Sterling", "Bhailal Amin", "Sunshine"],
    "Jodhpur": ["AIIMS", "Goyal", "Medipulse"],
    "Udaipur": ["Geetanjali", "Paras", "GBH American"],
    "Nashik": ["Wockhardt", "Sahyadri", "Apollo"],
    "Trichy": ["Kauvery", "Apollo", "Maruti"],
    "Madurai": ["Apollo", "Meenakshi", "Velammal"],
    "Vellore": ["CMC", "Naruvi", "Apollo"],
    "Mangalore": ["KMC", "AJ", "Father Muller"],
    "Manali": ["Lady Willingdon"],
    "Shimla": ["IGMC"],
    "Ooty": ["Government HQ"],
    "Gangtok": ["Manipal"],
    "Shillong": ["Nazareth", "Woodland"],
}

# Reference AQI (2024 Estimates - Avg, Min, Max)
# Source: General Knowledge / IQAir Indices for 2024
REAL_AQI_DATA = {
    # NCR = Bad
    "Delhi": 220, "Gurgaon": 210, "Noida": 230, "Ghaziabad": 240, "Faridabad": 210, 
    "Bhiwadi": 250, "Meerut": 180,
    # North
    "Chandigarh": 120, "Ludhiana": 160, "Amritsar": 140, "Jaipur": 130, "Lucknow": 170, "Kanpur": 160, "Varanasi": 150, "Agra": 160,
    # Hills = Good
    "Shimla": 40, "Manali": 30, "Dharamshala": 35, "Dehradun": 80, "Mussoorie": 45, "Nainital": 40, "Srinagar": 50,
    "Gangtok": 30, "Shillong": 35, "Ooty": 25, "Munnar": 20, "Coorg": 25, "Kodaikanal": 20, "Mt Abu": 40,
    # West
    "Mumbai": 110, "Pune": 90, "Ahmedabad": 120, "Surat": 100, "Nagpur": 100, "Nashik": 80, "Goa": 45,
    # South
    "Bangalore": 70, "Mysore": 45, "Chennai": 80, "Hyderabad": 85, "Coimbatore": 50, "Kochi": 40, "Trivandrum": 35, "Vizag": 70, "Mangalore": 40,
    # East
    "Kolkata": 160, "Patna": 190, "Guwahati": 120, "Bhubaneswar": 80, "Ranchi": 90
}

# Haversine Formula for Real Distances
def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2) * math.sin(dlat/2) + \
        math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * \
        math.sin(dlon/2) * math.sin(dlon/2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return round(R * c)

def get_nearest_airport(lat, lng, type_filter=None):
    nearest = None
    min_dist = 99999
    
    for code, data in AIRPORTS.items():
        if type_filter and data['type'] != type_filter:
            continue
            
        dist = calculate_distance(lat, lng, data['lat'], data['lng'])
        if dist < min_dist:
            min_dist = dist
            nearest = {"name": data['name'], "distance": dist, "code": code}
            
    return nearest

# Helper to categorize cost of living
def get_col(size_tier):
    if size_tier == 1: return "High"
    if size_tier == 2: return "Medium"
    return "Low"

# Base City Data - Name, State, Lat, Lng, Tier, Elevation(m), LANDSCAPE
# Landscape: Plain, Hill, Coastal
raw_cities = [
    # North
    ("Delhi", "Delhi", 28.61, 77.20, 1, 216, "Plain"),
    ("Gurgaon", "Haryana", 28.45, 77.02, 1, 217, "Plain"),
    ("Noida", "Uttar Pradesh", 28.53, 77.39, 1, 200, "Plain"),
    ("Greater Noida", "Uttar Pradesh", 28.47, 77.50, 2, 200, "Plain"),
    ("Ghaziabad", "Uttar Pradesh", 28.66, 77.45, 2, 210, "Plain"),
    ("Faridabad", "Haryana", 28.40, 77.31, 2, 198, "Plain"),
    ("Chandigarh", "Chandigarh", 30.73, 76.77, 2, 321, "Plain"),
    ("Mohali", "Punjab", 30.70, 76.71, 2, 316, "Plain"),
    ("Panchkula", "Haryana", 30.69, 76.86, 2, 365, "Plain"),
    ("Dehradun", "Uttarakhand", 30.31, 78.03, 2, 435, "Hill"),
    ("Shimla", "Himachal Pradesh", 31.10, 77.17, 3, 2276, "Hill"),
    ("Manali", "Himachal Pradesh", 32.23, 77.18, 3, 2050, "Hill"),
    ("Dharamshala", "Himachal Pradesh", 32.21, 76.32, 3, 1457, "Hill"),
    ("Jaipur", "Rajasthan", 26.91, 75.78, 2, 431, "Plain"),
    ("Udaipur", "Rajasthan", 24.58, 73.71, 3, 598, "Hill"), # Aravalli hills
    ("Jodhpur", "Rajasthan", 26.23, 73.02, 3, 231, "Plain"),
    ("Ajmer", "Rajasthan", 26.44, 74.63, 3, 480, "Plain"),
    ("Lucknow", "Uttar Pradesh", 26.84, 80.94, 2, 123, "Plain"),
    ("Varanasi", "Uttar Pradesh", 25.31, 82.97, 3, 81, "Plain"),
    ("Agra", "Uttar Pradesh", 27.17, 78.00, 3, 170, "Plain"),
    ("Amritsar", "Punjab", 31.63, 74.87, 2, 234, "Plain"),
    ("Ludhiana", "Punjab", 30.90, 75.85, 2, 244, "Plain"),
    ("Jalandhar", "Punjab", 31.32, 75.57, 2, 229, "Plain"),
    ("Patiala", "Punjab", 30.33, 76.39, 3, 250, "Plain"),
    ("Srinagar", "Jammu & Kashmir", 34.08, 74.79, 2, 1585, "Hill"),
    ("Jammu", "Jammu & Kashmir", 32.72, 74.85, 3, 327, "Hill"),
    ("Allahabad (Prayagraj)", "Uttar Pradesh", 25.43, 81.84, 3, 98, "Plain"),
    ("Kanpur", "Uttar Pradesh", 26.44, 80.33, 2, 126, "Plain"),
    ("Kota", "Rajasthan", 25.21, 75.86, 3, 271, "Plain"),
    ("Haridwar", "Uttarakhand", 29.94, 78.16, 3, 314, "Hill"),
    ("Rishikesh", "Uttarakhand", 30.08, 78.26, 3, 372, "Hill"),
    ("Mussoorie", "Uttarakhand", 30.45, 78.07, 3, 2005, "Hill"),
    ("Nainital", "Uttarakhand", 29.39, 79.45, 3, 2084, "Hill"),
    ("Meerut", "Uttar Pradesh", 28.98, 77.70, 2, 219, "Plain"),
    
    # West
    ("Mumbai", "Maharashtra", 19.07, 72.87, 1, 14, "Coastal"),
    ("Navi Mumbai", "Maharashtra", 19.03, 73.02, 1, 10, "Coastal"),
    ("Thane", "Maharashtra", 19.21, 72.97, 2, 8, "Coastal"),
    ("Kalyan-Dombivli", "Maharashtra", 19.24, 73.13, 3, 7, "Coastal"),
    ("Pune", "Maharashtra", 18.52, 73.85, 1, 560, "Hill"), # Plateau/Hill
    ("Pimpri-Chinchwad", "Maharashtra", 18.62, 73.79, 2, 530, "Hill"),
    ("Nagpur", "Maharashtra", 21.14, 79.08, 2, 310, "Plain"),
    ("Nashik", "Maharashtra", 19.99, 73.78, 2, 600, "Hill"),
    ("Aurangabad", "Maharashtra", 19.87, 75.34, 3, 568, "Hill"),
    ("Ahmedabad", "Gujarat", 23.02, 72.57, 1, 53, "Plain"),
    ("Gandhinagar", "Gujarat", 23.21, 72.63, 3, 81, "Plain"),
    ("Surat", "Gujarat", 21.17, 72.83, 2, 13, "Coastal"),
    ("Vadodara", "Gujarat", 22.30, 73.18, 2, 39, "Plain"),
    ("Rajkot", "Gujarat", 22.30, 70.80, 2, 128, "Plain"),
    ("Jamnagar", "Gujarat", 22.47, 70.05, 3, 20, "Coastal"),
    ("Bhavnagar", "Gujarat", 21.76, 72.15, 3, 24, "Coastal"),
    ("Goa (Panaji)", "Goa", 15.49, 73.82, 3, 7, "Coastal"),
    ("Vasco da Gama", "Goa", 15.39, 73.81, 3, 6, "Coastal"),
    ("Margao", "Goa", 15.27, 73.96, 3, 10, "Coastal"),
    ("Kolhapur", "Maharashtra", 16.70, 74.24, 3, 545, "Hill"),
    ("Solapur", "Maharashtra", 17.65, 75.90, 3, 458, "Plain"),
    ("Amravati", "Maharashtra", 20.93, 77.75, 3, 343, "Plain"),
    ("Lonavala", "Maharashtra", 18.75, 73.40, 3, 624, "Hill"),
    ("Mahabaleshwar", "Maharashtra", 17.93, 73.64, 3, 1353, "Hill"),
    ("Alibag", "Maharashtra", 18.64, 72.87, 3, 0, "Coastal"),
    ("Daman", "Daman and Diu", 20.39, 72.83, 3, 5, "Coastal"),

    # South
    ("Bangalore", "Karnataka", 12.97, 77.59, 1, 920, "Plain"), # Plateau
    ("Whitefield (Bangalore)", "Karnataka", 12.96, 77.75, 2, 900, "Plain"),
    ("Mysore", "Karnataka", 12.29, 76.63, 2, 763, "Plain"),
    ("Mangalore", "Karnataka", 12.91, 74.85, 2, 22, "Coastal"),
    ("Udupi", "Karnataka", 13.34, 74.74, 3, 27, "Coastal"),
    ("Hubli", "Karnataka", 15.36, 75.12, 3, 670, "Plain"),
    ("Belgaum", "Karnataka", 15.84, 74.49, 3, 762, "Hill"),
    ("Chennai", "Tamil Nadu", 13.08, 80.27, 1, 6, "Coastal"),
    ("Coimbatore", "Tamil Nadu", 11.01, 76.95, 2, 411, "Hill"), # Foothills
    ("Madurai", "Tamil Nadu", 9.92, 78.11, 2, 101, "Plain"),
    ("Trichy", "Tamil Nadu", 10.79, 78.70, 2, 88, "Plain"),
    ("Salem", "Tamil Nadu", 11.66, 78.14, 3, 278, "Hill"),
    ("Vellore", "Tamil Nadu", 12.91, 79.13, 3, 216, "Plain"),
    ("Tirunelveli", "Tamil Nadu", 8.71, 77.75, 3, 47, "Plain"),
    ("Hosur", "Tamil Nadu", 12.74, 77.82, 3, 879, "Plain"),
    ("Hyderabad", "Telangana", 17.38, 78.48, 1, 542, "Plain"),
    ("Secunderabad", "Telangana", 17.43, 78.50, 1, 543, "Plain"),
    ("Warangal", "Telangana", 17.96, 79.59, 3, 266, "Plain"),
    ("Visakhapatnam", "Andhra Pradesh", 17.68, 83.21, 2, 45, "Coastal"),
    ("Vijayawada", "Andhra Pradesh", 16.50, 80.64, 2, 11, "Plain"),
    ("Guntur", "Andhra Pradesh", 16.30, 80.43, 3, 30, "Plain"),
    ("Rajahmundry", "Andhra Pradesh", 16.98, 81.78, 3, 14, "Plain"),
    ("Tirupati", "Andhra Pradesh", 13.62, 79.41, 3, 162, "Hill"),
    ("Kochi", "Kerala", 9.93, 76.26, 2, 1, "Coastal"),
    ("Thiruvananthapuram", "Kerala", 8.52, 76.93, 2, 10, "Coastal"),
    ("Kozhikode", "Kerala", 11.25, 75.78, 2, 1, "Coastal"),
    ("Thrissur", "Kerala", 10.52, 76.21, 3, 2, "Coastal"),
    ("Pondicherry", "Puducherry", 11.94, 79.80, 2, 3, "Coastal"),
    ("Ooty", "Tamil Nadu", 11.41, 76.69, 3, 2240, "Hill"),
    ("Munnar", "Kerala", 10.08, 77.05, 3, 1532, "Hill"),
    ("Kodaikanal", "Tamil Nadu", 10.23, 77.48, 3, 2133, "Hill"),
    ("Coorg (Madikeri)", "Karnataka", 12.42, 75.73, 3, 1150, "Hill"),
    ("Alleppey", "Kerala", 9.49, 76.33, 3, 1, "Coastal"),
    ("Wayanad", "Kerala", 11.68, 76.13, 3, 700, "Hill"),
    ("Yercaud", "Tamil Nadu", 11.77, 78.20, 3, 1515, "Hill"),

    # East
    ("Kolkata", "West Bengal", 22.57, 88.36, 1, 9, "Plain"),
    ("Howrah", "West Bengal", 22.59, 88.31, 2, 12, "Plain"),
    ("Salt Lake City", "West Bengal", 22.58, 88.41, 2, 11, "Plain"),
    ("Durgapur", "West Bengal", 23.48, 87.32, 2, 65, "Plain"),
    ("Siliguri", "West Bengal", 26.72, 88.39, 3, 122, "Plain"),
    ("Darjeeling", "West Bengal", 27.04, 88.26, 3, 2042, "Hill"),
    ("Kalimpong", "West Bengal", 27.06, 88.47, 3, 1250, "Hill"),
    ("Bhubaneswar", "Odisha", 20.29, 85.82, 2, 45, "Plain"),
    ("Cuttack", "Odisha", 20.46, 85.88, 3, 36, "Plain"),
    ("Puri", "Odisha", 19.81, 85.83, 3, 0, "Coastal"),
    ("Rourkela", "Odisha", 22.26, 84.85, 3, 218, "Plain"),
    ("Patna", "Bihar", 25.59, 85.13, 2, 53, "Plain"),
    ("Gaya", "Bihar", 24.79, 85.00, 3, 111, "Plain"),
    ("Ranchi", "Jharkhand", 23.34, 85.30, 2, 651, "Hill"), # Plateau
    ("Jamshedpur", "Jharkhand", 22.80, 86.20, 2, 135, "Plain"),
    ("Guwahati", "Assam", 26.14, 91.73, 2, 51, "Plain"),
    ("Shillong", "Meghalaya", 25.57, 91.88, 3, 1525, "Hill"),
    ("Gangtok", "Sikkim", 27.33, 88.61, 3, 1650, "Hill"),
    ("Imphal", "Manipur", 24.81, 93.93, 3, 786, "Hill"),
    ("Agartala", "Tripura", 23.83, 91.28, 3, 12, "Plain"),
    ("Aizawl", "Mizoram", 23.73, 92.71, 3, 1132, "Hill"),

    # Central
    ("Bhopal", "Madhya Pradesh", 23.25, 77.41, 2, 527, "Plain"),
    ("Indore", "Madhya Pradesh", 22.71, 75.85, 2, 553, "Plain"),
    ("Gwalior", "Madhya Pradesh", 26.21, 78.18, 2, 212, "Plain"),
    ("Jabalpur", "Madhya Pradesh", 23.18, 79.98, 2, 412, "Plain"),
    ("Ujjain", "Madhya Pradesh", 23.17, 75.78, 3, 494, "Plain"),
    ("Raipur", "Chhattisgarh", 21.25, 81.62, 2, 291, "Plain"),
    ("Bilaspur", "Chhattisgarh", 22.07, 82.14, 3, 264, "Plain"),
    ("Bhilai", "Chhattisgarh", 21.20, 81.38, 2, 297, "Plain"),
]


def estimate_city_data(city):
    name, state, lat, lng, tier, elev, landscape = city
    
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

    # 2. AQI (REAL REFERENCE)
    # Check if city (or main city name) is in reference
    aqi = 100
    found_ref_aqi = False
    
    # Try direct match or simple substrings
    for key, val in REAL_AQI_DATA.items():
        if key in name:
            aqi = val
            found_ref_aqi = True
            break
            
    if not found_ref_aqi:
        # Fallback to estimation based on reference proximity or tier
        if tier == 1: aqi = 150 + random.randint(-20, 50)
        elif tier == 2: aqi = 110 + random.randint(-20, 40)
        elif elev > 1000: aqi = 40 + random.randint(0, 20)
        else: aqi = 90 + random.randint(-10, 30)

    # 3. HEALTHCARE (DETERMINISTIC CHAINS)
    h_count = 10
    h_chains = []
    
    # Get chains from Known Map
    known_chains = []
    for key, val in KNOWN_HOSPITAL_CHAINS.items():
        if key in name:
            known_chains = val
            break
            
    if len(known_chains) > 0:
        h_chains = known_chains
        h_score = 9.0 # High base score for known chains
        if len(h_chains) < 3: h_score = 7.5
        h_count = len(h_chains) * 5 + random.randint(5, 20) # Rough multiplier for total hospitals
    else:
        # Fallback
        common_chains = ["Apollo", "Max", "Fortis", "Manipal"]
        if tier == 1:
            h_score = 8.0
            h_count = 80 + random.randint(0, 50)
            h_chains = random.sample(common_chains, k=2)
        elif tier == 2:
            h_score = 7.0
            h_count = 30 + random.randint(0, 30)
            h_chains = [] 
        else:
            h_score = 5.0
            h_count = 10 + random.randint(0, 15)
            h_chains = []

    # 4. AIRPORTS (REAL CALCULATION)
    nearest_dom_obj = get_nearest_airport(lat, lng, 'dom')
    nearest_any = get_nearest_airport(lat, lng)
    nearest_dom = nearest_any
    nearest_intl = get_nearest_airport(lat, lng, 'intl')

    # 5. REAL ESTATE (Avg price per sqft in INR)
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
        "nearestInternationalAirport": nearest_intl,
        "landscape": landscape
    }

final_cities = []
for city_raw in raw_cities:
    final_cities.append(estimate_city_data(city_raw))

# Identify IDs
for idx, c in enumerate(final_cities):
    c['id'] = idx + 1

print(json.dumps(final_cities, indent=2))
