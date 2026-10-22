# Youngsters Sound Entertainment

A web platform built to connect DJs, listeners, upcoming artists, and people looking to book entertainment for events.

## Planned platform capabilities

- Music and DJ mix discovery
- Upcoming artist music uploads
- Comments and replies
- Event announcements
- Event booking
- Live-event broadcasting

## Technology

- React, TypeScript, and Vite
- Node.js backend
- Prisma ORM
- MySQL
- M-Pesa payment integration

## Getting started

### 1. Requirements

Install Node.js and MySQL. Ensure your local MySQL server is running and that you have a dedicated application database.

### 2. Install dependencies

From the project root:

```bash
npm install
```

Install frontend dependencies if the client has its own package file:

```bash
cd client
npm install
cd ..
```

### 3. Configure environment variables

Create your local environment file from the example:

```powershell
Copy-Item .env.example .env
```

Edit `.env` locally and provide your own database connection and payment configuration.

**Never commit `.env` or publish live payment credentials.**

### 4. Run the application

Check the scripts in the root `package.json` and `client/package.json` to confirm the correct development commands before starting the backend and frontend.

## Security

- Keep credentials and API keys out of source control.
- Use M-Pesa sandbox credentials for development.
- Configure callback URLs using an appropriate reachable endpoint.
- Do not commit local databases, user uploads, or build artifacts.

## Database notes

Prisma schema and migration files are maintained under `prisma/`. Review the database provider and migration history before applying migrations to a new database.

## Project status

Under active development.

## License

No license has been specified yet.
