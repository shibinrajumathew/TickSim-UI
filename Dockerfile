FROM nginx:stable-alpine

VOLUME /usr/share/nginx/html/

CMD ["nginx", "-g", "daemon off;"]
