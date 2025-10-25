/**
 * Worker メッセージの基底型
 */
export interface BaseWorkerRequest {
  type: string;
  payload?: unknown;
}

export interface BaseWorkerResponse {
  type: string;
  data?: unknown;
  success?: boolean;
  error?: string;
}

/**
 * Worker内部で使用するメッセージ型（ID付き）
 */
export interface WorkerMessageWithId<T extends BaseWorkerRequest> extends T {
  id: number;
}

export interface WorkerResponseWithId<T extends BaseWorkerResponse> extends T {
  id: number;
}
