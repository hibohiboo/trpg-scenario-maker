/* eslint-disable func-names */
import {
  Given,
  When,
  Then,
  Before,
  After,
  setDefaultTimeout,
  setWorldConstructor,
} from '@cucumber/cucumber';
import { chromium, Page, expect } from '@playwright/test';

interface CustomWorld {
  page: Page;
  init: () => Promise<void>;
}
setDefaultTimeout(20000);
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

When(
  'タイトルに {string} と入力する',
  async function (this: CustomWorld, title: string) {
    await this.page.getByLabel('タイトル').fill(title);
  },
);

Then(
  'シナリオ一覧に {string} が表示される',
  async function (this: CustomWorld, title: string) {
    await expect(this.page.getByText(title)).toBeVisible();
  },
);
