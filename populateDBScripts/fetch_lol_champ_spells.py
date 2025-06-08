import requests
import json
import os
from PIL import Image

def get_latest_version():
    url = "https://ddragon.leagueoflegends.com/api/versions.json"
    response = requests.get(url)
    return response.json()[0]  # Latest version

def get_all_champions(version):
    url = f"https://ddragon.leagueoflegends.com/cdn/{version}/data/en_US/champion.json"
    response = requests.get(url)
    return response.json()["data"]

def download_and_convert_image(url, save_path):
    response = requests.get(url, stream=True)
    if response.status_code == 200:
        with open(save_path, 'wb') as file:
            file.write(response.content)
        img = Image.open(save_path)
        webp_path = save_path.replace(".png", ".webp")
        img.save(webp_path, "WEBP")
        os.remove(save_path)  # Remove original PNG
        return webp_path
    return None

def get_champion_spells(version, champ_id):
    url = f"https://ddragon.leagueoflegends.com/cdn/{version}/data/en_US/champion/{champ_id}.json"
    response = requests.get(url)
    champ_data = response.json()["data"][champ_id]
    spells = champ_data["spells"]
    
    spell_info = []
    os.makedirs("spell_images", exist_ok=True)
    for spell in spells:
        image_url = f"https://ddragon.leagueoflegends.com/cdn/{version}/img/spell/{spell['image']['full']}"
        image_path = os.path.join("spell_images", spell['image']['full'])
        webp_path = download_and_convert_image(image_url, image_path)
        
        spell_info.append({
            "champion": champ_id,
            "spell_name": spell["name"],
            "spell_id": spell["id"],
            "spell_image": webp_path
        })
    return spell_info

def main():
    version = get_latest_version()
    champions = get_all_champions(version)
    all_spells = []
    
    for champ_id in champions:
        spells = get_champion_spells(version, champ_id)
        all_spells.extend(spells)
    
    with open("champion_spells.json", "w") as f:
        json.dump(all_spells, f, indent=4)
    
    print("Champion spells data saved to champion_spells.json")

if __name__ == "__main__":
    main()
