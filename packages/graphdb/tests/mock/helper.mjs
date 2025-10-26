import { tableToIPC } from 'apache-arrow';
import { parseTable } from './arrow-js-ffi.es.mjs';
async function initializeWebDatabase(
  module,
  databasePath = 'memDB',
  bufferPoolSize = 0,
  maxNumThreads = 0,
  compression = false,
  readOnly = false,
  maxDBSize = 4194304 * 16 * 4,
) {
  const webDatabaseModule = await new module.WebDatabase(
    databasePath,
    bufferPoolSize,
    maxNumThreads,
    compression,
    readOnly,
    maxDBSize,
  );
  return webDatabaseModule;
}

async function initializeWebConnection(module, WebDatabase, numThreads = 0) {
  const webConnectionModule = await new module.WebConnection(
    WebDatabase,
    numThreads,
  );
  webConnectionModule.execute = (query_text) =>
    execute(module, webConnectionModule, query_text);
  return webConnectionModule;
}
async function execute(module, webConnectionModule, query_text) {
  let result = webConnectionModule.query(query_text);
  if (result.isSuccess()) {
    const schemaPtr = result.getArrowSchema();
    const arrayPtr = result.getArrowChunk();
    const WASM_MEMORY = module.wasmMemory;
    let table = parseTable(WASM_MEMORY.buffer, [arrayPtr], schemaPtr, true);
    table.toIPC = () => {
      const buffer = tableToIPC(table);
      buffer.toHex = () => {
        const hexArray = [];
        const byteArray = new Uint8Array(buffer);
        byteArray.forEach((byte) => {
          const hex = byte.toString(16).padStart(2, '0');
          hexArray.push(hex);
        });
        return hexArray.join('');
      };
      return buffer;
    };
    result.table = table;
    return result;
  }
  return false;
}
export { initializeWebDatabase, initializeWebConnection };
