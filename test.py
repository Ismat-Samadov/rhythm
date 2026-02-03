import requests
import urllib3
import json

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

url = "https://sgp.ge/sgp-backend/api/integration/info/branches-new"

headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Origin": "https://sgp.ge",
    "Referer": "https://sgp.ge/locations",
    "User-Agent": "Mozilla/5.0"
}

response = requests.post(url, headers=headers, verify=False)
data = response.json()

print(type(data))
print(json.dumps(data, indent=2)[:2000])  # print first 2KB only
