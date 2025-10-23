import { runMigrate } from '@trpg-scenario-maker/rdb/db/runMigrate';
import { createScenario } from '@trpg-scenario-maker/rdb/queries/insert';
import { getScenarios } from '@trpg-scenario-maker/rdb/queries/select';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ScenarioPage } from '../page/scenario';
import { store } from './store';

function App() {
  useEffect(() => {
    (async () => {
      await runMigrate();
      await createScenario({
        title: 'サンプルシナリオ',
        id: '4388aac2-bcc3-4dbd-ab39-50700eded5a5',
      });
      const scenarios = await getScenarios();
      console.log('scenarios', scenarios);
    })();
  }, []);
  return (
    <Provider store={store}>
      <ScenarioPage />
    </Provider>
  );
}

export default App;
