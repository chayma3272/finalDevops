FROM node:lts-alpine as build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build  # doit produire un dossier /dist

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf

# copie du build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
