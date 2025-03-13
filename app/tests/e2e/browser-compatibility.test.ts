/**
 * End-to-end tests for browser compatibility
 * 
 * Note: These tests are designed to be run with Playwright
 * Install with: npm install --save-dev @playwright/test
 */

import { test, expect } from '@playwright/test';

// Test different pages across browsers
test.describe('Browser Compatibility Tests', () => {
  // Test home page
  test('Home page should render correctly across browsers', async ({ page }) => {
    await page.goto('/');
    
    // Check for key elements
    await expect(page.locator('h1')).toContainText('NoamX Arena');
    await expect(page.locator('nav')).toBeVisible();
    
    // Check for animations
    const animatedElements = await page.$$('[class*="animate-"]');
    expect(animatedElements.length).toBeGreaterThan(0);
    
    // Take a screenshot for visual comparison
    await page.screenshot({ path: `./screenshots/home-${test.info().project.name}.png` });
  });
  
  // Test model selection page
  test('Model selection page should render correctly', async ({ page }) => {
    await page.goto('/models');
    
    // Check for model cards
    await expect(page.locator('.grid')).toBeVisible();
    
    // Check filtering functionality
    await page.fill('[placeholder="Search models..."]', 'GPT');
    await page.waitForTimeout(500); // Wait for filtering to apply
    
    // Verify filter results
    const visibleModels = await page.$$('.grid > div');
    expect(visibleModels.length).toBeGreaterThan(0);
    
    // Take a screenshot for visual comparison
    await page.screenshot({ path: `./screenshots/models-${test.info().project.name}.png` });
  });
  
  // Test comparison page
  test('Comparison page should render charts correctly', async ({ page }) => {
    // Navigate to comparison page
    await page.goto('/compare');
    
    // Select models to compare
    await page.click('text=GPT-4');
    await page.click('text=Claude');
    
    // Enter test prompt
    await page.fill('textarea', 'Explain quantum computing in simple terms');
    
    // Run comparison
    await page.click('button:has-text("Compare Models")');
    
    // Wait for results
    await page.waitForSelector('.recharts-responsive-container', { timeout: 10000 });
    
    // Check for chart elements
    const charts = await page.$$('.recharts-responsive-container');
    expect(charts.length).toBeGreaterThan(0);
    
    // Take a screenshot for visual comparison
    await page.screenshot({ path: `./screenshots/compare-${test.info().project.name}.png` });
  });
  
  // Test authentication page
  test('Authentication page should render login options', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // Check for authentication providers
    await expect(page.locator('button:has-text("Sign in with Google")')).toBeVisible();
    await expect(page.locator('button:has-text("Sign in with Facebook")')).toBeVisible();
    await expect(page.locator('button:has-text("Sign in with Twitter")')).toBeVisible();
    
    // Check for email login form
    await expect(page.locator('input[type="email"]')).toBeVisible();
    
    // Take a screenshot for visual comparison
    await page.screenshot({ path: `./screenshots/auth-${test.info().project.name}.png` });
  });
  
  // Test responsive layout
  test('Website should be responsive across different screen sizes', async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check for mobile menu
    const mobileMenu = await page.$('button[aria-label="Menu"]');
    expect(mobileMenu).not.toBeNull();
    
    // Take mobile screenshot
    await page.screenshot({ path: `./screenshots/mobile-${test.info().project.name}.png` });
    
    // Test on tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // Take tablet screenshot
    await page.screenshot({ path: `./screenshots/tablet-${test.info().project.name}.png` });
    
    // Test on desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    
    // Take desktop screenshot
    await page.screenshot({ path: `./screenshots/desktop-${test.info().project.name}.png` });
  });
  
  // Test theme switching
  test('Theme switcher should work across browsers', async ({ page }) => {
    await page.goto('/');
    
    // Find and click theme switcher
    await page.click('button[aria-label="Toggle theme"]');
    
    // Wait for theme change animation
    await page.waitForTimeout(1000);
    
    // Check if dark theme is applied
    const isDarkTheme = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });
    
    // Take a screenshot with the new theme
    await page.screenshot({ path: `./screenshots/theme-${test.info().project.name}.png` });
    
    // Toggle back
    await page.click('button[aria-label="Toggle theme"]');
  });
  
  // Test animations and interactive elements
  test('Animations and interactive elements should work correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test button hover animations
    const button = await page.$('button.bg-primary');
    await button?.hover();
    await page.waitForTimeout(500); // Wait for hover animation
    
    // Test card hover effects
    const card = await page.$('.card');
    await card?.hover();
    await page.waitForTimeout(500); // Wait for hover animation
    
    // Take a screenshot to capture animations
    await page.screenshot({ path: `./screenshots/animations-${test.info().project.name}.png` });
  });
});
