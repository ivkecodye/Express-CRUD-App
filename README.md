# Express + Prisma CRUD App

A full-stack Node.js application with authentication, role-based access control,basic post and tasks CRUD functionality using:

- Express.js
- Prisma ORM
- SQLite (for development)
- JWT Auth
- EJS (for simple frontend)

Install dependencies
npm install

Create your .env file
cp .env.example .env

Set up the database
npx prisma migrate dev --name init

Start the server
npm run dev

