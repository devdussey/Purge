import { test, expect } from '@playwright/test';

const DASHBOARD_URL = '/';

async function openDashboard(page: import('@playwright/test').Page) {
  await page.goto(DASHBOARD_URL);
  await page.waitForSelector('text=Quick Actions');
}

test.describe('Dashboard Tab - Web', () => {
  test.beforeEach(async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    await openDashboard(page);
    expect(consoleErrors).toEqual([]);
  });

  test('shows header branding and platform warning', async ({ page }) => {
    const header = page.locator('header');
    await expect(header.getByAltText('Purge Logo')).toBeVisible();
    await expect(header.getByAltText('Purge')).toBeVisible();
    const warning = page.getByText('Web Version Limitations', { exact: false });
    await expect(warning).toBeVisible();
  });

  test('renders dashboard stats widgets', async ({ page }) => {
    await expect(page.getByText('Threats Blocked')).toBeVisible();
    await expect(page.getByText('Files Scanned')).toBeVisible();
    await expect(page.getByText('Scan Speed')).toBeVisible();
    await expect(page.getByText('Last Scan')).toBeVisible();
    await expect(page.getByText('Quarantined')).toBeVisible();
    await expect(page.getByText('System Health')).toBeVisible();
  });

  test('displays system status cards with indicators', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 2, name: 'System Status' })).toBeVisible();
    await expect(page.getByText('Real-time Protection')).toBeVisible();
    await expect(page.getByText('Virus Definitions')).toBeVisible();
    await expect(page.getByText('Network Protection')).toBeVisible();
    await expect(page.getByText('System Performance')).toBeVisible();
    await expect(page.locator('span:has-text("Active")').first()).toBeVisible();
  });

  test('quick actions show download prompt for desktop-only features', async ({ page }) => {
    await page.getByRole('button', { name: /Quick Scan/ }).click();
    await expect(page.getByRole('heading', { level: 2, name: 'Download Required' })).toBeVisible();
    await expect(page.getByText('File Scanning requires the desktop app', { exact: false })).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();

    await page.getByRole('button', { name: /Full System Scan/ }).click();
    await expect(page.getByText('Full System Scan requires the desktop app', { exact: false })).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();

    await page.getByRole('button', { name: /Toggle Protection/ }).click();
    await expect(page.getByText('Real-time Protection requires the desktop app', { exact: false })).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();

    await page.getByRole('button', { name: /Quarantine Manager/ }).click();
    await expect(page.getByText('Quarantine Management requires the desktop app', { exact: false })).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
  });

  test('update definitions runs without download modal', async ({ page }) => {
    await page.getByRole('button', { name: /Update Definitions/ }).click();
    await expect(page.locator('text=Download Required')).toHaveCount(0);
  });

  test('navigation tabs switch views and show crypto web demo badge', async ({ page }) => {
    const cryptoTab = page.getByRole('button', { name: 'Crypto Protection' });
    await cryptoTab.click();
    await expect(page.getByText('WEB DEMO', { exact: false })).toBeVisible();
    await expect(page.getByText('Download desktop app for real-time protection')).toBeVisible();

    const dashboardTab = page.getByRole('button', { name: 'Dashboard' });
    await dashboardTab.click();
    await expect(page.getByText('Quick Actions')).toBeVisible();
  });

  test('threat feed lists seed alerts and filter buttons', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 2, name: 'Threat Feed' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Malware' })).toBeVisible();
    await expect(page.locator('text=Trojan.Win32.Agent detected')).toBeVisible();
    await expect(page.locator('text=Suspicious outbound connection')).toBeVisible();
  });

  test('beta feedback widget opens and validates form fields', async ({ page }) => {
    await page.getByRole('button', { name: 'Beta Feedback' }).click();
    await expect(page.getByText('Beta Feedback')).toBeVisible();
    await expect(page.getByPlaceholder('Describe the bug and how to reproduce it...')).toBeVisible();
    await expect(page.getByPlaceholder('Your email (optional, for follow-up)')).toBeVisible();
    await page.getByRole('button', { name: 'Send Feedback' }).click({ force: true });
    await expect(page.getByPlaceholder('Describe the bug and how to reproduce it...')).toBeVisible();
  });
});
