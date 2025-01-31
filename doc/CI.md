# 🚀 Continuous Integration (CI) Documentation

## Introduction
This documentation describes the Continuous Integration (CI) setup for the AREA project using GitHub Actions. It covers workflows, setup steps, and commands used to automate formatting checks, build processes, and repository synchronization.

## 📂 Workflow Structure
GitHub Actions workflows are defined in the `.github/workflows` directory. Each YAML file in this directory represents a distinct workflow.

### Example Structure
```
.github/
  workflows/
    format-check.yml
    build-project.yml
    sync.yml
```

## 🛠️ Workflows

### 📝 Format Check
This workflow verifies code formatting using Prettier and runs ESLint checks for both frontend and backend.

**File:** `.github/workflows/format-check.yml`

**Content:**
```yaml
name: Format Check

on:
  push:
    branches:
      - mathieu/ci
      - dev
      - main
  pull_request:
    branches:
      - dev
      - main

jobs:
  format-check-frontend:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies (Frontend - Web)
        run: |
          cd web && npm install
      - name: Check code formatting with Prettier (Frontend - Web)
        run: |
          cd web && npm run prettier:check
      - name: Lint code with ESLint (Frontend - Web)
        run: |
          cd web && npm run lint

  format-check-backend:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies (Backend - Server)
        run: |
          cd server && npm install
      - name: Check code formatting with Prettier (Backend - Server)
        run: |
          cd server && npm run prettier:check
      - name: Lint code with ESLint (Backend - Server)
        run: |
          cd server && npm run lint
```

---

### 🏗️ Build Project
This workflow builds both the frontend and backend after the format check has successfully completed.

**File:** `.github/workflows/build-project.yml`

**Content:**
```yaml
name: Build Project

on:
  workflow_run:
    workflows: ["Format Check"]
    types:
      - completed

jobs:
  build-frontend:
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies (Frontend - Web)
        run: |
          cd web && npm install
      - name: Build frontend
        run: |
          cd web && CI=false npm run build

  build-backend:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies (Backend - Server)
        run: |
          cd server && npm install
      - name: Build backend
        run: |
          cd server && CI=false npm run build
```

---

### 🔄 Repository Sync
This workflow synchronizes the repository with a mirror after pushing to the main branch.

**File:** `.github/workflows/sync.yml`

**Content:**
```yaml
name: Sync

on:
  push:
    branches:
      - main

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Push to mirror repository
        uses: pixta-dev/repository-mirroring-action@v1
        with:
          target_repo_url: ${{ secrets.MIRROR_URL }}
          ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
```

---

## 📜 Commands Used
Here are the npm commands used in the CI workflows:

- `npm install`: Installs project dependencies.
- `npm run prettier:check`: Checks code formatting with Prettier.
- `npm run lint`: Runs ESLint for code linting.
- `npm run build`: Builds the frontend and backend.

## 📄 Conclusion
This documentation provides an overview of the CI setup for the AREA project using GitHub Actions. For more details on each workflow, please refer to the YAML files in the `workflows` directory.
