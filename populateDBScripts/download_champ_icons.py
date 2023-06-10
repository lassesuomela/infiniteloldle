import requests
import os
from dotenv import load_dotenv

load_dotenv()
token = os.getenv("TOKEN")

championKeysUrl = "http://localhost:8081/api/champion/keys"


def get(url):

    req = requests.get(url, headers={
        "Authorization": "Bearer " + token
    })

    if req.ok:
        return req
    else:
        print("error on fetching data " + req)
        exit(1)


champions = get(championKeysUrl).json().get("championKeys")

for champion in champions:

    champ = str(champion.get("championKey"))

    print("Fetching for " + champ)

    championImageUrl = f"https://ddragon.leagueoflegends.com/cdn/12.22.1/img/champion/{champ}.png"

    r = requests.get(championImageUrl)

    if not r.ok:
        print(r)
        exit(1)

    with open("./images/" + champ + ".png", "wb") as handler:
        handler.write(r.content)
