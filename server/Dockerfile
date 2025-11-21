# Utiliser l'image Node.js officielle pour le backend
FROM node:lts-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source du backend
COPY . .

# Exposer le port 5000 (le port d'écoute de votre serveur Express)
EXPOSE 5000

# Commande pour démarrer le serveur
CMD [ "npm", "start" ]
