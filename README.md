# 🏒 NHL Service (NestJS + Prisma + SQLite)

TODO

## 🚀 Tech Stack

- [NestJS](https://nestjs.com/)
- [Prisma ORM v7](https://www.prisma.io/)
- SQLite (file-based DB)
- Pino logger (`nestjs-pino`)
- Prisma Better SQLite3 adapter

## ⚙️ Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create file .env file

```bash
cp .env.example .env
```

### 3. Prisma

Generate the Prisma client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev --name "name-of-migration"
```

## 🧪 Run application

```bash
npm run start:dev
```

Production build

```bash
npm run build
npm run start:prod
```
