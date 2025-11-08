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

// 情報項目をクリックする（編集ボタンをクリックしてモーダルを開く）
When(
  '情報項目 {string} をクリックする',
  async function (this: CustomWorld, itemTitle: string) {
    // 情報項目のカードを見つけて編集ボタンをクリック
    const itemCard = this.page
      .locator('div')
      .filter({ hasText: itemTitle })
      .first();
    await itemCard.getByRole('button', { name: '編集' }).first().click();

    // モーダルが開くまで待つ
    const modal = this.page.locator('[role="dialog"]');
    await modal.waitFor({ state: 'visible', timeout: 5000 });

    // モーダルのタイトルが表示されるまで待つ
    await modal.getByText('情報項目を編集').waitFor({ state: 'visible', timeout: 5000 });
  },
);

// 情報項目の削除ボタンをクリック
When(
  '情報項目 {string} の削除ボタンをクリックする',
  async function (this: CustomWorld, itemTitle: string) {
    // 情報項目のカードを見つけて編集ボタンをクリック
    const itemCard = this.page
      .locator('div')
      .filter({ hasText: itemTitle })
      .first();
    await itemCard.getByRole('button', { name: '編集' }).first().click();

    // モーダルが開くまで待つ
    const modal = this.page.locator('[role="dialog"]');
    await modal.waitFor({ state: 'visible', timeout: 5000 });

    // window.confirmのモックを設定（常にtrueを返す）
    await this.page.evaluate(() => {
      window.confirm = (() => true) as typeof confirm;
    });

    // モーダル内の削除ボタンをクリック
    await modal.getByRole('button', { name: '削除' }).click();

    // モーダルが閉じるまで待つ
    await modal.waitFor({ state: 'detached', timeout: 5000 });
  },
);

// 情報項目一覧に表示されない
Then(
  '情報項目一覧に {string} が表示されない',
  async function (this: CustomWorld, itemTitle: string) {
    // 該当する見出し要素が存在しないことを確認
    const headings = this.page.getByRole('heading', { name: itemTitle });
    await expect(headings).toHaveCount(0);
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

    // モーダルが開くまで待つ
    const modal = this.page.locator('[role="dialog"]');
    await modal.waitFor({ state: 'visible', timeout: 5000 });

    // タイトルと説明を入力
    await modal.getByLabel('タイトル').fill(itemTitle);
    await modal.getByLabel('説明').fill(`${itemTitle}の説明`);

    // 作成ボタンをクリック
    await modal.getByRole('button', { name: '作成', exact: true }).click();

    // モーダルが閉じるまで待つ
    await modal.waitFor({ state: 'detached', timeout: 5000 });
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

    // モーダルが開くまで待つ
    const modal = this.page.locator('[role="dialog"]');
    await modal.waitFor({ state: 'visible', timeout: 5000 });

    // タイトルと説明を入力
    await modal.getByLabel('タイトル').fill(itemTitle);
    await modal.getByLabel('説明').fill(description);

    // 作成ボタンをクリック
    await modal.getByRole('button', { name: '作成', exact: true }).click();

    // モーダルが閉じるまで待つ
    await modal.waitFor({ state: 'detached', timeout: 5000 });
  },
);

// When: 関連を追加ボタンをクリック
When(
  '情報項目の関連を追加ボタンをクリックする',
  async function (this: CustomWorld) {
    await this.page.getByRole('button', { name: '関連を追加' }).click();
  },
);

// When: モーダルで関連元と関連先を選択
When(
  'モーダルで関連元 {string} と関連先 {string} を選択する',
  async function (this: CustomWorld, sourceItem: string, targetItem: string) {
    // モーダルが開くのを待つ
    const modal = this.page.locator('[role="dialog"]');
    await modal.waitFor({ state: 'visible', timeout: 5000 });

    // 関連元と関連先を選択
    const selects = await modal.locator('select').all();
    await selects[0].selectOption({ label: sourceItem });
    await selects[1].selectOption({ label: targetItem });
  },
);

