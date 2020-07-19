import React from 'react';

import Amplify from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';

import Banner from './Banner.js';
import Brews from './Brews.js';

Amplify.configure({
    Auth: {
        region: process.env.REACT_APP_REGION,
        userPoolId: process.env.REACT_APP_USER_POOL_ID,
        userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
        oauth: {
            domain: process.env.REACT_APP_USER_POOL_DOMAIN,
            scope: ['profile'],
            redirectSignIn: '/',
            redirectSignOut: '/',
            responseType: 'code'
        }
    }
});

function App() {
  return (
    <div>
        <Banner />
        <Brews />
    </div>
  );
}

export default withAuthenticator(App);
