import { When, Then } from '@cucumber/cucumber';
import { Page, expect } from '@playwright/test';
import type { CustomWorld } from './common.steps';

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
  'シーン説明に {string} と入力する',
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
  },
);
const sceneListContainer = (page: Page) =>
  page.getByText('シーン一覧').locator('..');

When(
  'シーン {string} の編集ボタンをクリックする',
  async function (this: CustomWorld, sceneTitle: string) {
    const container = sceneListContainer(this.page);
    const sceneRow = container
      .getByText(sceneTitle)
      .locator('..')
      .locator('..');
    await sceneRow.getByRole('button', { name: '編集' }).click();
  },
);

Then(
  'シーン一覧に {string} が表示される',
  async function (this: CustomWorld, sceneTitle: string) {
    const container = sceneListContainer(this.page);
    await expect(container.getByText(sceneTitle)).toBeVisible();
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
  },
);

Then(
  'イベント一覧に {string} が表示される',
  async function (this: CustomWorld, content: string) {
    const container = this.page
      .getByText('シーンを編集')
      .locator('..')
      .locator('..');
    await expect(container.getByText(content)).toBeVisible();
  },
);

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
