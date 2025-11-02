import {
  Given,
  When,
  Before,
  After,
  setDefaultTimeout,
  setWorldConstructor,
} from '@cucumber/cucumber';
import { chromium, expect, Page } from '@playwright/test';

export interface CustomWorld {
  page: Page;
  init: () => Promise<void>;
}

setDefaultTimeout(10000);

function setupCustomWorld() {
  setWorldConstructor(function (this: CustomWorld) {
    this.init = async () => {
      const browser = await chromium.launch({ headless: false });
      const context = await browser.newContext();
      this.page = await context.newPage();
    };
  });
}
setupCustomWorld();

Before(async function (this: CustomWorld) {
  await this.init();
});

After(async function (this: CustomWorld) {
  await this.page.close();
});

// 基本操作
Given('アプリケーションを開いている', async function (this: CustomWorld) {
  await this.page.goto('http://localhost:5173');
  await this.page.waitForLoadState('networkidle');
});

When(
  '{string} ボタンをクリックする',
  async function (this: CustomWorld, buttonText: string) {
    await this.page
      .getByRole('button', { name: buttonText, exact: true })
      .click();
  },
);

// モーダル操作
When('モーダルを閉じる', async function (this: CustomWorld) {
  await this.page.getByRole('button', { name: '閉じる' }).click();
});

When(
  'モーダルの {string} ボタンをクリックする',
  async function (this: CustomWorld, buttonText: string) {
    const modal = this.page.locator('[role="dialog"]');
    await expect(modal.getByRole('button', { name: buttonText })).toBeVisible();
    await modal.getByRole('button', { name: buttonText }).click();
    // モーダルが閉じるまで待つ
    await modal.waitFor({ state: 'hidden', timeout: 500 });
  },
);

When(
  '削除確認モーダルで {string} ボタンをクリックする',
  async function (this: CustomWorld, buttonText: string) {
    await this.page
      .locator('[role="dialog"]')
      .getByRole('button', { name: buttonText })
      .click();
  },
);

// ナビゲーション
When(
  'ナビゲーションで {string} をクリックする',
  async function (this: CustomWorld, linkText: string) {
    await this.page.getByRole('link', { name: linkText }).click();
    await this.page.waitForLoadState('networkidle');
  },
);
