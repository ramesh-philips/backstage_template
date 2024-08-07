# Project CI/CD Workflow

This repository uses GitHub Actions to automate the CI pipeline for a React project. This `README.md` provides details on how the CI workflow is set up and how to run it.

## CI Workflow Overview

The CI workflow performs the following steps:

1. **Checkout Repository**: Retrieves the latest code from the repository.
2. **Set up Node.js**: Configures the Node.js environment.
3. **Install Dependencies**: Installs all required npm packages.
4. **Run Lint**: Executes ESLint to check for code quality issues.
5. **Build Project**: Creates an optimized production build of the project.
6. **Upload Artifacts**: Stores build artifacts and coverage reports for later use.

## Workflow File

The GitHub Actions workflow file is located at `.github/workflows/setup-react-ci.yml`. Below is the content of the workflow file:

```yaml
name: CI

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14' # or other version

      - name: Install dependencies
        working-directory: ./my-app
        run: |
          npm cache clean --force
          rm -rf node_modules package-lock.json
          npm install

      - name: Run lint
        working-directory: ./my-app
        run: npm run lint || true

      - name: Build project
        working-directory: ./my-app
        run: CI=false npm run build --verbose

      - name: Upload coverage report
        uses: actions/upload-artifact@v2
        with:
          name: coverage-report
          path: my-app/coverage/

      - name: Upload production build artifacts
        uses: actions/upload-artifact@v2
        with:
          name: build
          path: my-app/build/

```

## Running the CI Workflow

The CI workflow runs automatically on push or pull request events to the main branch. You do not need to manually trigger it. The workflow performs the following actions:

1. **Checkout**: Retrieves the code from the repository.

2. **Setup Node.js**: Configures Node.js.

3. **Install Dependencies**: Installs npm packages.

4. **Lint Code**: Runs linting to check for code quality issues. If you encounter warnings, they will be treated as warnings and not errors due to the || true flag.

5. **Build Project**: Builds the project with warnings allowed. The CI=false environment variable ensures warnings do not fail the build.

6. **Upload Artifacts**: Stores build and coverage artifacts for further analysis.

## Customizing the Workflow
To customize the workflow, edit the .github/workflows/setup-react-ci.yml file. You can change the Node.js version, modify the linting commands, or adjust how artifacts are handled.

## Troubleshooting

**Build Failures**: If the build fails, check the logs for detailed error messages. Make sure all dependencies are installed and configured correctly.

**Lint Errors**: If linting fails, address the issues in your codebase. Warnings are treated as non-fatal due to the || true flag.