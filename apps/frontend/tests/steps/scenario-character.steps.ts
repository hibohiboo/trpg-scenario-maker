import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { CustomWorld } from './common.steps';

// Background: テスト用のシナリオを作成
Given(
  'テスト用のシナリオ {string} が存在する',
  async function (this: CustomWorld, scenarioTitle: string) {
    // ナビゲーションでシナリオ一覧へ移動
    await this.page.getByRole('link', { name: 'シナリオ一覧' }).click();
    await this.page.waitForLoadState('networkidle');

    // 新規作成ボタンをクリック
    await this.page.getByRole('button', { name: '新規作成' }).click();

    // シナリオタイトルを入力
    await this.page
      .getByPlaceholder('タイトルを入力')
      .or(this.page.getByLabel('タイトル'))
      .fill(scenarioTitle);

    // 作成ボタンをクリック
    await this.page
      .locator('[role="dialog"]')
      .getByRole('button', { name: '作成' })
      .click();

    // シナリオが作成されたことを確認
    await expect(this.page.getByText(scenarioTitle)).toBeVisible();
  },
);

// シナリオの詳細ページを開く
When(
  'シナリオ {string} の詳細ページを開く',
  async function (this: CustomWorld, scenarioTitle: string) {
    // シナリオ一覧へ移動（すでにいる場合はスキップされる）
    const currentUrl = this.page.url();
    if (!currentUrl.includes('scenarios')) {
      await this.page.getByRole('link', { name: 'シナリオ一覧' }).click();
      await this.page.waitForLoadState('networkidle');
    }

    // シナリオをクリック
    await this.page.getByText(scenarioTitle).click();
    await this.page.waitForLoadState('networkidle');
  },
);

// セクションを表示する
When(
  '{string} セクションを表示する',
  async function (this: CustomWorld, sectionName: string) {
    // ローディングが完了するまで待つ
    await this.page.waitForLoadState('networkidle');

    // セクションが表示されることを確認
    await expect(
      this.page.getByText(sectionName, { exact: true }),
    ).toBeVisible();
  },
);
When(
  'シナリオ編集ページの {string} のタブをクリックする',
  async function (this: CustomWorld, name) {
    await this.page
      .getByRole('listitem')
      .getByText(name, { exact: true })
      .click();
  },
);
// モーダルでキャラクター情報を入力する
When(
  'モーダルで {string} [説明: {string}, 役割: {string} ] を入力する',
  async function (
    this: CustomWorld,
    name: string,
    description: string,
    role: string,
  ) {
    // モーダルが開くのを待つ
    const modal = this.page.locator('[role="dialog"]');
    await modal.waitFor({ state: 'visible', timeout: 5000 });

    // 各フィールドに入力
    await modal.getByLabel('キャラクター名').fill(name);
    await modal.getByLabel('キャラクター説明').fill(description);
    await modal.getByLabel('役割').fill(role);
  },
);

// モーダルでキャラクター名を変更する
When(
  'キャラクター名を {string} に変更する',
  async function (this: CustomWorld, newName: string) {
    const modal = this.page.locator('[role="dialog"]');
    await modal.getByLabel('キャラクター名').fill(newName);
  },
);

// モーダルでキャラクター説明を変更する
When(
  'キャラクター説明を {string} に変更する',
  async function (this: CustomWorld, newDescription: string) {
    const modal = this.page.locator('[role="dialog"]');
    await modal.getByLabel('キャラクター説明').fill(newDescription);
  },
);

// モーダルで役割を変更する
When(
  '役割を {string} に変更する',
  async function (this: CustomWorld, newRole: string) {
    const modal = this.page.locator('[role="dialog"]');
    await modal.getByLabel('役割').fill(newRole);
  },
);

// 削除確認ダイアログでOKを選択する準備
When(
  '削除確認ダイアログで {string} を選択する準備をする',
  async function (this: CustomWorld, _choice: string) {
    // window.confirmのモックを設定（常にtrueを返す）
    await this.page.evaluate(() => {
      window.confirm = (() => true) as typeof confirm;
    });
  },
);

// 登場キャラクター一覧に表示される
Then(
  '登場キャラクター一覧に {string} \\(役割: {string}\\) が表示される',
  async function (this: CustomWorld, characterName: string, role: string) {
    // キャラクター名と役割が表示されることを確認
    const characterRow = this.page
      .locator('.scenario-character-item')
      .filter({ hasText: characterName });
    await expect(characterRow).toBeVisible();
    await expect(characterRow.getByText(role)).toBeVisible();
  },
);

// 登場キャラクターの編集ボタンをクリック
When(
  '登場キャラクター {string} の編集ボタンをクリックする',
  async function (this: CustomWorld, characterName: string) {
    const characterRow = this.page
      .locator('.scenario-character-item')
      .filter({ hasText: characterName });
    await characterRow.getByRole('button', { name: '編集' }).click();
  },
);

// 登場キャラクターの削除ボタンをクリック
When(
  '登場キャラクター {string} の削除ボタンをクリックする',
  async function (this: CustomWorld, characterName: string) {
    const characterRow = this.page
      .locator('.scenario-character-item')
      .filter({ hasText: characterName });
    await characterRow.getByRole('button', { name: '削除' }).click();
  },
);

