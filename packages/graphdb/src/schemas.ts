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
  ],
};
