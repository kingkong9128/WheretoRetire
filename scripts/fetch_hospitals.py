import requests
import json
import time

# Overpass API URL
OVERPASS_URL = "http://overpass-api.de/api/interpreter"

def get_real_hospital_count(lat, lng, radius=10000):
    """
    Fetch count of hospitals/clinics within radius (meters) using OSM.
    """
    overpass_query = f"""
    [out:json];
    (
      node["amenity"="hospital"](around:{radius},{lat},{lng});
      way["amenity"="hospital"](around:{radius},{lat},{lng});
      relation["amenity"="hospital"](around:{radius},{lat},{lng});
    );
    out count;
    """
    
    try:
        response = requests.get(OVERPASS_URL, params={'data': overpass_query})
        data = response.json()
        
        # The count is usually in the 'elements' array or separate statistics field
        # For 'out count', the output structure is specific.
        # Let's parse generic elements if 'out count' behaves differently or just use len.
        # Actually 'out count' returns stats in 'elements' with a 'count' tag in newer versions 
        # but often easier to just get IDs and count.
        
        # Let's try standard fetch and count to be safe
        overpass_query_safe = f"""
        [out:json];
        (
          node["amenity"="hospital"](around:{radius},{lat},{lng});
          way["amenity"="hospital"](around:{radius},{lat},{lng});
        );
        out qt;
        """
        headers = {
            'User-Agent': 'RetirementApp/1.0 (contact@wheretoretire.com)'
        }
        response = requests.get(OVERPASS_URL, params={'data': overpass_query_safe}, headers=headers)
        data = response.json()
        return len(data['elements'])
        
    except Exception as e:
        print(f"Error fetching for {lat}, {lng}: {e}")
        return None

# Load cities
with open('data/cities.json', 'r') as f:
    cities = json.load(f)

print(f"Fetching real hospital counts for {len(cities)} cities (Sample)...")

# Sample run for first 5 top cities
for city in cities[:5]:
    count = get_real_hospital_count(city['lat'], city['lng'])
    print(f"{city['name']}: {count} hospitals (OSM)")
    time.sleep(1) # Be nice to API

print("\nTo update all, we would iterate the full list and save back to json.")