// Then: 情報項目の関連一覧に表示される
Then(
  '情報項目の関連一覧に {string} から {string} への関連が表示される',
  async function (this: CustomWorld, sourceItem: string, targetItem: string) {
    // 関連が表示されることを確認
    const relationshipPattern = new RegExp(`${sourceItem}.*→.*${targetItem}`);
    const relationshipRow = this.page
      .locator('.information-item-connection-item')
      .filter({ hasText: relationshipPattern });
    await expect(relationshipRow.first()).toBeVisible();
  },
);

// Given: シナリオにシーンが登録されている
Given(
  'シナリオ {string} にシーン {string} が登録されている',
  async function (
    this: CustomWorld,
    scenarioTitle: string,
    sceneTitle: string,
  ) {
    // シナリオの詳細ページを開く
    await this.page.getByRole('link', { name: 'シナリオ一覧' }).click();
    await this.page.waitForLoadState('networkidle');
    await this.page.getByText(scenarioTitle).click();
    await this.page.waitForLoadState('networkidle');

    // シーンタブをクリック
    await this.page
      .getByRole('listitem')
      .getByText('シーン', { exact: true })
      .click();

    // シーンを追加ボタンをクリック
    await this.page.getByRole('button', { name: 'シーンを追加' }).click();

    // シーン情報を入力
    await this.page.locator('#scene-title').fill(sceneTitle);
    await this.page.locator('#scene-description').fill(`${sceneTitle}の説明`);

    // 作成ボタンをクリック
    await this.page
      .locator('.bg-white')
      .getByRole('button', { name: '作成' })
      .click();
  },
);

// When: 指し示すシーンセクションでシーンを選択
When(
  '"指し示すシーン" セクションで {string} を選択する',
  async function (this: CustomWorld, sceneTitle: string) {
    // モーダル内の指し示すシーンセクションのselectを見つける
    const modal = this.page.locator('[role="dialog"]');
    const select = modal
      .locator('select')
      .filter({ hasText: 'シーンを選択' });
    await select.selectOption({ label: sceneTitle });
  },
);

// Then: 情報項目が指し示すシーンに表示される
Then(
  '情報項目 {string} が指し示すシーンに {string} が表示される',
  async function (this: CustomWorld, _itemTitle: string, sceneTitle: string) {
    // モーダル内の指し示すシーンの一覧にシーンが表示されることを確認
    const modal = this.page.locator('[role="dialog"]');
    const sceneRow = modal
      .locator('.information-to-scene-connection-item')
      .filter({ hasText: sceneTitle });
    await expect(sceneRow).toBeVisible();
  },
);

// When: シーンを編集する
When(
  'シーン {string} を編集する',
  async function (this: CustomWorld, sceneTitle: string) {
    // シーン一覧からシーンを見つけて編集ボタンをクリック
    const sceneCard = this.page
      .locator('div')
      .filter({ hasText: sceneTitle })
      .first();
    await sceneCard.getByRole('button', { name: '編集' }).first().click();
    // モーダルが開くまで少し待つ
    await this.page.waitForTimeout(1000);
  },
);

// When: 獲得できる情報セクションで情報項目を選択
When(
  '"獲得できる情報" セクションで {string} を選択する',
  async function (this: CustomWorld, itemTitle: string) {
    // 獲得できる情報セクションのselectを見つける
    const modal = this.page.locator('[role="dialog"]');
    const section = modal.locator('text=獲得できる情報').locator('..');
    const select = section.locator('select');
    await select.selectOption({ label: itemTitle });
    // 選択が反映されるまで少し待つ
    await this.page.waitForTimeout(1000);
  },
);

// Then: シーンの獲得情報に表示される
Then(
  'シーン {string} の獲得情報に {string} が表示される',
  async function (this: CustomWorld, _sceneTitle: string, itemTitle: string) {
    // 獲得できる情報の一覧に情報項目が表示されることを確認
    const modal = this.page.locator('[role="dialog"]');
    const itemRow = modal
      .locator('.scene-information-item')
      .filter({ hasText: itemTitle })
      .first();
    await expect(itemRow).toBeVisible();
  },
);
