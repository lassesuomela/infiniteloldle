import requests
import time
import os
from dotenv import load_dotenv

load_dotenv()

version_url = "https://ddragon.leagueoflegends.com/api/versions.json"

add_data_url = "http://localhost:8081/api/champion"

token = os.getenv("TOKEN")


def request(url):
    r = requests.get(url)

    if r.ok:
        return r.json()
    else:
        print("Error on requesting " + url)
        exit(0)


def post_request(url, payload):
    r = requests.post(url, json=payload, headers={
        "Authorization": "Bearer " + token
    })

    if r.ok:
        print("Done")
    else:
        print(r.json())
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
    genre = latest_data.get(champ).get("tags")
    title = latest_data.get(champ).get("title")
    name = latest_data.get(champ).get("name")
    champion_id = latest_data.get(champ).get("id")

    print("Champ id: " + champion_id)

    if resource != "Mana":
        resource = "Manaless"

    # fetch champ specific data based on current champ
    champ_url = f"http://ddragon.leagueoflegends.com/cdn/{current_version}/data/en_US/champion/{champ}.json"
    champ_data = request(champ_url).get("data").get(champ)

    skins = champ_data.get("skins")

    skin_count = len(skins)

    ids = []

    for skin in skins:
        ids.append(skin["num"])

    if champion_id == "Renata":
        champion_id = "renataglasc"

    lore_champion_data = f"https://universe-meeps.leagueoflegends.com/v1/en_us/champions/{champion_id.lower()}/index.json"

    lore = request(lore_champion_data)

    bio = lore["champion"]["biography"]["full"]

    bio = str(bio).lower().split(" ")

    male = ["he", "him", "his"]
    male_count = 0

    female = ["she", "her", "hers"]
    female_count = 0

    gender = 0

    for chunk in bio:
        for m in male:
            if m == chunk:
                male_count += 1

    for chunk in bio:
        for f in female:
            if f == chunk:
                female_count += 1

    if male_count > female_count:
        gender = 1
    elif female_count > male_count:
        gender = 2
    else:
        gender = 3

    str_ids = str(ids).replace(" ", "").replace("[", "").replace("]", "")

    data = {
        "name": name,
        "title": title,
        "resource": resource,
        "genre": ",".join(genre),
        "skinCount": skin_count,
        "spriteIds": str_ids,
        "gender": gender
    }

    print(data)

    post_request(add_data_url, data)

    time.sleep(1)

