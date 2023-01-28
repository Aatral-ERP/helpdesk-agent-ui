### STAGE 1: Build ###
FROM node:16.18.0-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
RUN sh "ls -a"
RUN npm run-script build-autolib-dev
### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/helpdesk-agent /usr/share/nginx/html