# Playwright setup

## Files to add

- `tests/todo.spec.ts`
- `playwright.config.ts`
- `package.json`
- `.github/workflows/playwright.yml`

## Install

```bash
npm install
npx playwright install --with-deps chromium
```

## Run locally

```bash
npm run test:e2e
```

Run with browser visible:

```bash
npm run test:e2e:headed
```

Open Playwright UI:

```bash
npm run test:e2e:ui
```

Open the last HTML report:

```bash
npm run test:e2e:report
```

## Repo structure

Recommended structure:

```text
.
├── index.html
├── style.css
├── script.js
├── package.json
├── playwright.config.ts
├── tests/
│   └── todo.spec.ts
└── .github/
    └── workflows/
        └── playwright.yml
```

## PR integration

The GitHub Actions workflow runs automatically on:

- every pull request targeting `main`
- every push to `main`

That means the tests run automatically when a PR is opened, updated, or synchronized.

## How to add the workflow

Move the generated workflow file into the correct location:

```bash
mkdir -p .github/workflows tests
mv ~/Downloads/playwright-pr.yml .github/workflows/playwright.yml
mv ~/Downloads/todo.spec.ts tests/todo.spec.ts
mv ~/Downloads/playwright.config.ts .
mv ~/Downloads/package.json .
```

Then commit and push:

```bash
git add .
git commit -m "test: add Playwright setup and PR workflow"
git push
```

## How PR triggering works

Once `.github/workflows/playwright.yml` is in the repo:

1. create a branch
2. push changes
3. open a pull request against `main`
4. GitHub Actions starts the Playwright workflow automatically
5. check the run in the PR under **Checks** or **Actions**

## Notes

- This setup uses a simple static server via `serve` on port `3000`.
- The Playwright config starts that server automatically before tests.
- If you already have a `package.json`, merge the scripts and devDependencies instead of replacing the file.
