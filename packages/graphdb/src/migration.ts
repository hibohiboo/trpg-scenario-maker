export const sampleData = [
  {
    table: 'Scenario',
    key: '/Scenario.csv',
    value: '3f81c321-1941-4247-9f5d-37bb6a9e8e45,サンプルシナリオ\n',
  },
  {
    table: 'Scene',
    key: '/Scene.csv',
    value:
      '9b24b4c3-d1f7-482c-8a07-f110c661a23f,[PC1] OP ヒロインと出会う,False,オープニング\n74359a7c-cd01-4ac4-b3d7-424b8d8ce327,[PC2] OPボスとの因縁,False,オープニング\n8c92a5fa-d483-4cfd-84dc-fb0d4ed809c6,[PC3] OP 事件を追う,False,オープニング\nf4c51418-2b8f-4c05-9789-31a3ef53f87b,[PC1] ボスがヒロインを狙う ,False,ボスがヒロインを狙う\nb6e53dbd-d332-472f-afc7-a1156545e622,[PC2] ボスが警告,False,""\n809ee0b7-6178-4879-96ab-9b6af58749cf,[PC3] 上司からの発破,False,""\ne8958f5f-6863-4a56-8f82-36fb89a4411b,[PC1] ヒロインからの問いかけ,False,""\na01f2c4f-dbda-4a55-b071-2b9aae5e1058,クライマックス前演出,True,""\n65e82d4a-1f3f-404f-b5ae-e44d1e579f93,クライマックス,False,前口上・クライマックス戦闘\n7010a1d0-9687-4cec-b440-c54215527eb4,エンディング,False,ふたりは幸せなキスをして終了\n',
  },
  {
    table: 'HAS_SCENE',
    key: '/HAS_SCENE.csv',
    value:
      '3f81c321-1941-4247-9f5d-37bb6a9e8e45|7010a1d0-9687-4cec-b440-c54215527eb4\n3f81c321-1941-4247-9f5d-37bb6a9e8e45|65e82d4a-1f3f-404f-b5ae-e44d1e579f93\n3f81c321-1941-4247-9f5d-37bb6a9e8e45|a01f2c4f-dbda-4a55-b071-2b9aae5e1058\n3f81c321-1941-4247-9f5d-37bb6a9e8e45|e8958f5f-6863-4a56-8f82-36fb89a4411b\n3f81c321-1941-4247-9f5d-37bb6a9e8e45|809ee0b7-6178-4879-96ab-9b6af58749cf\n3f81c321-1941-4247-9f5d-37bb6a9e8e45|b6e53dbd-d332-472f-afc7-a1156545e622\n3f81c321-1941-4247-9f5d-37bb6a9e8e45|f4c51418-2b8f-4c05-9789-31a3ef53f87b\n3f81c321-1941-4247-9f5d-37bb6a9e8e45|8c92a5fa-d483-4cfd-84dc-fb0d4ed809c6\n3f81c321-1941-4247-9f5d-37bb6a9e8e45|74359a7c-cd01-4ac4-b3d7-424b8d8ce327\n3f81c321-1941-4247-9f5d-37bb6a9e8e45|9b24b4c3-d1f7-482c-8a07-f110c661a23f\n',
  },
  {
    table: 'NEXT_SCENE',
    key: '/NEXT_SCENE.csv',
    value:
      'a01f2c4f-dbda-4a55-b071-2b9aae5e1058|65e82d4a-1f3f-404f-b5ae-e44d1e579f93\n65e82d4a-1f3f-404f-b5ae-e44d1e579f93|7010a1d0-9687-4cec-b440-c54215527eb4\n',
  },
  {
    key: '/SceneEvent.csv',
    value:
      'a884774e-7cc5-4245-be4a-7af52ebffcc6,conversation,前口上,0\n82adb039-9259-4012-b1e0-534fc2ebe774,battle,クライマックス戦闘,0\n',
  },
  {
    table: 'HAS_EVENT',
    key: '/HAS_EVENT.csv',
    value:
      '65e82d4a-1f3f-404f-b5ae-e44d1e579f93|82adb039-9259-4012-b1e0-534fc2ebe774\n65e82d4a-1f3f-404f-b5ae-e44d1e579f93|a884774e-7cc5-4245-be4a-7af52ebffcc6\n',
  },
  {
    table: 'InformationItem',
    key: '/InformationItem.csv',
    value:
      '49c3920e-ab16-4cad-a8b8-df8a49f96bbd,1 ヒロインについて,"",3f81c321-1941-4247-9f5d-37bb6a9e8e45\n0349466d-372b-4647-8e6e-6b68631e40a8,2 ボスについて,"",3f81c321-1941-4247-9f5d-37bb6a9e8e45\n95e6bdb9-ad4e-42e3-bc53-ddbd00c2764d,3 事件について,"",3f81c321-1941-4247-9f5d-37bb6a9e8e45\n737da5c5-166d-4516-9696-315251d36810,4 アイテムについて,"",3f81c321-1941-4247-9f5d-37bb6a9e8e45\nfd2ab141-d9f1-405e-8be3-7fc6384bbe90,5 ヒロイン性,"",3f81c321-1941-4247-9f5d-37bb6a9e8e45\n0409fe81-746f-4565-af6a-5e249b5ae551,6 事件・アイテムの裏,"",3f81c321-1941-4247-9f5d-37bb6a9e8e45\n5c7b0811-7650-430b-88bd-64f3d3886d53,7 裏ボスについて,"",3f81c321-1941-4247-9f5d-37bb6a9e8e45\n6a9d98de-6901-40c0-ad85-baa00cd12703,8 ヒロインの過去,"",3f81c321-1941-4247-9f5d-37bb6a9e8e45\n69ae6563-22b5-4e04-b138-fc0249c2f402,9 ボスの経歴,"",3f81c321-1941-4247-9f5d-37bb6a9e8e45\n1a3eea6a-e60e-41a2-a4fd-578ebec9d101,10 裏ボスの経歴,"",3f81c321-1941-4247-9f5d-37bb6a9e8e45\n427ff859-8029-4f18-8d95-e9856bfc9a6e,11 ボスたちの行動と結果予測,"",3f81c321-1941-4247-9f5d-37bb6a9e8e45\nb9399bc3-1d66-412b-a796-695f18ee9dae,12 クライマックスへの到達方法,"",3f81c321-1941-4247-9f5d-37bb6a9e8e45\n',
  },
  {
    table: 'HAS_INFORMATION',
    key: '/HAS_INFORMATION.csv',
    value:
      '3f81c321-1941-4247-9f5d-37bb6a9e8e45|b9399bc3-1d66-412b-a796-695f18ee9dae\n3f81c321-1941-4247-9f5d-37bb6a9e8e45|427ff859-8029-4f18-8d95-e9856bfc9a6e\n3f81c321-1941-4247-9f5d-37bb6a9e8e45|1a3eea6a-e60e-41a2-a4fd-578ebec9d101\n3f81c321-1941-4247-9f5d-37bb6a9e8e45|69ae6563-22b5-4e04-b138-fc0249c2f402\n3f81c321-1941-4247-9f5d-37bb6a9e8e45|6a9d98de-6901-40c0-ad85-baa00cd12703\n3f81c321-1941-4247-9f5d-37bb6a9e8e45|5c7b0811-7650-430b-88bd-64f3d3886d53\n3f81c321-1941-4247-9f5d-37bb6a9e8e45|0409fe81-746f-4565-af6a-5e249b5ae551\n3f81c321-1941-4247-9f5d-37bb6a9e8e45|fd2ab141-d9f1-405e-8be3-7fc6384bbe90\n3f81c321-1941-4247-9f5d-37bb6a9e8e45|737da5c5-166d-4516-9696-315251d36810\n3f81c321-1941-4247-9f5d-37bb6a9e8e45|95e6bdb9-ad4e-42e3-bc53-ddbd00c2764d\n3f81c321-1941-4247-9f5d-37bb6a9e8e45|0349466d-372b-4647-8e6e-6b68631e40a8\n3f81c321-1941-4247-9f5d-37bb6a9e8e45|49c3920e-ab16-4cad-a8b8-df8a49f96bbd\n',
  },
  {
    table: 'SCENE_HAS_INFO',
    key: '/SCENE_HAS_INFO.csv',
    value:
      '9b24b4c3-d1f7-482c-8a07-f110c661a23f|49c3920e-ab16-4cad-a8b8-df8a49f96bbd|baa9ef56-9c55-45c0-aafc-60eae74302dd\n9b24b4c3-d1f7-482c-8a07-f110c661a23f|49c3920e-ab16-4cad-a8b8-df8a49f96bbd|938dcff1-96ef-42a8-899b-5f59d0753593\n74359a7c-cd01-4ac4-b3d7-424b8d8ce327|0349466d-372b-4647-8e6e-6b68631e40a8|67450cb3-d532-423d-9848-5d7f3eabc7f9\n8c92a5fa-d483-4cfd-84dc-fb0d4ed809c6|737da5c5-166d-4516-9696-315251d36810|0a30ba42-77c8-40e1-9fad-71a5b443e69e\n8c92a5fa-d483-4cfd-84dc-fb0d4ed809c6|95e6bdb9-ad4e-42e3-bc53-ddbd00c2764d|63193733-50d6-4810-8d40-f021f647b988\nf4c51418-2b8f-4c05-9789-31a3ef53f87b|fd2ab141-d9f1-405e-8be3-7fc6384bbe90|2ef8be6c-46ad-4630-b93c-6ba91f7d366b\nb6e53dbd-d332-472f-afc7-a1156545e622|69ae6563-22b5-4e04-b138-fc0249c2f402|f334a52d-45b3-4b35-913e-86cb9c2093ab\n',
  },
  {
    table: 'INFORMATION_RELATED_TO',
    key: '/INFORMATION_RELATED_TO.csv',
    value:
      '49c3920e-ab16-4cad-a8b8-df8a49f96bbd|fd2ab141-d9f1-405e-8be3-7fc6384bbe90|c2912a5a-12a2-491e-8ab9-cc8e08e27b3d\n95e6bdb9-ad4e-42e3-bc53-ddbd00c2764d|69ae6563-22b5-4e04-b138-fc0249c2f402|29781fdb-193d-42fc-86e1-145db4f2d237\n95e6bdb9-ad4e-42e3-bc53-ddbd00c2764d|5c7b0811-7650-430b-88bd-64f3d3886d53|dd336979-3fb5-432c-916d-ad459ba75bb3\n737da5c5-166d-4516-9696-315251d36810|0409fe81-746f-4565-af6a-5e249b5ae551|fd25a340-193f-4e2a-9196-75cabfcefde1\nfd2ab141-d9f1-405e-8be3-7fc6384bbe90|6a9d98de-6901-40c0-ad85-baa00cd12703|dad196ae-a42a-4d90-926a-13aa7ee58372\n5c7b0811-7650-430b-88bd-64f3d3886d53|1a3eea6a-e60e-41a2-a4fd-578ebec9d101|8baf2bab-ae33-407a-8bfb-d42383598b90\n69ae6563-22b5-4e04-b138-fc0249c2f402|427ff859-8029-4f18-8d95-e9856bfc9a6e|988a0795-7ced-47ce-90ee-ad390cf76d25\n1a3eea6a-e60e-41a2-a4fd-578ebec9d101|427ff859-8029-4f18-8d95-e9856bfc9a6e|bd0fc749-0530-4c54-9a7c-6a25aae7e358\n427ff859-8029-4f18-8d95-e9856bfc9a6e|b9399bc3-1d66-412b-a796-695f18ee9dae|a459bae4-2db5-40fc-8231-b09cacb3d1d8\n',
  },
  {
    table: 'INFO_POINTS_TO_SCENE',
    key: '/INFO_POINTS_TO_SCENE.csv',
    value:
      '49c3920e-ab16-4cad-a8b8-df8a49f96bbd|f4c51418-2b8f-4c05-9789-31a3ef53f87b|cf44484a-bac5-44af-9d11-254ad4d081fa\n0349466d-372b-4647-8e6e-6b68631e40a8|b6e53dbd-d332-472f-afc7-a1156545e622|a7a153fd-2bd2-43b2-a9d1-628c7079fb21\n0409fe81-746f-4565-af6a-5e249b5ae551|809ee0b7-6178-4879-96ab-9b6af58749cf|8b3bc56f-8ee2-4c0e-ac74-c5dc139ae719\n5c7b0811-7650-430b-88bd-64f3d3886d53|809ee0b7-6178-4879-96ab-9b6af58749cf|9254cbd5-d6e0-417e-af6f-71dbaef6362f\n6a9d98de-6901-40c0-ad85-baa00cd12703|e8958f5f-6863-4a56-8f82-36fb89a4411b|0a9ccb98-a5b8-4887-a30a-5d0a43244ef6\nb9399bc3-1d66-412b-a796-695f18ee9dae|a01f2c4f-dbda-4a55-b071-2b9aae5e1058|9a9efba9-f766-41f4-8eae-e97cda2a1c4b\n',
  },
  {
    table: 'Character',
    key: '/Character.csv',
    value:
      'e192c9a1-0850-4f0d-b0e9-bafb9effc079,PC1,""\nb7f5f4f6-5cba-4106-94a8-ac2ecd6d1b13,PC2,""\n7f52a1b9-e7a8-4133-b6a6-297e518f6e51,PC3,""\n28e1ee9a-c25e-4a31-befc-ca2c6b010f77,ヒロイン,""\n5862ddfa-d99b-443c-9346-a0237d44e41c,表ボス,""\n55c0250a-6fac-450d-84c1-913ff098a9e5,裏ボス,""\n',
  },
  {
    table: 'APPEARS_IN',
    key: '/APPEARS_IN.csv',
    value:
      'e192c9a1-0850-4f0d-b0e9-bafb9effc079|3f81c321-1941-4247-9f5d-37bb6a9e8e45|PC\nb7f5f4f6-5cba-4106-94a8-ac2ecd6d1b13|3f81c321-1941-4247-9f5d-37bb6a9e8e45|PC\n7f52a1b9-e7a8-4133-b6a6-297e518f6e51|3f81c321-1941-4247-9f5d-37bb6a9e8e45|PC\n28e1ee9a-c25e-4a31-befc-ca2c6b010f77|3f81c321-1941-4247-9f5d-37bb6a9e8e45|NPC\n5862ddfa-d99b-443c-9346-a0237d44e41c|3f81c321-1941-4247-9f5d-37bb6a9e8e45|NPC\n55c0250a-6fac-450d-84c1-913ff098a9e5|3f81c321-1941-4247-9f5d-37bb6a9e8e45|NPC\n',
  },
  {
    table: 'RELATES_IN_SCENARIO',
    key: '/RELATES_IN_SCENARIO.csv',
    value:
      'e192c9a1-0850-4f0d-b0e9-bafb9effc079|28e1ee9a-c25e-4a31-befc-ca2c6b010f77|3f81c321-1941-4247-9f5d-37bb6a9e8e45|助ける\nb7f5f4f6-5cba-4106-94a8-ac2ecd6d1b13|5862ddfa-d99b-443c-9346-a0237d44e41c|3f81c321-1941-4247-9f5d-37bb6a9e8e45|逮捕する\n7f52a1b9-e7a8-4133-b6a6-297e518f6e51|55c0250a-6fac-450d-84c1-913ff098a9e5|3f81c321-1941-4247-9f5d-37bb6a9e8e45|事件を解決したい\n28e1ee9a-c25e-4a31-befc-ca2c6b010f77|e192c9a1-0850-4f0d-b0e9-bafb9effc079|3f81c321-1941-4247-9f5d-37bb6a9e8e45|助けを求める\n5862ddfa-d99b-443c-9346-a0237d44e41c|28e1ee9a-c25e-4a31-befc-ca2c6b010f77|3f81c321-1941-4247-9f5d-37bb6a9e8e45|利用する\n5862ddfa-d99b-443c-9346-a0237d44e41c|b7f5f4f6-5cba-4106-94a8-ac2ecd6d1b13|3f81c321-1941-4247-9f5d-37bb6a9e8e45|勧誘する\n',
  },
];
