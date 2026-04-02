# DevOps Demo

A simple React application built to showcase DevOps practices including CI/CD pipelines, containerization, and automated testing.

## Features

- Displays a "DevOps Demo" homepage
- Interactive button that toggles a status message when clicked

## Getting Started

### Prerequisites

- Node.js 20+

### Install dependencies

```bash
npm install
```

### Run in development mode

```bash
npm run dev
```

### Run tests

```bash
npm test
```

### Build for production

```bash
npm run build
npm start   # serves the production build
```

## Docker

Build and run with Docker:

```bash
docker build -t devops-demo .
docker run -p 8080:80 devops-demo
```

Then open http://localhost:8080 in your browser.

## CI/CD

A GitHub Actions workflow is included at `.github/workflows/ci.yml`. On every push or pull request to `main`/`master` it will:

1. Install dependencies
2. Run the linter
3. Run the tests
4. Build the production bundle
