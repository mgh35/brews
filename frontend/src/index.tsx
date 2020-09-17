import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import AWS from "aws-sdk";
import Amplify from "aws-amplify";

import App from "components/App";
import config from "config";
import configureStore from "configureStore";
import AmplifyBridge from "store/AmplifyBridge";

import "bootstrap/dist/css/bootstrap.min.css";

AWS.config.update(config.AWS_SDK_CONFIG);
Amplify.configure(config.AWS_AMPLIFY_CONFIG);

const store = configureStore();
new AmplifyBridge(store);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
