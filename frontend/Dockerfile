FROM node:16.13-alpine3.12 as build-stage
WORKDIR /app
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine as prod-stage
RUN apt-get update && apt-get install -y logrotate
COPY --from=build-stage /app/build /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /temp/prod.conf
COPY --from=build-stage /app/logrotate.conf /temp/prod_logrotate

RUN envsubst /app < /temp/prod.conf > /etc/nginx/nginx.conf
RUN envsubst /app < /temp/prod_logrotate > /etc/logrotate.d/nginx

EXPOSE 80
EXPOSE 443

CMD ["sh", "-c", "logrotate /etc/logrotate.d/nginx && nginx -g 'daemon off;'"]
