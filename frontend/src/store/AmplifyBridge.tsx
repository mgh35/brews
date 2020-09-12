import { Store } from 'redux';
import { Auth, Hub } from 'aws-amplify';
import { switchUser } from 'store/auth/actions';

export default class AmplifyBridge {
    store: Store

    constructor(store: Store) {
      this.store = store;
  
      this.onHubCapsule = this.onHubCapsule.bind(this);
      Hub.listen('auth', this, 'AmplifyBridge');
  
      this.checkUser(); // first check
    };
  
    onHubCapsule() {
      this.checkUser(); // triggered every time user sign in / out
    };
  
    checkUser() {
        Promise.all([
            Auth.currentUserCredentials(),
            Auth.currentUserInfo()
        ])
        .then(([userCreds, userInfo]) => {
            let user = userInfo;
            user.credentials = userCreds;
            this.store.dispatch(switchUser({
                id: userInfo.id,
                username: userInfo.username,
                email: userInfo.attributes.email,
                credentials: userCreds
            }));
        })
        .catch(err => {
          this.store.dispatch(switchUser(null));
        });
    };
};
