# rexx

`rexx` is a Cinema Management System built using Node.js and framework-agnostic design.

This is a concept project and a learning environment where I'm experimenting with Domain-Driven Design (DDD), Hexagonal Architecture, and advanced software engineering practices. 

## Getting Started

Follow these instructions to set up and run the project on your local machine for development and testing purposes.

## Prerequisites

Before you begin, ensure you have following installed on your system:

- **Node.js**
- **NPM**
- **Docker** (for MongoDB setup)
- **Docker Compose** (for managing containers)

## Installation

Checkout the project from GitHub.
```bash
git clone git@github.com:ademozay/rexx.git
cd rexx
```

Create a `.env` file by copying the `.env.example` file..
```bash
cp .env.example .env
```

Install the dependencies.
```bash
npm install
```

A MongoDB instance is required to run the application. You can run the following command to start the MongoDB container.
```bash
# Run mongodb-setup only once. No need to run it again.
docker compose up mongodb mongodb-setup -d
```

## Running the application

```bash
npm run start
```

## Testing

### Unit Tests

```bash
npm run test:unit
```

### E2E Tests

A MongoDB instance is required to run the tests. You can run the following command to start the MongoDB container for testing.

```bash
# Run mongodb-test-setup only once. No need to run it again.
docker compose up mongodb-test mongodb-test-setup -d
```

You can run the tests with the following command.

```bash
npm run test:e2e
```
