import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from 'components/App';
import configureStore from 'configureStore';
import AmplifyBridge from 'store/AmplifyBridge';

const store = configureStore();
new AmplifyBridge(store);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
