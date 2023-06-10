import requests
import time
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv

load_dotenv()
release_date_data = "https://leagueoflegends.fandom.com/wiki/List_of_champions"

update_data_url = "http://localhost:8081/api/champion"

token = os.getenv("TOKEN")


def request(url):
    r = requests.get(url)

    time.sleep(1)

    if r.ok:
        return r.content
    else:
        print("Error on requesting " + url)
        exit(0)


def request_json(url):
    r = requests.get(url)

    time.sleep(1)

    if r.ok:
        return r.json()
    else:
        print("Error on requesting " + url)
        exit(0)


def put_request(url, payload):
    r = requests.put(url, json=payload, headers={
        "Authorization": "Bearer " + token
    })

    print(r.status_code)
    if r.ok:
        print(f"Done updating {payload}")
    else:
        print(r)
        exit(1)


print("Fetching release date data...")

release_data = request(release_date_data)

soup = BeautifulSoup(release_data, 'html.parser')

# get the second table that is in the site
table = soup.findAll("tbody")[1]

data = {}
regions = [
    "bandle-city", "bilgewater", "demacia", "ionia", "ixtal", "noxus",
    "piltover", "shadow-isles", "shurima", "mount-targon", "freljord", "void", "zaun"
]

reg_dict = {
    "bandle-city": "Bandle City",
    "bilgewater": "Bilgewater",
    "demacia": "Demacia",
    "ionia": "Ionia",
    "ixtal": "Ixtal",
    "noxus": "Noxus",
    "piltover": "Piltover",
    "shadow-isles": "Shadow Isles",
    "shurima": "Shurima",
    "mount-targon": "Targon",
    "freljord": "The Freljord",
    "void": "The Void",
    "zaun": "Zaun"
}

for row in table.findAll("tr"):
    columns = row.findAll("td")

    if columns:

        # get champ name from a tag that has title attribute and remove /lol from it
        champion = columns[0].find("a")["title"].replace("/LoL", "")

        # get only year
        created = columns[2].text.strip()[0:4]

        data[champion] = [{"released": created}]


print("Done")

print("Fetching champion regions")

for faction in regions:
    region_url = f"https://universe-meeps.leagueoflegends.com/v1/en_sg/factions/{faction}/index.json"

    region_data = request_json(region_url)

    region_champions = []

    for x in region_data["associated-champions"]:
        region_champions.append(x.get("name"))

    for champ in region_champions:
        champ = str(champ).replace("’", "'")

        if len(data[champ]) is 1:
            data[champ].append({"region": reg_dict[faction]})
        else:
            print("EDGE CASE")
            data[champ][1]["region"] += "," + reg_dict[faction]

    print(f"Region: {faction} done")

print("Done")

print("Fetching champion detailed data")

for champion in data.keys():

    print("Doing champion: " + champion)

    # for champ in data:
    detailed_champ_data = f"https://leagueoflegends.fandom.com/wiki/{champion}/LoL"

    detailed_data = request(detailed_champ_data)

    soup = BeautifulSoup(detailed_data, 'html.parser')

    positions = soup.findAll("span", {"data-tip": ["Middle", "Top", "Jungle", "Bottom", "Support"]})

    rangeTypes = soup.findAll("span", {"data-tip": ["Melee", "Ranged"]}, limit=2)

    damageType = soup.findAll("a", {"title": ["Adaptive force"]})[-1].getText()

    position = []

    rangeType = []

    # loop through positions and append them to list
    for pos in positions:
        if pos['data-tip'] not in position:
            position.append(pos['data-tip'])

    # loop through range types and append them to list
    for rng in rangeTypes:
        if rng['data-tip'] not in rangeType:
            rangeType.append(rng['data-tip'])

    if len(data[champion]) is 1:
        data[champion].append({"region": "NotFound"})

    data[champion].append({"positions": position})
    data[champion].append({"rangeTypes": rangeType})
    data[champion].append({"damageType": damageType})

    payload = {"champion": champion, "data": data[champion]}
    print(payload)
    put_request(update_data_url, payload)

    print("Done")
