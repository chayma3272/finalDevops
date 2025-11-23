FROM node:lts-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

FROM node:lts-alpine
WORKDIR /app

COPY --from=build /app /app

EXPOSE 5000
CMD ["npm", "start"]
