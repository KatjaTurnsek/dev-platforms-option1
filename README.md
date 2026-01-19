# dev-platforms-option1

A beginner-friendly development platforms setup using **Node.js**, **Express**, and **TypeScript**.
This project runs a small API locally and is tested with **Postman**.

## Installation

### Requirements

- Node.js + npm installed
- (Optional) Postman Desktop Agent for testing localhost requests

### Setup

1. Clone the repo:

```bash
git clone https://github.com/KatjaTurnsek/dev-platforms-option1.git
```

2. Go into the project folder:

```bash
cd dev-platforms-option1
```

3. Install dependencies:

```bash
npm install
```

## Configuration

No environment variables are required for this version of the project.

## Run the project (development)

Start the server:

```bash
npm run dev
```

The server runs at:

- http://localhost:3000

Stop the server with:

- `Ctrl + C`

## Available scripts

- `npm run dev` - runs the server in watch mode using `tsx`

## Endpoints

- `GET /`  
  Returns a simple text message.

- `GET /health`  
  Returns JSON:
  ```json
  { "status": "ok" }
  ```

## Testing with Postman

1. Open Postman and select **Desktop Agent** (Cloud Agent can’t call localhost)
2. Send requests to:

- `GET http://localhost:3000/`
- `GET http://localhost:3000/health`

## Project structure

```txt
dev-platforms-option1/
├─ src/
│  └─ server.ts
├─ package.json
├─ package-lock.json
├─ package-lock.json
├─ tsconfig.json
└─ README.md
```

## Motivation

I chose **Option 1** because I wanted to test working on the **server-side** only and wanted practice setting up a small API using modern development tooling (TypeScript, npm scripts, and a simple Express server).

**What I liked:** getting a server running quickly, adding routes, and testing responses in Postman.

**What I didn’t enjoy:** small setup issues (like Postman Cloud Agent not working with localhost) can be confusing as a beginner.

**What I found difficult:** understanding how the tooling pieces fit together (TypeScript config, dev server/watch, and how Express starts and listens on a port).

**Custom API vs SaaS (e.g. Supabase):**  
A custom API gives me more control, but it’s more work to set up and maintain. Supabase can speed things up because it provides many backend features for you, but you rely on the service and may have less flexibility.
