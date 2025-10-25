import { initializeDatabase, getConnection, closeDatabase } from "./db";

/**
 * MVPサンプル: データ登録・取得のデモ
 */
async function runExample(): Promise<void> {
  try {
    // データベース初期化
    console.log("Initializing database...");
    await initializeDatabase();

    const conn = getConnection();

    // Scenarioノードを登録
    console.log("\nCreating Scenario node...");
    await conn.execute(`
      CREATE (s:Scenario {id: 'scenario-001', title: 'Mystery at the Mansion'})
    `);

    // Sceneノードを登録
    console.log("Creating Scene nodes...");
    await conn.execute(`
      CREATE (sc:Scene {
        id: 'scene-001',
        title: 'Entrance Hall',
        isMasterScene: true,
        description: 'A grand entrance with a chandelier'
      })
    `);

    await conn.execute(`
      CREATE (sc:Scene {
        id: 'scene-002',
        title: 'Library',
        isMasterScene: false,
        description: 'Dusty books line the shelves'
      })
    `);

    // リレーションを作成
    console.log("Creating relationships...");
    await conn.execute(`
      MATCH (scenario:Scenario {id: 'scenario-001'}), (scene:Scene {id: 'scene-001'})
      CREATE (scenario)-[:HAS_SCENE]->(scene)
    `);

    await conn.execute(`
      MATCH (scenario:Scenario {id: 'scenario-001'}), (scene:Scene {id: 'scene-002'})
      CREATE (scenario)-[:HAS_SCENE]->(scene)
    `);

    // データを取得
    console.log("\n--- Fetching all Scenarios ---");
    const scenariosResult = await conn.execute("MATCH (s:Scenario) RETURN s");
    console.log(JSON.parse(scenariosResult.table.toString()));

    console.log("\n--- Fetching all Scenes ---");
    const scenesResult = await conn.execute("MATCH (sc:Scene) RETURN sc");
    console.log(JSON.parse(scenesResult.table.toString()));

    console.log("\n--- Fetching Scenario with its Scenes ---");
    const relationResult = await conn.execute(`
      MATCH (scenario:Scenario)-[:HAS_SCENE]->(scene:Scene)
      RETURN scenario.title AS scenarioTitle, scene.title AS sceneTitle, scene.isMasterScene
    `);
    console.log(JSON.parse(relationResult.table.toString()));

    // クリーンアップ
    await closeDatabase();
    console.log("\nDatabase closed successfully");
  } catch (error) {
    console.error("Error during example execution:", error);
    throw error;
  }
}

// ブラウザ環境で実行する場合
if (typeof window !== "undefined") {
  (window as unknown as { runKuzuExample: () => Promise<void> }).runKuzuExample = runExample;
}

export { runExample };
