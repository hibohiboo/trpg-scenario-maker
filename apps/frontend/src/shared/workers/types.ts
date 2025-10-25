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
export type WorkerMessageWithId<T extends BaseWorkerRequest> = T & {
  id: number;
};

export type WorkerResponseWithId<T extends BaseWorkerResponse> = T & {
  id: number;
};
