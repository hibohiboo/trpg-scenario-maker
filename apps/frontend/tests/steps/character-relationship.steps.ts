import { When, Then } from '@cucumber/cucumber';
import { Page, expect } from '@playwright/test';

interface CustomWorld {
  page: Page;
}

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

// キャラクター作成
When(
  'キャラクター名に {string} と入力する',
  async function (this: CustomWorld, name: string) {
    await this.page
      .getByPlaceholder('名前を入力')
      .or(this.page.getByLabel('名前'))
      .fill(name);
  },
);

When(
  'キャラクター説明に {string} と入力する',
  async function (this: CustomWorld, description: string) {
    await this.page
      .getByPlaceholder('説明を入力')
      .or(this.page.getByLabel('説明'))
      .fill(description);
  },
);

When(
  'モーダルの {string} ボタンをクリックする',
  async function (this: CustomWorld, buttonText: string) {
    await this.page
      .locator('[role="dialog"]')
      .getByRole('button', { name: buttonText })
      .click();
  },
);

Then(
  'キャラクター一覧に {string} が表示される',
  async function (this: CustomWorld, characterName: string) {
    await expect(this.page.getByText(characterName)).toBeVisible();
  },
);

// 関係性の作成
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
  '関係性 {string} から {string} への {string} が表示される',
  async function (
    this: CustomWorld,
    fromChar: string,
    toChar: string,
    relationshipName: string,
  ) {
    // 3つのテキストすべてが同じ行に含まれることを確認
    const row = this.page
      .locator('div')
      .filter({ hasText: fromChar })
      .filter({ hasText: toChar })
      .filter({ hasText: relationshipName })
      .first();
    await expect(row).toBeVisible();
  },
);

// 関係性の編集
When(
  '関係性 {string} から {string} への {string} の編集ボタンをクリックする',
  async function (
    this: CustomWorld,
    fromChar: string,
    toChar: string,
    relationshipName: string,
  ) {
    const row = this.page
      .locator('div')
      .filter({ hasText: fromChar })
      .filter({ hasText: toChar })
      .filter({ hasText: relationshipName })
      .first();
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
  '関係性 {string} から {string} への {string} の削除ボタンをクリックする',
  async function (
    this: CustomWorld,
    fromChar: string,
    toChar: string,
    relationshipName: string,
  ) {
    const row = this.page
      .locator('div')
      .filter({ hasText: fromChar })
      .filter({ hasText: toChar })
      .filter({ hasText: relationshipName })
      .first();
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
  '関係性 {string} から {string} への {string} が表示されない',
  async function (
    this: CustomWorld,
    fromChar: string,
    toChar: string,
    relationshipName: string,
  ) {
    const row = this.page
      .locator('div')
      .filter({ hasText: fromChar })
      .filter({ hasText: toChar })
      .filter({ hasText: relationshipName });
    await expect(row).not.toBeVisible();
  },
);
