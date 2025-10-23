/**
 * シナリオの型定義
 */
export interface Scenario {
  /** シナリオID */
  id: string;
  /** シナリオタイトル */
  title: string;
  /** 作成日時 */
  createdAt: Date;
  /** 更新日時 */
  updatedAt: Date;
}

/**
 * シナリオ作成・更新用の入力データ
 */
export interface ScenarioFormData {
  /** シナリオタイトル */
  title: string;
}
