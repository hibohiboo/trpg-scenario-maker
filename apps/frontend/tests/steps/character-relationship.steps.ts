import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { CustomWorld } from './common.steps';

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

Then(
  '関係性 {string} から {string} への {string} が表示される',
  async function (
    this: CustomWorld,
    fromChar: string,
    toChar: string,
    relationshipName: string,
  ) {
    // より具体的なパターンでマッチング: "fromChar → relationshipName → toChar"
    const relationshipPattern = new RegExp(
      `${fromChar}.*→.*${relationshipName}.*→.*${toChar}`,
    );

    const row = this.page
      .locator('div.p-4.border.rounded-lg')
      .filter({ hasText: relationshipPattern });

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
    // より具体的なパターンでマッチング: "fromChar → relationshipName → toChar"
    const relationshipPattern = new RegExp(
      `${fromChar}.*→.*${relationshipName}.*→.*${toChar}`,
    );

    const row = this.page
      .locator('div.p-4.border.rounded-lg')
      .filter({ hasText: relationshipPattern })
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

// 関係性の削除
When(
  '関係性 {string} から {string} への {string} の削除ボタンをクリックする',
  async function (
    this: CustomWorld,
    fromChar: string,
    toChar: string,
    relationshipName: string,
  ) {
    // より具体的なパターンでマッチング: "fromChar → relationshipName → toChar"
    const relationshipPattern = new RegExp(
      `${fromChar}.*→.*${relationshipName}.*→.*${toChar}`,
    );

    const row = this.page
      .locator('div.p-4.border.rounded-lg')
      .filter({ hasText: relationshipPattern })
      .first();

    await row.getByRole('button', { name: '削除' }).click();
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
    const relationshipPattern = new RegExp(
      `${fromChar}.*→.*${relationshipName}.*→.*${toChar}`,
    );

    const row = this.page
      .locator('div.p-4.border.rounded-lg')
      .filter({ hasText: relationshipPattern });

    await expect(row).not.toBeVisible();
  },
);
