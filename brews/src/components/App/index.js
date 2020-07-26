import React from 'react';

import AWS from 'aws-sdk';
import Amplify, {Auth} from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';

import awsAmplifyConfig from 'config/aws-amplify-config.json';
import awsSdkConfig from 'config/aws-sdk-config.json';

import AddBrew from 'components/AddBrew';
import Banner from 'components/Banner';
import Brews from 'components/Brews';

AWS.config.update(awsSdkConfig);
Amplify.configure(awsAmplifyConfig);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        user: null
    };
  }

  componentDidMount() {
    Promise.all([
      Auth.currentUserCredentials(),
      Auth.currentUserInfo()
    ])
    .then(([userCreds, userInfo]) => {
      var user = userInfo;
      user.credentials = userCreds;
      this.setState({user});
    });
  }

  render() {
    return (
      <div>
        <Banner />
        {this.state.user ?
          <div>
            <AddBrew user={this.state.user} />
            <Brews user={this.state.user} />
          </div>
          : <div>No App User</div>
        }
      </div>
    );
  }
}

export default withAuthenticator(App);
