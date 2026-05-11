# build stage
FROM node:20

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
# COPY .env ./

RUN npm install
RUN DATABASE_URL=file:/data/prod.db npx prisma generate

COPY . .

RUN npm run build

RUN mkdir -p /data

EXPOSE 3000

#CMD ["npm", "start"]
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]