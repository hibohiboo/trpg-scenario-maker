import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { CustomWorld } from './common.steps';
import type { Locator } from '@playwright/test';

/**
 * 関係性の表示要素を取得するヘルパー関数
 * @param world CustomWorld
 * @param fromChar 関係元キャラクター名
 * @param relationshipName 関係性名
 * @param toChar 関係先キャラクター名
 * @returns 関係性の表示要素のLocator
 */
function getRelationshipRow(
  world: CustomWorld,
  fromChar: string,
  relationshipName: string,
  toChar: string,
): Locator {
  const relationshipPattern = new RegExp(
    `${fromChar}.*→.*${relationshipName}.*→.*${toChar}`,
  );

  return world.page
    .locator('div.character-relation-item')
    .filter({ hasText: relationshipPattern });
}

Then('キャラクター一覧が表示される', async function (this: CustomWorld) {
  await expect(
    this.page
      .getByText('キャラクター一覧')
      .or(this.page.getByText('キャラクター')),
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

Then(
  'キャラクター一覧に {string} が表示される',
  async function (this: CustomWorld, characterName: string) {
    await expect(
      this.page.getByText(characterName, { exact: true }),
    ).toBeVisible();
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

Then(
  '関係性 {string} から {string} への {string} が表示される',
  async function (
    this: CustomWorld,
    fromChar: string,
    toChar: string,
    relationshipName: string,
  ) {
    const row = getRelationshipRow(this, fromChar, relationshipName, toChar);
    await expect(row.first()).toBeVisible();
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
    const row = getRelationshipRow(this, fromChar, relationshipName, toChar);
    await row.first().getByRole('button', { name: '編集' }).click();
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

// 関係性の削除
When(
  '関係性 {string} から {string} への {string} の削除ボタンをクリックする',
  async function (
    this: CustomWorld,
    fromChar: string,
    toChar: string,
    relationshipName: string,
  ) {
    const row = getRelationshipRow(this, fromChar, relationshipName, toChar);
    await row.first().getByRole('button', { name: '削除' }).click();
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
    const row = getRelationshipRow(this, fromChar, relationshipName, toChar);
    await expect(row).not.toBeVisible();
  },
);
