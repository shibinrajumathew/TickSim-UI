FROM node:lts-alpine
FROM nginx:stable-alpine

COPY ./dist/ /usr/share/nginx/html

COPY package.json /usr/share/nginx/html

WORKDIR /release/ui/

RUN npm install

EXPOSE 3000