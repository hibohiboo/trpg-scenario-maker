/**
 * 古いIDから新しいIDへの変換マップを作成
 *
 * @param oldIds - 古いIDの配列
 * @returns ID変換マップ（oldId -> newId）
 */
export function createIdMap(oldIds: string[]): Map<string, string> {
  const idMap = new Map<string, string>();

  for (const oldId of oldIds) {
    const newId = crypto.randomUUID();
    idMap.set(oldId, newId);
  }

  return idMap;
}

/**
 * オブジェクトや配列内のIDを変換マップに基づいて置換
 *
 * @param data - 変換対象のデータ
 * @param idMap - ID変換マップ
 * @returns ID置換後のデータ
 */
export function remapIds<T>(data: T, idMap: Map<string, string>): T {
  // プリミティブ型
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string') {
    // IDマップに存在する場合は置換
    return (idMap.get(data) ?? data) as T;
  }

  if (typeof data !== 'object') {
    return data;
  }

  // 配列の場合
  if (Array.isArray(data)) {
    return data.map((item) => remapIds(item, idMap)) as T;
  }

  // オブジェクトの場合
  const remapped: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    remapped[key] = remapIds(value, idMap);
  }

  return remapped as T;
}

/**
 * 複数のID配列を結合してユニークなID一覧を取得
 *
 * @param idArrays - ID配列のリスト
 * @returns ユニークなID配列
 */
export function collectUniqueIds(...idArrays: string[][]): string[] {
  const uniqueIds = new Set<string>();

  for (const ids of idArrays) {
    for (const id of ids) {
      uniqueIds.add(id);
    }
  }

  return Array.from(uniqueIds);
}
