import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { CustomWorld } from './common.steps';

// 情報項目一覧に表示される
Then(
  '情報項目一覧に {string} が表示される',
  async function (this: CustomWorld, itemTitle: string) {
    await expect(this.page.getByText(itemTitle)).toBeVisible();
  },
);

// 情報項目をクリックする（編集ボタンをクリック）
When(
  '情報項目 {string} をクリックする',
  async function (this: CustomWorld, itemTitle: string) {
    // 情報項目のカードを見つけて編集ボタンをクリック
    const itemCard = this.page
      .locator('div')
      .filter({ hasText: itemTitle })
      .first();
    await itemCard.getByRole('button', { name: '編集' }).first().click();
    // フォームが開くまで少し待つ
    await this.page.waitForTimeout(300);
  },
);

// 情報項目の削除ボタンをクリック
When(
  '情報項目 {string} の削除ボタンをクリックする',
  async function (this: CustomWorld, itemTitle: string) {
    // window.confirmのモックを設定（常にtrueを返す）
    await this.page.evaluate(() => {
      window.confirm = (() => true) as typeof confirm;
    });

    // 情報項目のカードを見つけて削除ボタンをクリック
    const itemCard = this.page
      .locator('div')
      .filter({ hasText: itemTitle })
      .first();
    await itemCard.getByRole('button', { name: '削除' }).click();
    // 削除処理が完了するまで少し待つ
    await this.page.waitForTimeout(500);
  },
);

// 情報項目一覧に表示されない
Then(
  '情報項目一覧に {string} が表示されない',
  async function (this: CustomWorld, itemTitle: string) {
    await expect(this.page.getByText(itemTitle)).not.toBeVisible();
  },
);

// Given: シナリオに情報項目が登録されている（シンプル版）
Given(
  'シナリオ {string} に情報項目 {string} が登録されている',
  async function (this: CustomWorld, scenarioTitle: string, itemTitle: string) {
    // シナリオの詳細ページを開く
    await this.page.getByRole('link', { name: 'シナリオ一覧' }).click();
    await this.page.waitForLoadState('networkidle');
    await this.page.getByText(scenarioTitle, { exact: true }).click();
    await this.page.waitForLoadState('networkidle');

    // 情報項目タブをクリック
    await this.page
      .getByRole('listitem')
      .getByText('情報項目', { exact: true })
      .click();

    // 新規作成ボタンをクリック
    await this.page.getByRole('button', { name: '新規作成' }).click();

    // タイトルと説明を入力
    await this.page.getByLabel('タイトル').fill(itemTitle);
    await this.page.getByLabel('説明').fill(`${itemTitle}の説明`);

    // 作成ボタンをクリック
    await this.page.getByRole('button', { name: '作成', exact: true }).click();
  },
);

// Given: シナリオに情報項目が説明付きで登録されている
Given(
  'シナリオ {string} に情報項目 {string} \\(説明: {string}\\) が登録されている',
  async function (
    this: CustomWorld,
    scenarioTitle: string,
    itemTitle: string,
    description: string,
  ) {
    // シナリオの詳細ページを開く
    await this.page.getByRole('link', { name: 'シナリオ一覧' }).click();
    await this.page.waitForLoadState('networkidle');
    await this.page.getByText(scenarioTitle).click();
    await this.page.waitForLoadState('networkidle');

    // 情報項目タブをクリック
    await this.page
      .getByRole('listitem')
      .getByText('情報項目', { exact: true })
      .click();

    // 新規作成ボタンをクリック
    await this.page.getByRole('button', { name: '新規作成' }).click();

    // タイトルと説明を入力
    await this.page.getByLabel('タイトル').fill(itemTitle);
    await this.page.getByLabel('説明').fill(description);

    // 作成ボタンをクリック
    await this.page.getByRole('button', { name: '作成', exact: true }).click();
  },
);
