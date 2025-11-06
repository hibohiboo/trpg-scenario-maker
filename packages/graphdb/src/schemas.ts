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
    {
      name: 'Character',
      query: `
      CREATE NODE TABLE Character (
        id STRING,
        name STRING,
        description STRING,
        PRIMARY KEY (id)
      )`,
    },
    {
      name: 'CharacterRelationship',
      query: `
      CREATE NODE TABLE CharacterRelationship (
        id STRING,
        fromCharacterId STRING,
        toCharacterId STRING,
        relationshipName STRING,
        PRIMARY KEY (id)
      )`,
    },
    {
      name: 'InformationItem',
      query: `
      CREATE NODE TABLE InformationItem (
        id STRING,
        title STRING,
        description STRING,
        scenarioId STRING,
        PRIMARY KEY (id)
      )`,
    },
    {
      name: 'Image',
      query: `
      CREATE NODE TABLE Image (
        id STRING,
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
    {
      name: 'CHARACTER_RELATES_FROM',
      query: `
      CREATE REL TABLE CHARACTER_RELATES_FROM (
        FROM Character TO Character,
        id STRING,
        relationshipName STRING
      )`,
    },
    {
      name: 'CHARACTER_RELATES_TO',
      query: `
      CREATE REL TABLE CHARACTER_RELATES_TO (
        FROM Character TO Character,
        id STRING,
        relationshipName STRING
      )`,
    },
    {
      name: 'APPEARS_IN',
      query: `
      CREATE REL TABLE APPEARS_IN (
        FROM Character TO Scenario,
        role STRING
      )`,
    },
    {
      name: 'RELATES_IN_SCENARIO',
      query: `
      CREATE REL TABLE RELATES_IN_SCENARIO (
        FROM Character TO Character,
        scenarioId STRING,
        relationshipName STRING
      )`,
    },
    {
      name: 'HAS_INFORMATION',
      query: `
      CREATE REL TABLE HAS_INFORMATION (
        FROM Scenario TO InformationItem
      )`,
    },
    {
      name: 'INFORMATION_RELATED_TO',
      query: `
      CREATE REL TABLE INFORMATION_RELATED_TO (
        FROM InformationItem TO InformationItem,
        id STRING
      )`,
    },
    {
      name: 'SCENE_HAS_INFO',
      query: `
      CREATE REL TABLE SCENE_HAS_INFO (
        FROM Scene TO InformationItem,
        id STRING
      )`,
    },
    {
      name: 'INFO_POINTS_TO_SCENE',
      query: `
      CREATE REL TABLE INFO_POINTS_TO_SCENE (
        FROM InformationItem TO Scene,
        id STRING
      )`,
    },
    {
      name: 'HAS_IMAGE',
      query: `
      CREATE REL TABLE HAS_IMAGE (
        FROM Character TO Image,
        isPrimary BOOL
      )`,
    },
  ],
};
