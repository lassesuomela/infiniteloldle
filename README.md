# Readme 

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Bootstrap](https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)


[![Build](https://github.com/lassesuomela/infiniteloldle/actions/workflows/node.js.yml/badge.svg)](https://github.com/lassesuomela/infiniteloldle/actions/workflows/node.js.yml)
![Demo website](https://img.shields.io/website?down_message=Offline&label=Demo&up_message=Online&url=https%3A%2F%2Finfiniteloldle.com)

---

Wordle like site where users can guess League of Legends champions endlessly. Frontend is made with React and Bootstrap 5. Backend is made with Node.js and Express.js framework. Database is MySQL. Nginx is used as a webserver to serve frontend files and also to be reverse proxy to Express.js backend. Everything is packaged into Docker containers and those are managed with docker-compose. Created basic CI/CD pipeline with GitHub actions that builds frontend and deploys them to VPS.

## Demo
Demo of this repository will be available at [https://www.infiniteloldle.com](https://www.infiniteloldle.com).

---
## How to run backend
- `cd ./backend`
- run `npm i`
- install sql scheme with `*.sql` file
- create ".env" file and populate it with your credentials
  - `DB_HOST=localhost`
  - `DB_USERNAME=root`
  - `DB_PASSWORD=root`
  - `DB_DATABASE=loldle`
  - `TOKEN=some_secret_token_for_jwt_auth` # used only for importing data to database
- run `npm start` and the backend is running at [http://localhost:8081](http://localhost:8081)
---
## How to run frontend
- `cd ./frontend`
- run `npm i`
- run `npm start` and the frontend is running at [http://localhost:3000](http://localhost:3000)

---
## Screenshots below from the site

First visit insert nickname
![First visit](screenshots/nickname.png)

Guess champion game
![Couple guesses](screenshots/guesses.png)

Guessed correclty
![Guessed correclty](screenshots/guess_victory.png)

Guess champion based on splash art
![Guess champion based on splash art](screenshots/splash.png)

Image gets clearer when user guesses wrong
![Image gets clearer when user guesses wrong](screenshots/splash_failed_attempts.png)

Correct champion guess on splash art game
![Correct champion guess on splash art game](screenshots/splash_correct.png)

Leaderboard page
![Leaderboard page](screenshots/top10.png)

About page
![About page](screenshots/about.png)

Rest of the about page
![Rest of the about page](screenshots/about_2.png)


Legal page
![Legal page](screenshots/legal.png)

Settings menu
![Settings menu](screenshots/settings.png)