FROM node:20-bullseye-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN apt-get update && apt-get install -y openssl
RUN npm install

COPY . .

# Generate Prisma Client
RUN npx prisma@5.20.0 generate --schema ./prisma/schema/

RUN npm run build

FROM node:20-bullseye-slim

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 5002

CMD ["npm", "start"]
