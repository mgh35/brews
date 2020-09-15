import React from "react";

import { withAuthenticator } from "@aws-amplify/ui-react";

import Header from "components/Header";
import BrewList from "components/BrewList";
import BrewInputPanel from "components/BrewInputPanel";

export function UnauthedApp() {
  return (
    <div className="App">
      <Header />
      <BrewInputPanel />
      <BrewList />
    </div>
  );
}

export default withAuthenticator(UnauthedApp);
