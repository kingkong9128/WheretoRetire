import json
import random

cities_data = [
    # TIER 1 / MAJOR CITIES
    {"name": "Bangalore", "state": "Karnataka", "lat": 12.9716, "lng": 77.5946, "desc": "IT hub with pleasant climate.", "temp_s": 34, "temp_w": 16, "hum": "Moderate", "rain": 970, "aqi": 90, "hosp": 180, "h_score": 9.5, "col": "High", "air": "Kempegowda International", "air_dist": 40, "air_type": "International"},
    {"name": "Pune", "state": "Maharashtra", "lat": 18.5204, "lng": 73.8567, "desc": "Cultural capital, student hub.", "temp_s": 37, "temp_w": 12, "hum": "Moderate", "rain": 722, "aqi": 110, "hosp": 150, "h_score": 9.2, "col": "High", "air": "Pune International", "air_dist": 10, "air_type": "International"},
    {"name": "Hyderabad", "state": "Telangana", "lat": 17.3850, "lng": 78.4867, "desc": "City of Pearls, burgeoning IT.", "temp_s": 39, "temp_w": 15, "hum": "Low", "rain": 810, "aqi": 100, "hosp": 160, "h_score": 9.3, "col": "Medium", "air": "Rajiv Gandhi International", "air_dist": 24, "air_type": "International"},
    {"name": "Mumbai", "state": "Maharashtra", "lat": 19.0760, "lng": 72.8777, "desc": "Financial capital, fast-paced.", "temp_s": 33, "temp_w": 19, "hum": "High", "rain": 2400, "aqi": 140, "hosp": 250, "h_score": 9.8, "col": "High", "air": "Chhatrapati Shivaji Maharaj", "air_dist": 0, "air_type": "International"},
    {"name": "Chennai", "state": "Tamil Nadu", "lat": 13.0827, "lng": 80.2707, "desc": "Healthcare capital.", "temp_s": 38, "temp_w": 21, "hum": "High", "rain": 1400, "aqi": 80, "hosp": 200, "h_score": 9.7, "col": "Medium", "air": "Chennai International", "air_dist": 21, "air_type": "International"},
    {"name": "Delhi", "state": "Delhi", "lat": 28.6139, "lng": 77.2090, "desc": "National Capital.", "temp_s": 45, "temp_w": 5, "hum": "Low", "rain": 700, "aqi": 250, "hosp": 300, "h_score": 9.8, "col": "High", "air": "Indira Gandhi International", "air_dist": 16, "air_type": "International"},
    {"name": "Kolkata", "state": "West Bengal", "lat": 22.5726, "lng": 88.3639, "desc": "Cultural capital.", "temp_s": 36, "temp_w": 12, "hum": "High", "rain": 1600, "aqi": 160, "hosp": 140, "h_score": 8.5, "col": "Low", "air": "Netaji Subhas Chandra Bose", "air_dist": 17, "air_type": "International"},
    {"name": "Ahmedabad", "state": "Gujarat", "lat": 23.0225, "lng": 72.5714, "desc": "Textile hub.", "temp_s": 42, "temp_w": 12, "hum": "Low", "rain": 750, "aqi": 120, "hosp": 120, "h_score": 8.8, "col": "Medium", "air": "Sardar Vallabhbhai Patel", "air_dist": 9, "air_type": "International"},

    # RETIREMENT FAVORITES
    {"name": "Coimbatore", "state": "Tamil Nadu", "lat": 11.0168, "lng": 76.9558, "desc": "Manchester of South India.", "temp_s": 35, "temp_w": 20, "hum": "Moderate", "rain": 600, "aqi": 60, "hosp": 80, "h_score": 9.4, "col": "Medium", "air": "Coimbatore International", "air_dist": 15, "air_type": "International"},
    {"name": "Dehradun", "state": "Uttarakhand", "lat": 30.3165, "lng": 78.0322, "desc": "Himalayan foothills.", "temp_s": 30, "temp_w": 5, "hum": "Moderate", "rain": 2000, "aqi": 55, "hosp": 45, "h_score": 8.4, "col": "Medium", "air": "Jolly Grant", "air_dist": 25, "air_type": "Domestic"},
    {"name": "Mysore", "state": "Karnataka", "lat": 12.2958, "lng": 76.6394, "desc": "Heritage city.", "temp_s": 34, "temp_w": 17, "hum": "Moderate", "rain": 800, "aqi": 50, "hosp": 35, "h_score": 8.1, "col": "Low", "air": "Mysore Airport", "air_dist": 10, "air_type": "Domestic"},
    {"name": "Kochi", "state": "Kerala", "lat": 9.9312, "lng": 76.2673, "desc": "Queen of Arabian Sea.", "temp_s": 33, "temp_w": 24, "hum": "High", "rain": 3000, "aqi": 45, "hosp": 90, "h_score": 9.2, "col": "Medium", "air": "Cochin International", "air_dist": 25, "air_type": "International"},
    {"name": "Chandigarh", "state": "Chandigarh", "lat": 30.7333, "lng": 76.7794, "desc": "Planned city.", "temp_s": 39, "temp_w": 7, "hum": "Low", "rain": 1100, "aqi": 105, "hosp": 60, "h_score": 9.0, "col": "High", "air": "Chandigarh International", "air_dist": 12, "air_type": "International"},
    {"name": "Goa (Panaji)", "state": "Goa", "lat": 15.4909, "lng": 73.8278, "desc": "Beach paradise.", "temp_s": 33, "temp_w": 20, "hum": "High", "rain": 2900, "aqi": 40, "hosp": 25, "h_score": 8.0, "col": "High", "air": "Dabolim", "air_dist": 30, "air_type": "International"},
    {"name": "Pondicherry", "state": "Puducherry", "lat": 11.9416, "lng": 79.8083, "desc": "French riviera of East.", "temp_s": 36, "temp_w": 21, "hum": "High", "rain": 1300, "aqi": 50, "hosp": 20, "h_score": 8.2, "col": "Medium", "air": "Puducherry Airport", "air_dist": 5, "air_type": "Domestic"},

    # TIER 2 / EMERGING
    {"name": "Jaipur", "state": "Rajasthan", "lat": 26.9124, "lng": 75.7873, "desc": "Pink City.", "temp_s": 40, "temp_w": 9, "hum": "Low", "rain": 600, "aqi": 130, "hosp": 65, "h_score": 8.6, "col": "Low", "air": "Jaipur International", "air_dist": 13, "air_type": "International"},
    {"name": "Lucknow", "state": "Uttar Pradesh", "lat": 26.8467, "lng": 80.9462, "desc": "City of Nawabs.", "temp_s": 41, "temp_w": 8, "hum": "Low", "rain": 900, "aqi": 180, "hosp": 70, "h_score": 8.5, "col": "Low", "air": "Chaudhary Charan Singh", "air_dist": 15, "air_type": "International"},
    {"name": "Indore", "state": "Madhya Pradesh", "lat": 22.7196, "lng": 75.8577, "desc": "Cleanest city.", "temp_s": 40, "temp_w": 10, "hum": "Low", "rain": 950, "aqi": 85, "hosp": 55, "h_score": 8.7, "col": "Low", "air": "Devi Ahilya Bai Holkar", "air_dist": 8, "air_type": "International"},
    {"name": "Bhopal", "state": "Madhya Pradesh", "lat": 23.2599, "lng": 77.4126, "desc": "City of Lakes.", "temp_s": 40, "temp_w": 10, "hum": "Low", "rain": 1100, "aqi": 90, "hosp": 50, "h_score": 8.3, "col": "Low", "air": "Raja Bhoj", "air_dist": 15, "air_type": "Domestic"},
    {"name": "Nagpur", "state": "Maharashtra", "lat": 21.1458, "lng": 79.0882, "desc": "Orange City.", "temp_s": 43, "temp_w": 12, "hum": "Low", "rain": 1100, "aqi": 95, "hosp": 60, "h_score": 8.6, "col": "Low", "air": "Dr. Babasaheb Ambedkar", "air_dist": 8, "air_type": "International"},
    {"name": "Visakhapatnam", "state": "Andhra Pradesh", "lat": 17.6868, "lng": 83.2185, "desc": "Port city.", "temp_s": 34, "temp_w": 20, "hum": "High", "rain": 1100, "aqi": 75, "hosp": 45, "h_score": 8.4, "col": "Low", "air": "Visakhapatnam International", "air_dist": 12, "air_type": "International"},
    {"name": "Surat", "state": "Gujarat", "lat": 21.1702, "lng": 72.8311, "desc": "Diamond city.", "temp_s": 37, "temp_w": 15, "hum": "Moderate", "rain": 1200, "aqi": 95, "hosp": 65, "h_score": 8.5, "col": "Medium", "air": "Surat International", "air_dist": 12, "air_type": "International"},
    {"name": "Vadodara", "state": "Gujarat", "lat": 22.3072, "lng": 73.1812, "desc": "Cultural city of Gujarat.", "temp_s": 40, "temp_w": 13, "hum": "Moderate", "rain": 900, "aqi": 90, "hosp": 40, "h_score": 8.2, "col": "Low", "air": "Vadodara", "air_dist": 6, "air_type": "Domestic"},
    {"name": "Nashik", "state": "Maharashtra", "lat": 19.9975, "lng": 73.7898, "desc": "Wine capital.", "temp_s": 36, "temp_w": 10, "hum": "Low", "rain": 700, "aqi": 70, "hosp": 35, "h_score": 8.0, "col": "Low", "air": "Ozar", "air_dist": 20, "air_type": "Domestic"},
    {"name": "Thiruvananthapuram", "state": "Kerala", "lat": 8.5241, "lng": 76.9366, "desc": "Evergreen city.", "temp_s": 34, "temp_w": 23, "hum": "High", "rain": 1700, "aqi": 45, "hosp": 60, "h_score": 9.3, "col": "Medium", "air": "Trivandrum International", "air_dist": 6, "air_type": "International"},
    {"name": "Mangalore", "state": "Karnataka", "lat": 12.9141, "lng": 74.8560, "desc": "Coastal education hub.", "temp_s": 34, "temp_w": 22, "hum": "High", "rain": 3500, "aqi": 40, "hosp": 50, "h_score": 8.9, "col": "Medium", "air": "Mangalore International", "air_dist": 15, "air_type": "International"},
    {"name": "Bhubaneswar", "state": "Odisha", "lat": 20.2961, "lng": 85.8245, "desc": "Temple city.", "temp_s": 37, "temp_w": 16, "hum": "High", "rain": 1500, "aqi": 80, "hosp": 50, "h_score": 8.5, "col": "Low", "air": "Biju Patnaik", "air_dist": 6, "air_type": "International"},
    {"name": "Guwahati", "state": "Assam", "lat": 26.1445, "lng": 91.7364, "desc": "Gateway to Northeast.", "temp_s": 32, "temp_w": 10, "hum": "High", "rain": 1700, "aqi": 100, "hosp": 40, "h_score": 8.0, "col": "Low", "air": "Lokpriya Gopinath Bordoloi", "air_dist": 20, "air_type": "International"},
    {"name": "Ranchi", "state": "Jharkhand", "lat": 23.3441, "lng": 85.3096, "desc": "City of Waterfalls.", "temp_s": 37, "temp_w": 10, "hum": "Moderate", "rain": 1400, "aqi": 90, "hosp": 30, "h_score": 7.8, "col": "Low", "air": "Birsa Munda", "air_dist": 7, "air_type": "Domestic"},
    {"name": "Raipur", "state": "Chhattisgarh", "lat": 21.2514, "lng": 81.6296, "desc": "Rice bowl of India.", "temp_s": 42, "temp_w": 13, "hum": "Low", "rain": 1300, "aqi": 100, "hosp": 35, "h_score": 7.9, "col": "Low", "air": "Swami Vivekananda", "air_dist": 15, "air_type": "Domestic"},
    {"name": "Patna", "state": "Bihar", "lat": 25.5941, "lng": 85.1376, "desc": "Historical city.", "temp_s": 40, "temp_w": 9, "hum": "Variable", "rain": 1100, "aqi": 180, "hosp": 50, "h_score": 8.0, "col": "Low", "air": "Jay Prakash Narayan", "air_dist": 8, "air_type": "International"},
    {"name": "Udaipur", "state": "Rajasthan", "lat": 24.5854, "lng": 73.7125, "desc": "City of Lakes.", "temp_s": 38, "temp_w": 10, "hum": "Low", "rain": 650, "aqi": 70, "hosp": 25, "h_score": 7.9, "col": "Medium", "air": "Maharana Pratap", "air_dist": 22, "air_type": "Domestic"},
    {"name": "Jodhpur", "state": "Rajasthan", "lat": 26.2389, "lng": 73.0243, "desc": "Blue City.", "temp_s": 41, "temp_w": 10, "hum": "Low", "rain": 400, "aqi": 100, "hosp": 30, "h_score": 7.8, "col": "Low", "air": "Jodhpur Airport", "air_dist": 5, "air_type": "Domestic"},
    {"name": "Amritsar", "state": "Punjab", "lat": 31.6340, "lng": 74.8723, "desc": "Spiritual center.", "temp_s": 40, "temp_w": 5, "hum": "Moderate", "rain": 700, "aqi": 150, "hosp": 40, "h_score": 8.2, "col": "Low", "air": "Sri Guru Ram Dass Jee", "air_dist": 11, "air_type": "International"},
    {"name": "Ludhiana", "state": "Punjab", "lat": 30.9010, "lng": 75.8573, "desc": "Industrial hub.", "temp_s": 40, "temp_w": 6, "hum": "Moderate", "rain": 700, "aqi": 160, "hosp": 45, "h_score": 8.3, "col": "Low", "air": "Sahnewal", "air_dist": 12, "air_type": "Domestic"},
    {"name": "Shimla", "state": "Himachal Pradesh", "lat": 31.1048, "lng": 77.1734, "desc": "Queen of Hills.", "temp_s": 25, "temp_w": -2, "hum": "Moderate", "rain": 1500, "aqi": 30, "hosp": 15, "h_score": 7.5, "col": "Medium", "air": "Shimla Airport", "air_dist": 22, "air_type": "Domestic"},
    {"name": "Manali", "state": "Himachal Pradesh", "lat": 32.2396, "lng": 77.1887, "desc": "Mountain resort.", "temp_s": 25, "temp_w": -5, "hum": "Moderate", "rain": 1400, "aqi": 20, "hosp": 10, "h_score": 6.5, "col": "High", "air": "Kullu Manali", "air_dist": 50, "air_type": "Domestic"},
    {"name": "Dharamshala", "state": "Himachal Pradesh", "lat": 32.2190, "lng": 76.3234, "desc": "Tibetan culture.", "temp_s": 30, "temp_w": 5, "hum": "Moderate", "rain": 2500, "aqi": 25, "hosp": 15, "h_score": 7.0, "col": "Medium", "air": "Gaggal", "air_dist": 13, "air_type": "Domestic"},
    {"name": "Gangtok", "state": "Sikkim", "lat": 27.3314, "lng": 88.6138, "desc": "Clean and organic.", "temp_s": 25, "temp_w": 4, "hum": "High", "rain": 3000, "aqi": 25, "hosp": 12, "h_score": 7.5, "col": "Medium", "air": "Pakyong", "air_dist": 30, "air_type": "Domestic"},
    {"name": "Shillong", "state": "Meghalaya", "lat": 25.5788, "lng": 91.8933, "desc": "Scotland of the East.", "temp_s": 25, "temp_w": 4, "hum": "High", "rain": 2500, "aqi": 30, "hosp": 20, "h_score": 7.8, "col": "Low", "air": "Shillong Airport", "air_dist": 30, "air_type": "Domestic"},
    {"name": "Aurangabad", "state": "Maharashtra", "lat": 19.8762, "lng": 75.3433, "desc": "Tourism hub.", "temp_s": 39, "temp_w": 12, "hum": "Low", "rain": 730, "aqi": 100, "hosp": 30, "h_score": 8.0, "col": "Low", "air": "Aurangabad Airport", "air_dist": 10, "air_type": "Domestic"},
    {"name": "Madurai", "state": "Tamil Nadu", "lat": 9.9252, "lng": 78.1198, "desc": "Cultural soul of TN.", "temp_s": 38, "temp_w": 22, "hum": "Moderate", "rain": 850, "aqi": 70, "hosp": 40, "h_score": 8.7, "col": "Low", "air": "Madurai Airport", "air_dist": 12, "air_type": "International"},
    {"name": "Trichy", "state": "Tamil Nadu", "lat": 10.7905, "lng": 78.7047, "desc": "Education and industry.", "temp_s": 38, "temp_w": 21, "hum": "Moderate", "rain": 800, "aqi": 65, "hosp": 35, "h_score": 8.5, "col": "Low", "air": "Tiruchirappalli", "air_dist": 5, "air_type": "International"},
    {"name": "Salem", "state": "Tamil Nadu", "lat": 11.6643, "lng": 78.1460, "desc": "Steel city.", "temp_s": 37, "temp_w": 20, "hum": "Moderate", "rain": 900, "aqi": 75, "hosp": 30, "h_score": 8.2, "col": "Low", "air": "Salem Airport", "air_dist": 15, "air_type": "Domestic"},
    {"name": "Vellore", "state": "Tamil Nadu", "lat": 12.9165, "lng": 79.1325, "desc": "Medical hub (CMC).", "temp_s": 38, "temp_w": 19, "hum": "Moderate", "rain": 950, "aqi": 60, "hosp": 25, "h_score": 9.0, "col": "Low", "air": "Chennai International", "air_dist": 130, "air_type": "International"},
    {"name": "Vijayawada", "state": "Andhra Pradesh", "lat": 16.5062, "lng": 80.6480, "desc": "Business capital of AP.", "temp_s": 40, "temp_w": 18, "hum": "High", "rain": 950, "aqi": 90, "hosp": 45, "h_score": 8.5, "col": "Medium", "air": "Vijayawada Airport", "air_dist": 20, "air_type": "International"},
    {"name": "Gwalior", "state": "Madhya Pradesh", "lat": 26.2183, "lng": 78.1828, "desc": "Historic city.", "temp_s": 42, "temp_w": 7, "hum": "Low", "rain": 750, "aqi": 160, "hosp": 30, "h_score": 7.8, "col": "Low", "air": "Gwalior Airport", "air_dist": 10, "air_type": "Domestic"},
    {"name": "Jabalpur", "state": "Madhya Pradesh", "lat": 23.1815, "lng": 79.9864, "desc": "Marble rocks.", "temp_s": 41, "temp_w": 10, "hum": "Moderate", "rain": 1200, "aqi": 80, "hosp": 30, "h_score": 8.0, "col": "Low", "air": "Jabalpur Airport", "air_dist": 20, "air_type": "Domestic"},
    {"name": "Noida", "state": "Uttar Pradesh", "lat": 28.5355, "lng": 77.3910, "desc": "Planned IT city.", "temp_s": 45, "temp_w": 6, "hum": "Low", "rain": 700, "aqi": 240, "hosp": 80, "h_score": 9.1, "col": "High", "air": "Indira Gandhi International", "air_dist": 30, "air_type": "International"},
    {"name": "Gurgaon", "state": "Haryana", "lat": 28.4595, "lng": 77.0266, "desc": "Millennium city.", "temp_s": 44, "temp_w": 6, "hum": "Low", "rain": 600, "aqi": 230, "hosp": 90, "h_score": 9.4, "col": "High", "air": "Indira Gandhi International", "air_dist": 15, "air_type": "International"},
]

result = []
for i, city in enumerate(cities_data):
    result.append({
        "id": i + 1,
        "name": city["name"],
        "state": city["state"],
        "lat": city["lat"],
        "lng": city["lng"],
        "description": city["desc"],
        "climate": {
            "averageTempSummer": city["temp_s"],
            "averageTempWinter": city["temp_w"],
            "temperatureRange": f"{city['temp_w']}-{city['temp_s']}°C",
            "humidity": city["hum"],
            "annualRainfall": city["rain"]
        },
        "aqi": city["aqi"],
        "healthcare": {
            "hospitalCount": city["hosp"],
            "score": city["h_score"]
        },
        "costOfLiving": city["col"],
        "nearestAirport": {
            "name": city["air"],
            "distance": city["air_dist"],
            "type": city["air_type"]
        }
    })

print(json.dumps(result, indent=2))
