declare module "@kuzu/kuzu-wasm" {
  export default function kuzu_wasm(): Promise<KuzuModule>;

  export interface KuzuModule {
    Database: () => Promise<Database>;
    Connection: (db: Database) => Promise<Connection>;
  }

  export class Database {
    close(): void;
  }

  export class Connection {
    execute(query: string): Promise<QueryResult>;

    close(): void;
  }

  export interface QueryResult {
    table: {
      toString(): string;
    };
  }
}
