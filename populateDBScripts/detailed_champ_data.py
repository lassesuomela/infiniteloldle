import requests
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv

load_dotenv()
update_data_url = "http://localhost:8081/api/champion"

token = os.getenv("TOKEN")


def request(url):
    r = requests.get(url)

    if r.ok:
        return r.content
    else:
        print("Error on requesting " + url)
        exit(0)


def put_request(url, payload):
    r = requests.put(url, json=payload, headers={
        "Authorization": "Bearer " + token
    })

    if r.ok:
        print(f"Done updating {payload}")
    else:
        print(r.json())
        exit(1)


detailed_champ_data = f"https://universe.leagueoflegends.com/en_US/champion/{champion}/"


data = request(detailed_champ_data)

soup = BeautifulSoup(data, 'html.parser')

# get the second table that is in the site
table = soup.findAll("tbody")[1]

data = {}

for row in table.findAll("tr"):
    columns = row.findAll("td")

    if columns:

        # get champ name from a tag that has title attribute and remove /lol from it
        champion = columns[0].find("a")["title"].replace("/LoL", "")

        # get only year
        created = columns[2].text.strip()[0:4]

        data[champion] = created


for key in data:
    print(key + ":" + data[key])
    