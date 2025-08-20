import { test, expect } from "@playwright/test";

// Mock examples that use our local app instead of external URLs
test("has title", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // Expect the page to have a title that matches the actual title
  await expect(page).toHaveTitle(/Vite \+ React \+ TS/);
});

test("get started link", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // Click the start quiz button
  await page.getByRole("button", { name: /Start Quiz/i }).click();

  // Verify that the quiz starts
  await expect(page.locator('[data-testid="question-card"]')).toBeVisible();
});
