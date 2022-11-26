import requests
from time import sleep
import os.path
from alive_progress import alive_bar
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


def fetch(c):
    champ = c.get("championKey")
    ids = c.get("spriteIds")

    #print("Fetching splash art for " + champ)

    idList = ids.split(",")

    for idx, champId in enumerate(idList):

        if os.path.isfile("./splash/" + champ + "_" + champId + ".jpg"):
            #print(champ + "_" + champId + " file was found. Skipping...")
            continue

        #print("Fetching splash data")
        championImageUrl = f"https://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + champ + "_" + champId + ".jpg"
        #print(championImageUrl)

        r = requests.get(championImageUrl)

        if not r.ok:
            print(r)
            print(r.headers)
            print(r.content)
            exit(1)

        with open("./splash/" + champ + "_" + champId + ".jpg", "wb") as handler:
            handler.write(r.content)

        #print(str(idx + 1) + "/" + str(len(idList)))
        sleep(3)


print("Fetching champion data")

champions = get(championKeysUrl).json().get("championKeys")

print("Done")

with alive_bar(len(champions), force_tty=True) as bar:

    for champion in champions:

        fetch(champion)

        bar()
