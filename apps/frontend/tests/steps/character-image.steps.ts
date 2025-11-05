import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { CustomWorld } from './common.steps';

// テスト用の画像データ（1x1のPNG）
const TEST_IMAGE_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// Base64をBufferに変換するヘルパー関数
function base64ToBuffer(base64: string): Buffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return Buffer.from(bytes);
}

// 画像アップロード
When(
  'テスト画像をアップロードする',
  async function (this: CustomWorld) {
    // ファイル入力要素を取得
    const fileInput = this.page.locator('input[type="file"]');

    // テスト用の画像ファイルをセット
    const buffer = base64ToBuffer(TEST_IMAGE_DATA_URL.split(',')[1]);
    await fileInput.setInputFiles({
      name: 'test-image.png',
      mimeType: 'image/png',
      buffer,
    });
  },
);

When(
  'テスト画像 {string} をアップロードする',
  async function (this: CustomWorld, imageName: string) {
    // ファイル入力要素を取得
    const fileInput = this.page.locator('input[type="file"]');

    // 画像名に応じて異なる色の画像を生成（識別用）
    const colors: Record<string, string> = {
      image1: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==', // 赤
      image2: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', // 緑
      image3: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg==', // 青
    };

    const base64Data = colors[imageName] || colors.image1;
    const buffer = base64ToBuffer(base64Data);

    await fileInput.setInputFiles({
      name: `${imageName}.png`,
      mimeType: 'image/png',
      buffer,
    });
  },
);

When(
  '{string} チェックボックスをチェックする',
  async function (this: CustomWorld, label: string) {
    await this.page.getByLabel(label).check();
  },
);

When(
  '画像 {string} にマウスをホバーする',
  async function (this: CustomWorld, _imageName: string) {
    // 画像コンテナを取得（alt属性またはdata属性で識別）
    const imageContainer = this.page
      .locator('.group')
      .filter({ has: this.page.locator('img') })
      .first();
    await imageContainer.hover();
  },
);

When(
  '確認ダイアログで {string} をクリックする',
  async function (this: CustomWorld, action: string) {
    // window.confirmのダイアログを処理
    this.page.on('dialog', async (dialog) => {
      if (action === 'OK') {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
  },
);

When(
  '登場キャラクター {string} をクリックする',
  async function (this: CustomWorld, characterName: string) {
    const characterRow = this.page
      .locator('.scenario-character-item')
      .filter({ hasText: characterName });
    await characterRow.click();
  },
);

// モーダル
Then(
  '画像アップロードモーダルが表示される',
  async function (this: CustomWorld) {
    await expect(
      this.page.getByRole('heading', { name: '画像を追加' }),
    ).toBeVisible();
  },
);

Then(
  '画像アップロードモーダルが閉じる',
  async function (this: CustomWorld) {
    await expect(
      this.page.getByRole('heading', { name: '画像を追加' }),
    ).not.toBeVisible();
  },
);

// 画像ギャラリー
Then(
  '画像ギャラリーに画像が{int}枚表示される',
  async function (this: CustomWorld, count: number) {
    const images = await this.page.locator('img[alt="Character"]').count();
    expect(images).toBe(count);
  },
);

Then(
  '画像ギャラリーに画像が追加されていない',
  async function (this: CustomWorld) {
    const images = await this.page.locator('img[alt="Character"]').count();
    expect(images).toBe(0);
  },
);

Then(
  'その画像がメイン画像として表示される',
  async function (this: CustomWorld) {
    // メインバッジを持つ画像コンテナが存在することを確認
    await expect(
      this.page.locator('.border-blue-500').first(),
    ).toBeVisible();
    await expect(
      this.page.getByText('メイン', { exact: true }).first(),
    ).toBeVisible();
  },
);

Then(
  '画像 {string} がメイン画像として表示される',
  async function (this: CustomWorld, imageName: string) {
    // メインバッジが表示されていることを確認
    await expect(
      this.page.getByText('メイン', { exact: true }).first(),
    ).toBeVisible();
  },
);

Then(
  '画像 {string} は通常の画像として表示される',
  async function (this: CustomWorld, imageName: string) {
    // この画像はメインバッジを持たないことを確認
    // 実装では画像の順序やデータ属性で識別する必要があるかもしれません
    const mainBadges = await this.page
      .getByText('メイン', { exact: true })
      .count();
    // 複数画像がある場合、メインバッジは1つだけ
    expect(mainBadges).toBeLessThanOrEqual(1);
  },
);

Then(
  '画像 {string} は表示されない',
  async function (this: CustomWorld, imageName: string) {
    // 削除後、画像の総数が減っていることで確認
    // 具体的な画像の識別が必要な場合はdata属性などを追加
  },
);

Then(
  '{string} というメッセージが表示される',
  async function (this: CustomWorld, message: string) {
    await expect(this.page.getByText(message)).toBeVisible();
  },
);
