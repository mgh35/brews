import React from "react";
import ReactDOM from "react-dom";
import AWS from "aws-sdk";
import Amplify from "aws-amplify";

import App from "App";
import config from "config";

import "bootstrap/dist/css/bootstrap.min.css";

AWS.config.update(config.AWS_SDK_CONFIG);
Amplify.configure(config.AWS_AMPLIFY_CONFIG);

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);
