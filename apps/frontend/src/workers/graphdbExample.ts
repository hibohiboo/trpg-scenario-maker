import { graphdbWorkerClient } from "./graphdbWorkerClient";

/**
 * GraphDB WebWorker使用例
 */
export async function runGraphDBExample(): Promise<void> {
  try {
    console.log("Initializing GraphDB Worker...");
    await graphdbWorkerClient.initialize();

    // Scenarioノードを作成
    console.log("\nCreating Scenario node...");
    await graphdbWorkerClient.execute(`
      CREATE (s:Scenario {id: 'scenario-001', title: 'Mystery at the Mansion'})
    `);

    // Sceneノードを作成
    console.log("Creating Scene nodes...");
    await graphdbWorkerClient.execute(`
      CREATE (sc:Scene {
        id: 'scene-001',
        title: 'Entrance Hall',
        isMasterScene: true,
        description: 'A grand entrance with a chandelier'
      })
    `);

    await graphdbWorkerClient.execute(`
      CREATE (sc:Scene {
        id: 'scene-002',
        title: 'Library',
        isMasterScene: false,
        description: 'Dusty books line the shelves'
      })
    `);

    // リレーションを作成
    console.log("Creating relationships...");
    await graphdbWorkerClient.execute(`
      MATCH (scenario:Scenario {id: 'scenario-001'}), (scene:Scene {id: 'scene-001'})
      CREATE (scenario)-[:HAS_SCENE]->(scene)
    `);

    await graphdbWorkerClient.execute(`
      MATCH (scenario:Scenario {id: 'scenario-001'}), (scene:Scene {id: 'scene-002'})
      CREATE (scenario)-[:HAS_SCENE]->(scene)
    `);

    // データを取得
    console.log("\n--- Fetching all Scenarios ---");
    const scenarios = await graphdbWorkerClient.execute(
      "MATCH (s:Scenario) RETURN s",
    );
    console.log(scenarios);

    console.log("\n--- Fetching all Scenes ---");
    const scenes = await graphdbWorkerClient.execute(
      "MATCH (sc:Scene) RETURN sc",
    );
    console.log(scenes);

    console.log("\n--- Fetching Scenario with its Scenes ---");
    const relations = await graphdbWorkerClient.execute(`
      MATCH (scenario:Scenario)-[:HAS_SCENE]->(scene:Scene)
      RETURN scenario.title AS scenarioTitle, scene.title AS sceneTitle, scene.isMasterScene
    `);
    console.log(relations);

    console.log("\nExample completed successfully!");
  } catch (error) {
    console.error("Error during GraphDB example:", error);
    throw error;
  }
}

// ブラウザ環境でグローバルに公開
if (typeof window !== "undefined") {
  (window as unknown as { runGraphDBExample: () => Promise<void> }).runGraphDBExample =
    runGraphDBExample;
}
