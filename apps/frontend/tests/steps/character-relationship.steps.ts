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

// ナビゲーション
When(
  'ナビゲーションで {string} をクリックする',
  async function (this: CustomWorld, linkText: string) {
    await this.page.getByRole('link', { name: linkText }).click();
    await this.page.waitForLoadState('networkidle');
  },
);

Then('キャラクター一覧が表示される', async function (this: CustomWorld) {
  await expect(
    this.page.getByText('キャラクター一覧').or(this.page.getByText('キャラクター')),
  ).toBeVisible();
});

// 関係性の作成
When(
  '{string} ボタンをクリックする',
  async function (this: CustomWorld, buttonText: string) {
    await this.page.getByRole('button', { name: buttonText }).click();
  },
);

When(
  '関係元キャラクターで {string} を選択する',
  async function (this: CustomWorld, characterName: string) {
    const selects = await this.page.locator('select').all();
    await selects[0].selectOption({ label: characterName });
  },
);

When(
  '関係先キャラクターで {string} を選択する',
  async function (this: CustomWorld, characterName: string) {
    const selects = await this.page.locator('select').all();
    await selects[1].selectOption({ label: characterName });
  },
);

When(
  '関係名に {string} と入力する',
  async function (this: CustomWorld, relationshipName: string) {
    await this.page
      .getByPlaceholder('関係名を入力')
      .or(this.page.getByLabel('関係名'))
      .fill(relationshipName);
  },
);

When(
  '作成フォームの {string} ボタンをクリックする',
  async function (this: CustomWorld, buttonText: string) {
    await this.page
      .locator('[role="dialog"]')
      .getByRole('button', { name: buttonText })
      .click();
  },
);

Then(
  '関係性一覧に {string} が表示される',
  async function (this: CustomWorld, relationshipText: string) {
    await expect(this.page.getByText(relationshipText)).toBeVisible();
  },
);

// 関係性の編集
When(
  '関係性 {string} の編集ボタンをクリックする',
  async function (this: CustomWorld, relationshipText: string) {
    const row = this.page.getByText(relationshipText).locator('..');
    await row.getByRole('button', { name: '編集' }).click();
  },
);

When(
  '関係名を {string} に変更する',
  async function (this: CustomWorld, newName: string) {
    const input = this.page
      .getByPlaceholder('関係名を入力')
      .or(this.page.getByLabel('関係名'));
    await input.clear();
    await input.fill(newName);
  },
);

When(
  '編集フォームの {string} ボタンをクリックする',
  async function (this: CustomWorld, buttonText: string) {
    await this.page
      .locator('[role="dialog"]')
      .getByRole('button', { name: buttonText })
      .click();
  },
);

// 関係性の削除
When(
  '関係性 {string} の削除ボタンをクリックする',
  async function (this: CustomWorld, relationshipText: string) {
    const row = this.page.getByText(relationshipText).locator('..');
    await row.getByRole('button', { name: '削除' }).click();
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

Then(
  '関係性一覧に {string} が表示されない',
  async function (this: CustomWorld, relationshipText: string) {
    await expect(this.page.getByText(relationshipText)).not.toBeVisible();
  },
);
