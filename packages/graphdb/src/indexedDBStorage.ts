/**
 * WebWorker内で使用するIndexedDBストレージユーティリティ
 */

const DB_NAME = 'graphdb-storage';
const DB_VERSION = 1;
const STORE_NAME = 'csv-files';

interface DBSchema {
  key: string;
  value: string;
}

/**
 * IndexedDBを初期化して返す
 */
async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // オブジェクトストアが存在しない場合は作成
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
  });
}

/**
 * データを保存
 */
export async function setItem(key: string, value: string): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const data: DBSchema = { key, value };
    const request = store.put(data);

    request.onerror = () => {
      reject(new Error(`Failed to save data for key: ${key}`));
    };

    request.onsuccess = () => {
      resolve();
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
}

/**
 * データを取得
 */
export async function getItem(key: string): Promise<string | null> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);

    request.onerror = () => {
      reject(new Error(`Failed to get data for key: ${key}`));
    };

    request.onsuccess = () => {
      const result = request.result as DBSchema | undefined;
      resolve(result?.value ?? null);
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
}

/**
 * データを削除
 */
export async function removeItem(key: string): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(key);

    request.onerror = () => {
      reject(new Error(`Failed to delete data for key: ${key}`));
    };

    request.onsuccess = () => {
      resolve();
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
}

/**
 * 全データをクリア
 */
export async function clear(): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onerror = () => {
      reject(new Error('Failed to clear data'));
    };

    request.onsuccess = () => {
      resolve();
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
}
