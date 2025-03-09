# Readme

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Bootstrap](https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)

[![Build](https://github.com/lassesuomela/infiniteloldle/actions/workflows/node.js.yml/badge.svg)](https://github.com/lassesuomela/infiniteloldle/actions/workflows/node.js.yml)
![Demo website](https://img.shields.io/website?down_message=Offline&label=Demo&up_message=Online&url=https%3A%2F%2Finfiniteloldle.com)

---

[Wordle](https://www.nytimes.com/games/wordle/index.html) like site where users can guess League of Legends champions endlessly. Inspiration taken greatly from another worlde clone that focuses on LoL [loldle.net](https://loldle.net).

Frontend is made with React and Bootstrap 5. Backend is made with Node.js and Express.js framework. Database is MySQL. Nginx is used as a webserver to serve frontend files, images etc and also to act as a reverse proxy for the backend.

Everything is packaged into Docker containers and those are managed with docker-compose.yml file in the backend directory. Created basic CI/CD pipeline with GitHub actions that builds docker images and runs tests on them and also builds frontend and deploys them to VPS.

Python was used gather champion data via web scraping and doing API requests to DDragon.

Jest was used to make some tests to backend.

## Demo

Demo of this repository will be available at [https://www.infiniteloldle.com](https://www.infiniteloldle.com).

---

## How to run backend

- `cd ./backend`
- run `npm i`
- install sql scheme with `*.sql` file
- create ".env" file and populate it with your credentials

      DB_HOST=loldle-mysql
      DB_USERNAME=root
      DB_PASSWORD=root
      DB_DATABASE=loldle
      TOKEN=some_secret_token_for_jwt_auth # used only for importing data to database
      NODE_ENV=dev # used only for importing data to database otherwise use production
      ENV=dev # used only for importing data to database otherwise use production

- run `npm start` and the backend is running at [http://localhost:8081](http://localhost:8081)

---

## Prepare images for frontend

All images should be in webp format (excluding favicon). You can use scripts in populateDBScripts folder to get all images that you need. They might need some tinkering.

Folder structure should look like this:

    └── frontend/
      └── public/
          ├── champions # champion icons ie. Aatrox.webp
          ├── items # item icons ie. 1001.webp
          ├── old_items # old item icons ie. Abyssal_Scepter.webp
          └── splash_arts # champion splash arts ie. Aatrox_0.webp # 0 indicates the splash art id

## How to run frontend

- `cd ./frontend`
- run `npm i`
- run `npm start` and the frontend is running at [http://localhost:3000](http://localhost:3000)

Frontend API config is in \frontend\src\configs\config.js

## How to run tests

- `cd ./backend`
- run `npm test`

## Code coverage

![Code coverage](screenshots/backend/coverage.png)

---

## Screenshots below from the site

### Guess champion game

![Couple guesses](screenshots/frontend/guess_wrong.png)

### Guessed correclty

![Guessed correclty](screenshots/frontend/guess_victory.png)

### Guess champion based on splash art

![Guess champion based on splash art](screenshots/frontend/splash_game.png)

### Correct champion guess on splash art game

![Correct champion guess on splash art game](screenshots/frontend/guess_splash_victory.png)

### Item guessing game

![Item guessing game](screenshots/frontend/guess_item.png)

### Item guessing game modified

![Item guessing game](screenshots/frontend/guess_item_mod.png)

### Items guessing game correct answer

![Items guessing game correct answer](screenshots/frontend/guess_item_victory.png)

### Legacy item game victory

![Legacy item game](screenshots/frontend/legacy_game_victory.png)

### Leaderboard page

![Leaderboard page](screenshots/frontend/scoreboard.png)

### About page

![About page](screenshots/frontend/about_1.png)

### Rest of the about page

![Rest of the about page](screenshots/frontend/about_2.png)

### Legal page

![Legal page](screenshots/frontend/legal.png)

### My stats

![My stats 1](screenshots/frontend/my_stats_1.png)
![My stats 2](screenshots/frontend/my_stats_2.png)

### Global stats

![Global stats 1](screenshots/frontend/stats_1.png)
![Global stats 2](screenshots/frontend/stats_2.png)
![Global stats 3](screenshots/frontend/stats_3.png)
![Global stats 4](screenshots/frontend/stats_4.png)

### Modifications

![Modifications](screenshots/frontend/modifications.png)

### Settings menu

![Settings menu](screenshots/frontend/settings.png)

# Legal disclaimer

Infiniteloldle.com isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.

Infiniteloldle.com was created under Riot Games' "Legal Jibber Jabber" policy using assets owned by Riot Games. Riot Games does not endorse or sponsor this project.
