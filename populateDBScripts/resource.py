import requests
import time
import os
from dotenv import load_dotenv

load_dotenv()

version_url = "https://ddragon.leagueoflegends.com/api/versions.json"

add_data_url = "http://localhost:8081/dev/api/champion/resource"

token = os.getenv("TOKEN")


def request(url):
    r = requests.get(url)

    if r.ok:
        return r.json()
    else:
        print("Error on requesting " + url)
        exit(0)


def put_request(url, payload):
    r = requests.put(url, json=payload, headers={
        "Authorization": "Bearer " + token
    })

    if r.ok:
        print("Done")
    else:
        print(r.content)
        exit(1)


# lets get the latest version datadragon supports

current_version = request(version_url)[0]

print("Latest patch: " + current_version)

# and then get the latest data from:

data_url = f"http://ddragon.leagueoflegends.com/cdn/{current_version}/data/en_US/champion.json"

latest_data = request(data_url).get("data")

champion_count = len(latest_data)
print(f"Champion count: {champion_count}")
print("-" * 30)

for champ in latest_data.keys():

    print("Fetching data for: " + champ)

    resource = latest_data.get(champ).get("partype")
    name = latest_data.get(champ).get("name")

    if resource == "none" or resource == "None" or resource is None or resource == "":
        resource = "Manaless"

    data = {
        "championName": name,
        "resource": resource,
    }

    print(data)

    put_request(add_data_url, data)

    time.sleep(0.25)

