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
    await this.page.waitForTimeout(500);
  },
);

// シナリオ関連
When(
  'タイトルに {string} と入力する',
  async function (this: CustomWorld, title: string) {
    await this.page.getByLabel('タイトル').fill(title);
  },
);

When(
  'シナリオ {string} をクリックする',
  async function (this: CustomWorld, scenarioTitle: string) {
    await this.page.getByText(scenarioTitle).first().click();
    await this.page.waitForTimeout(1000);
  },
);

Then(
  'シナリオ一覧に {string} が表示される',
  async function (this: CustomWorld, title: string) {
    await expect(this.page.getByText(title)).toBeVisible();
  },
);

Then('シーン編集画面が表示される', async function (this: CustomWorld) {
  await expect(this.page.getByText('シーン編集')).toBeVisible();
});

// シーン関連
When(
  'シーンタイトルに {string} と入力する',
  async function (this: CustomWorld, title: string) {
    await this.page.locator('#scene-title').fill(title);
  },
);

When(
  '説明に {string} と入力する',
  async function (this: CustomWorld, description: string) {
    await this.page.locator('#scene-description').fill(description);
  },
);

When(
  'フォームの {string} ボタンをクリックする',
  async function (this: CustomWorld, buttonText: string) {
    await this.page
      .locator('.bg-white')
      .getByRole('button', { name: buttonText })
      .click();
    await this.page.waitForTimeout(500);
  },
);

When(
  'シーン {string} の編集ボタンをクリックする',
  async function (this: CustomWorld, sceneTitle: string) {
    const sceneRow = this.page
      .locator('div')
      .filter({ hasText: sceneTitle })
      .first();
    await sceneRow.getByRole('button', { name: '編集' }).click();
    await this.page.waitForTimeout(500);
  },
);

Then(
  'シーン一覧に {string} が表示される',
  async function (this: CustomWorld, sceneTitle: string) {
    await expect(this.page.getByText(sceneTitle)).toBeVisible();
  },
);

// タブ操作
When(
  '{string} タブをクリックする',
  async function (this: CustomWorld, tabName: string) {
    await this.page.getByRole('tab', { name: tabName }).click();
    await this.page.waitForTimeout(500);
  },
);

// シーンイベント関連
When(
  'イベントタイプで {string} を選択する',
  async function (this: CustomWorld, eventType: string) {
    await this.page.locator('#event-type').selectOption({ label: eventType });
  },
);

When(
  'イベント内容に {string} と入力する',
  async function (this: CustomWorld, content: string) {
    await this.page.locator('#event-content').fill(content);
  },
);

When(
  'イベントフォームの {string} ボタンをクリックする',
  async function (this: CustomWorld, buttonText: string) {
    await this.page.getByRole('button', { name: buttonText }).last().click();
    await this.page.waitForTimeout(500);
  },
);

Then(
  'イベント一覧に {string} が表示される',
  async function (this: CustomWorld, content: string) {
    await expect(this.page.getByText(content)).toBeVisible();
  },
);

// モーダル操作
When('モーダルを閉じる', async function (this: CustomWorld) {
  await this.page.getByRole('button', { name: '✕' }).click();
  await this.page.waitForTimeout(500);
});

// シーン接続関連
When(
  '次のシーンで {string} を選択する',
  async function (this: CustomWorld, sceneTitle: string) {
    await this.page
      .locator('select')
      .filter({ hasText: '次のシーンを選択' })
      .selectOption({ label: sceneTitle });
  },
);

Then(
  'シーン接続一覧に {string} が表示される',
  async function (this: CustomWorld, sceneTitle: string) {
    await expect(this.page.getByText(sceneTitle)).toBeVisible();
  },
);
