import { test, expect } from '@playwright/test';

test.describe('Neural Network Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
  });

  test('should render the neural network diagram', async ({ page }) => {
    // Look for the neural network visualization SVG
    const visualization = page.locator('svg').first();
    await expect(visualization).toBeVisible({ timeout: 10000 });
    
    // Check for nodes in the neural network
    const nodes = visualization.locator('circle');
    await expect(nodes).toHaveCount(8, { timeout: 5000 }); // 8 nodes in the network
  });

  test('should render the stepper component', async ({ page }) => {
    // Look for stepper navigation buttons
    const nextButton = page.getByRole('button', { name: /next/i }).first();
    await expect(nextButton).toBeVisible({ timeout: 10000 });
    
    // Check for step explanation text
    const explanation = page.locator('.explanation-container p').first();
    await expect(explanation).toBeVisible({ timeout: 5000 });
  });

  test('should render math formulas or explanations', async ({ page }) => {
    // Check for explanation text in the main content area
    const explanation = page.locator('.explanation-container p').first();
    await expect(explanation).toContainText(/neural network|input|output|hidden layer/i, { timeout: 10000 });
  });

  test('should navigate through steps', async ({ page }) => {
    const nextButton = page.getByRole('button', { name: /next/i }).first();
    const prevButton = page.getByRole('button', { name: /previous/i }).first();
    
    // Navigate forward a few steps
    for (let i = 0; i < 3; i++) {
      await nextButton.click();
      await page.waitForTimeout(500);
    }
    
    // Navigate back
    for (let i = 0; i < 2; i++) {
      await prevButton.click();
      await page.waitForTimeout(500);
    }
    
    // Verify UI is still responsive
    const explanation = page.locator('.explanation-container p').first();
    await expect(explanation).toBeVisible();
  });

  test('should have disabled previous button on first step', async ({ page }) => {
    const prevButton = page.getByRole('button', { name: /previous/i }).first();
    const isDisabled = await prevButton.evaluate(button => (button as HTMLButtonElement).disabled);
    expect(isDisabled).toBeTruthy();
  });

  test('should render the calculation box', async ({ page }) => {
    const calcBox = page.locator('.calc-box');
    await expect(calcBox).toBeVisible({ timeout: 5000 });
    
    // Check for the calculation box content
    const calcContent = calcBox.locator('p, div').first();
    await expect(calcContent).toBeVisible();
  });

  test('should show different content after navigation', async ({ page }) => {
    const nextButton = page.getByRole('button', { name: /next/i }).first();
    const prevButton = page.getByRole('button', { name: /previous/i }).first();
    
    // Get initial explanation text
    const initialExplanation = await page.locator('.explanation-container p').first().textContent();
    
    // Navigate forward
    await nextButton.click();
    await page.waitForTimeout(500);
    
    // Get new explanation text
    const newExplanation = await page.locator('.explanation-container p').first().textContent();
    
    // Verify content changed
    expect(newExplanation).not.toBe(initialExplanation);
    
    // Navigate back
    await prevButton.click();
    await page.waitForTimeout(500);
    
    // Get final explanation text
    const finalExplanation = await page.locator('.explanation-container p').first().textContent();
    
    // Verify we're back to the original content
    expect(finalExplanation).toBe(initialExplanation);
  });

  test('should navigate through all 17 steps successfully', async ({ page }) => {
    const nextButton = page.getByRole('button', { name: /next/i }).first();
    const prevButton = page.getByRole('button', { name: /previous/i }).first();
    
    // Store the initial content to verify we can return to it
    const initialContent = await page.locator('.explanation-container p').first().textContent();
    
    // Array to store content from each step to ensure they're all different
    const stepContents: string[] = [];
    
    // Navigate forward through all 17 steps
    for (let step = 1; step <= 17; step++) {
      // Get the current step content before navigating
      const currentContent = await page.locator('.explanation-container p').first().textContent();
      stepContents.push(currentContent || '');
      
      // If not on the last step, click next
      if (step < 17) {
        await nextButton.click();
        // Wait for content to update
        await page.waitForTimeout(300);
        
        // Verify the content has changed
        const newContent = await page.locator('.explanation-container p').first().textContent();
        expect(newContent).not.toBe(currentContent);
      }
    }
    
    // Verify we've seen all unique steps
    const uniqueSteps = new Set(stepContents);
    expect(uniqueSteps.size).toBe(17);
    
    // Navigate back to the beginning
    for (let step = 0; step < 16; step++) {
      await prevButton.click();
      await page.waitForTimeout(300);
    }
    
    // Verify we're back to the initial content
    const finalContent = await page.locator('.explanation-container p').first().textContent();
    expect(finalContent).toBe(initialContent);
    
    // Verify previous button is disabled on first step
    const isDisabled = await prevButton.evaluate(button => (button as HTMLButtonElement).disabled);
    expect(isDisabled).toBeTruthy();
  });

  test('should display data visualization', async ({ page }) => {
    // Look for any data visualization elements
    const chart = page.locator('svg, canvas, [class*="chart"], [class*="graph"], [class*="visualization"]').first();
    
    // If no dedicated chart found, look for any data tables or visual elements
    if (!await chart.isVisible()) {
      const dataTable = page.locator('table, [class*="table"], [class*="data"]').first();
      await expect(dataTable).toBeVisible({ timeout: 10000 });
    } else {
      await expect(chart).toBeVisible({ timeout: 10000 });
      
      // Check for chart elements with flexible selectors
      const chartElements = chart.locator('path, line, rect, circle, [class*="bar"], [class*="line"]');
      await expect(chartElements.first()).toBeVisible({ timeout: 10000 });
    }
  });
});
