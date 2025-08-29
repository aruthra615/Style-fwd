FROM node:20-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production || npm install --omit=dev

COPY . .

EXPOSE 8080
ENV NODE_ENV=production
CMD ["node", "server.js"]
