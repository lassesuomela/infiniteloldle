FROM node:16.13-alpine3.12

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
