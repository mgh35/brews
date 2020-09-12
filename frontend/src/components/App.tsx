import React from 'react';

import AWS from 'aws-sdk';
import Amplify from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';

import config from 'config';
import Header from 'components/Header';
import BrewList from 'components/BrewList';
import AddBrew from 'components/AddBrew';

AWS.config.update(config.AWS_SDK_CONFIG);
Amplify.configure(config.AWS_AMPLIFY_CONFIG);

function App() {
  return (
    <div className="App">
      <Header />
      <AddBrew />
      <BrewList />
    </div>
  );
};

export default withAuthenticator(App);
