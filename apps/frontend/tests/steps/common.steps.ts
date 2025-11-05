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
      const browser = await chromium.launch({ headless: true });
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
      .first()
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
    await modal.waitFor({ state: 'hidden', timeout: 1000 });
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

// フォーム入力（汎用）
When(
  '説明に {string} と入力する',
  async function (this: CustomWorld, description: string) {
    await this.page.getByLabel('説明').fill(description);
  },
);

When(
  'タイトルを {string} に変更する',
  async function (this: CustomWorld, newTitle: string) {
    const titleInput = this.page.getByLabel('タイトル');
    await titleInput.clear();
    await titleInput.fill(newTitle);
  },
);

When(
  '説明を {string} に変更する',
  async function (this: CustomWorld, newDescription: string) {
    const descriptionInput = this.page.getByLabel('説明');
    await descriptionInput.clear();
    await descriptionInput.fill(newDescription);
  },
);

// フォーム送信（汎用）
When(
  'フォームの {string} ボタンをクリックする',
  async function (this: CustomWorld, buttonText: string) {
    await this.page
      .getByRole('button', { name: buttonText, exact: true })
      .click();
    // フォームの送信処理が完了するまで少し待つ
    await this.page.waitForTimeout(50);
  },
);
