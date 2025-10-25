declare module '@kuzu/kuzu-wasm' {
  export default function kuzu_wasm(): Promise<KuzuModule>;

  export interface KuzuModule {
    Database: () => Promise<Database>;
    Connection: (db: Database) => Promise<Connection>;
    FS: {
      writeFile: (path: string, content: string) => void;
      readFile: <E extends 'binary' | 'utf8'>(
        path: string,
        options: { encoding: E },
      ) => E extends 'utf8' ? string : Uint8Array;
    };
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
