import { test, expect } from '@playwright/test';

test.describe('Simple Todo App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('shows empty state on initial load', async ({ page }) => {
    await expect(page.locator('#emptyState')).toBeVisible();
    await expect(page.locator('.todo-item')).toHaveCount(0);
  });

  test('creates a task with Add button', async ({ page }) => {
    await page.fill('#todoInput', 'Buy milk');
    await page.click('#addBtn');

    await expect(page.locator('.todo-item')).toHaveCount(1);
    await expect(page.locator('.todo-text')).toHaveText('Buy milk');
    await expect(page.locator('#todoInput')).toHaveValue('');
    await expect(page.locator('#emptyState')).toBeHidden();
  });

  test('creates a task with Enter key', async ({ page }) => {
    await page.fill('#todoInput', 'Write tests');
    await page.press('#todoInput', 'Enter');

    await expect(page.locator('.todo-item')).toHaveCount(1);
    await expect(page.locator('.todo-text')).toHaveText('Write tests');
  });

  test('rejects empty input', async ({ page }) => {
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('Task cannot be empty.');
      await dialog.accept();
    });

    await page.fill('#todoInput', '   ');
    await page.click('#addBtn');

    await expect(page.locator('.todo-item')).toHaveCount(0);
    await expect(page.locator('#emptyState')).toBeVisible();
  });

  test('toggles task completion', async ({ page }) => {
    await page.fill('#todoInput', 'Finish app');
    await page.click('#addBtn');

    await page.click('button.secondary');
    await expect(page.locator('.todo-text')).toHaveClass(/completed/);
    await expect(page.locator('button.secondary')).toHaveText('Undo');

    await page.click('button.secondary');
    await expect(page.locator('.todo-text')).not.toHaveClass(/completed/);
    await expect(page.locator('button.secondary')).toHaveText('Done');
  });

  test('edits a task', async ({ page }) => {
    await page.fill('#todoInput', 'Old task');
    await page.click('#addBtn');

    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Edit task:');
      await dialog.accept('Updated task');
    });

    await page.click('button:text("Edit")');
    await expect(page.locator('.todo-text')).toHaveText('Updated task');
  });

  test('cancels edit without changing task', async ({ page }) => {
    await page.fill('#todoInput', 'Keep me');
    await page.click('#addBtn');

    page.on('dialog', async dialog => {
      await dialog.dismiss();
    });

    await page.click('button:text("Edit")');
    await expect(page.locator('.todo-text')).toHaveText('Keep me');
  });

  test('rejects empty edited text', async ({ page }) => {
    await page.fill('#todoInput', 'Editable');
    await page.click('#addBtn');

    let seenPrompt = false;
    page.on('dialog', async dialog => {
      if (!seenPrompt) {
        seenPrompt = true;
        await dialog.accept('   ');
      } else {
        expect(dialog.message()).toBe('Task cannot be empty.');
        await dialog.accept();
      }
    });

    await page.click('button:text("Edit")');
    await expect(page.locator('.todo-text')).toHaveText('Editable');
  });

  test('deletes a task', async ({ page }) => {
    await page.fill('#todoInput', 'Remove me');
    await page.click('#addBtn');

    await page.click('button.danger');
    await expect(page.locator('.todo-item')).toHaveCount(0);
    await expect(page.locator('#emptyState')).toBeVisible();
  });

  test('persists tasks after reload', async ({ page }) => {
    await page.fill('#todoInput', 'Persistent task');
    await page.click('#addBtn');
    await page.click('button.secondary');

    await page.reload();

    await expect(page.locator('.todo-item')).toHaveCount(1);
    await expect(page.locator('.todo-text')).toHaveText('Persistent task');
    await expect(page.locator('.todo-text')).toHaveClass(/completed/);
  });

  test('allows duplicate task text', async ({ page }) => {
    await page.fill('#todoInput', 'Duplicate');
    await page.click('#addBtn');
    await page.fill('#todoInput', 'Duplicate');
    await page.click('#addBtn');

    await expect(page.locator('.todo-item')).toHaveCount(2);
    await expect(page.locator('.todo-text')).toHaveText(['Duplicate', 'Duplicate']);
  });
});
