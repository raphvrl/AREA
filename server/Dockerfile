FROM node:16 AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

FROM node:16-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package.json package-lock.json ./
RUN npm install --production

EXPOSE 8080
CMD ["npm", "run", "start:prod"]
