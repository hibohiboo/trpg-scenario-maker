import { Provider } from 'react-redux';
import { ScenarioPage } from '../page/scenario';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <ScenarioPage />
    </Provider>
  );
}

export default App;
