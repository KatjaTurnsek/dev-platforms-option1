# development-platforms-ca (Option 1)

A simple **News Platform API** built with **Express + TypeScript + MySQL**.

Users can:
- register and log in (JWT auth + bcrypt password hashing)
- view all news articles (public)
- create new articles (protected route, requires JWT)

Tested with **Postman**.

---

## Tech stack

- Express.js (TypeScript)
- MySQL + mysql2
- JWT authentication
- bcrypt password hashing

---

## Installation

### Requirements
- Node.js + npm
- MySQL (local)
- (Recommended) Postman Desktop Agent (for localhost requests)

### Setup

1. Clone the repo and enter the folder:

```bash
git clone https://github.com/KatjaTurnsek/development-platforms-ca.git
cd development-platforms-ca
```

2. Install dependencies:

```bash
npm install
```

---

## Configuration

Create a `.env` file in the project root:

```env
JWT_SECRET=change_me_to_a_long_random_string
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=blog
DB_PORT=3306
```

Notes:
- `JWT_SECRET` can be any long random string.
- `DB_PASSWORD` is the password you set in MySQL.
- The database name (`DB_NAME`) must match the schema you created (example: `blog`).

---

## Database

This repo includes an exported SQL file:

- `development-platforms-ca.sql`

Import it in MySQL Workbench (or via CLI) to create the schema and tables.

Tables used:
- `users (id, email, password_hash, created_at)`
- `articles (id, title, body, category, submitted_by, created_at)`

---

## Run the project

### Development (watch mode)
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Start production build
```bash
npm start
```

Server runs on:
- `http://localhost:3000`

Stop with:
- `Ctrl + C`

---

## Endpoints

### Auth
- `POST /auth/register`  
  Body:
  ```json
  { "email": "test@example.com", "password": "Password123!" }
  ```

- `POST /auth/login`  
  Body:
  ```json
  { "email": "test@example.com", "password": "Password123!" }
  ```
  Returns:
  ```json
  { "token": "..." }
  ```

### Articles
- `GET /articles` (public)  
  Returns list of articles with submitter email.

- `POST /articles` (protected)  
  Requires header:
  `Authorization: Bearer <token>`

  Body:
  ```json
  { "title": "First news", "body": "Hello world", "category": "General" }
  ```

---

## Testing with Postman

Important: use **Desktop Agent** (Cloud Agent can’t call localhost).

Suggested flow:
1. Register: `POST /auth/register`
2. Login: `POST /auth/login` → copy token
3. Create article: `POST /articles` with Bearer Token
4. View all: `GET /articles`

---

## Motivation

I chose **Option 1** because I wanted to focus on building a backend API with authentication and database integration.

**What I liked:** setting up endpoints with Express Router, connecting to MySQL, and verifying everything in Postman.  
**What I didn’t enjoy:** debugging small setup issues (headers, Postman settings, and environment variables).  
**What I found difficult:** connecting all parts together (MySQL + queries, JWT middleware, validation).  

**Custom API vs SaaS (Supabase):**  
A custom API gives full control over database structure, authentication flow, and logic, but takes more setup and maintenance. Supabase is faster to start with because many backend features are already provided, but you rely on the service and have less control over implementation details.