// 登場キャラクター一覧に表示されない
Then(
  '登場キャラクター一覧に {string} が表示されない',
  async function (this: CustomWorld, characterName: string) {
    const characterRow = this.page
      .locator('.scenario-character-item')
      .filter({ hasText: characterName });
    await expect(characterRow).not.toBeVisible();
  },
);

// Given: シナリオにキャラクターが登録されている
Given(
  'シナリオ {string} にキャラクター {string} \\(役割: {string}\\) が登録されている',
  async function (
    this: CustomWorld,
    scenarioTitle: string,
    characterName: string,
    role: string,
  ) {
    // シナリオの詳細ページを開く
    await this.page.getByRole('link', { name: 'シナリオ一覧' }).click();
    await this.page.waitForLoadState('networkidle');
    await this.page.getByText(scenarioTitle).click();
    await this.page.waitForLoadState('networkidle');
    await this.page
      .getByRole('listitem')
      .getByText('キャラクター', { exact: true })
      .click();
    // キャラクターを作成ボタンをクリック
    await this.page.getByRole('button', { name: 'キャラクターを作成' }).click();

    // モーダルが開くのを待つ
    const modal = this.page.locator('[role="dialog"]');
    await modal.waitFor({ state: 'visible', timeout: 5000 });

    // 各フィールドに入力
    await modal.getByLabel('キャラクター名').fill(characterName);
    await modal.getByLabel('キャラクター説明').fill(`${characterName}の説明`);
    await modal.getByLabel('役割').fill(role);

    // 作成ボタンをクリック
    await modal.getByRole('button', { name: '作成' }).click();

    // モーダルが閉じるのを待つ
    await modal.waitFor({ state: 'hidden', timeout: 1000 });
  },
);

// Given: シナリオに関係性が登録されている
Given(
  'シナリオ {string} に関係性 {string} から {string} への {string} が登録されている',
  async function (
    this: CustomWorld,
    scenarioTitle: string,
    fromChar: string,
    toChar: string,
    relationshipName: string,
  ) {
    // シナリオの詳細ページを開く
    await this.page.getByRole('link', { name: 'シナリオ一覧' }).click();
    await this.page.waitForLoadState('networkidle');
    await this.page.getByText(scenarioTitle).click();
    await this.page.waitForLoadState('networkidle');

    // 関係性を追加ボタンをクリック
    await this.page.getByRole('button', { name: '関係性を追加' }).click();

    // 関係元と関係先を選択、関係名を入力
    const selects = await this.page.locator('select').all();
    await selects[0].selectOption({ label: fromChar });
    await selects[1].selectOption({ label: toChar });
    await this.page
      .getByPlaceholder('関係名を入力')
      .or(this.page.getByLabel('関係名'))
      .fill(relationshipName);

    // 追加ボタンをクリック
    await this.page
      .locator('[role="dialog"]')
      .getByRole('button', { name: '追加' })
      .click();
  },
);

// Given: シナリオに既存キャラクターを追加している
Given(
  'シナリオ {string} に既存キャラクター {string} \\(役割: {string}\\) を追加している',
  async function (
    this: CustomWorld,
    scenarioTitle: string,
    characterName: string,
    role: string,
  ) {
    // シナリオの詳細ページを開く
    await this.page.getByRole('link', { name: 'シナリオ一覧' }).click();
    await this.page.waitForLoadState('networkidle');
    await this.page.getByText(scenarioTitle).click();
    await this.page.waitForLoadState('networkidle');

    // 既存から追加ボタンをクリック
    await this.page.getByRole('button', { name: '既存から追加' }).click();

    // キャラクターを選択
    await this.page
      .locator('select')
      .first()
      .selectOption({ label: characterName });

    // 役割を入力
    await this.page
      .getByPlaceholder('役割を入力')
      .or(this.page.getByLabel('役割'))
      .fill(role);

    // 追加ボタンをクリック
    await this.page
      .locator('[role="dialog"]')
      .getByRole('button', { name: '追加' })
      .click();
  },
);

// Then: シナリオの関係性に表示される
Then(
  'シナリオ {string} の関係性に {string} から {string} への {string} が表示される',
  async function (
    this: CustomWorld,
    scenarioTitle: string,
    fromChar: string,
    toChar: string,
    relationshipName: string,
  ) {
    // 現在のページがシナリオ詳細ページでない場合は移動
    const currentUrl = this.page.url();
    if (!currentUrl.includes('scenario')) {
      await this.page.getByRole('link', { name: 'シナリオ一覧' }).click();
      await this.page.waitForLoadState('networkidle');
      await this.page.getByText(scenarioTitle).click();
      await this.page.waitForLoadState('networkidle');
    }

    // 関係性が表示されることを確認
    const relationshipPattern = new RegExp(
      `${fromChar}.*→.*${relationshipName}.*→.*${toChar}`,
    );
    const relationshipRow = this.page
      .locator('.scenario-character-relation-item')
      .filter({ hasText: relationshipPattern });
    await expect(relationshipRow.first()).toBeVisible();
  },
);
