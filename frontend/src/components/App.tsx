import React from "react";

import { withAuthenticator } from "@aws-amplify/ui-react";

import Header from "components/Header";
import BrewList from "components/BrewList";
import AddBrew from "components/AddBrew";

export function UnauthedApp() {
  return (
    <div className="App">
      <Header />
      <AddBrew />
      <BrewList />
    </div>
  );
}

export default withAuthenticator(UnauthedApp);
