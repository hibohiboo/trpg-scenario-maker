export const graphDbSchemas = {
  nodes: [
    {
      name: 'Scenario',
      query: `
      CREATE NODE TABLE Scenario (
        id STRING,
        title STRING,
        PRIMARY KEY (id)
      )`,
    },
    {
      name: 'Scene',
      query: `
      CREATE NODE TABLE Scene (
        id STRING,
        title STRING,
        isMasterScene BOOL,
        description STRING,
        PRIMARY KEY (id)
      )`,
    },
    {
      name: 'SceneEvent',
      query: `
      CREATE NODE TABLE SceneEvent (
        id STRING,
        type STRING,
        content STRING,
        sortOrder INT64,
        PRIMARY KEY (id)
      )`,
    },
  ],
  relationships: [
    {
      name: 'HAS_SCENE',
      query: `
      CREATE REL TABLE HAS_SCENE (
        FROM Scenario TO Scene
      )`,
    },
    {
      name: 'NEXT_SCENE',
      query: `
      CREATE REL TABLE NEXT_SCENE (
        FROM Scene TO Scene
      )`,
    },
    {
      name: 'HAS_EVENT',
      query: `
      CREATE REL TABLE HAS_EVENT (
        FROM Scene TO SceneEvent
      )`,
    },
  ],
};
