# rexx

`rexx` is a Movie Management System built using Node.js with a frameworkless perspective.

## Installation

First, create a `.env` file by copying the `.env.example` file.

You should have mongodb up and running on your machine. If not, you can run it with docker compose.


```bash
cp .env.example .env
```

Then, run the following command to install the dependencies:

```bash
npm install
```

## Running linter

```bash
npm run lint
```

## Running the application

```bash
npm run start
```

## Running e2e tests

```bash
npm run test:e2e
```

## Running unit tests

*current unit tests are not implemented*

```bash
npm run test:unit
```

## Running with Docker Compose

```bash
docker compose up -d
```

The server is now running on port 8080 and you can use postman collection to check out the API.
