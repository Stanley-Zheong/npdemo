# npdemo

Conventional Java and Vue web application starter. The Spring Boot API and Vue 3 single-page application live in one repository and can be developed and tested independently.

## Structure

```text
backend/                 Spring Boot API
frontend/                Vue 3 + TypeScript application
docs/                    Durable architecture notes
.github/workflows/       Continuous integration
AGENTS.md                Coding-agent contribution contract
CLAUDE.md                Claude Code entry point
Dockerfile               Production image
compose.yaml             Local container stack
Makefile                 Common commands
```

## Requirements

- Java 17+
- Maven 3.8+
- Node.js 22+
- Docker Compose (optional)

## Develop

Run the backend:

```bash
cd backend
mvn spring-boot:run
```

Run the frontend in another terminal:

```bash
cd frontend
npm ci
npm run dev
```

Open <http://localhost:5173>. Vite proxies `/api` to the backend at port 8080.

## Verify

```bash
make test
make build
```

For a production-like local stack:

```bash
cp .env.example .env
docker compose up --build
```

See [docs/architecture.md](docs/architecture.md) for boundaries and [AGENTS.md](AGENTS.md) before using a coding agent.

