# Playwright Project

A Playwright test automation project using TypeScript with Page Object Model (POM) structure.

## 📁 Project Structure

```
playwright-project/
├── tests/              # Test spec files
│   └── example.spec.ts
├── pages/              # Page Object Model classes
│   ├── BasePage.ts
│   └── HomePage.ts
├── utils/              # Helper utilities
│   └── helpers.ts
├── playwright.config.ts
├── tsconfig.json
├── package.json
└── .gitignore
```

## 🚀 Getting Started

### Install dependencies
```bash
npm install
```

### Install Playwright browsers
```bash
npx playwright install
```

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run with UI mode (interactive)
npm run test:ui

# Run in headed mode (see browser)
npm run test:headed

# Run on specific browser
npm run test:chrome
npm run test:firefox
npm run test:safari

# View HTML report
npm run test:report
```

## 📄 Writing Tests

Tests live in the `tests/` folder with `.spec.ts` extension.
Use Page Objects from `pages/` for cleaner, reusable test code.

```typescript
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test('example test', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.open();
  await homePage.assertHeadingVisible();
});
```
