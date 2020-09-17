import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { withAuthenticator } from "@aws-amplify/ui-react";

import Header from "components/Header";
import BrewList from "components/BrewList";
import BrewInputPanel from "components/BrewInputPanel";

export function UnauthedApp() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Switch>
          <Route exact path="/">
            <div>Welcome!</div>
          </Route>
          <Route exact path="/add">
            <BrewInputPanel />
          </Route>
          <Route exact path="/list">
            <BrewList />
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default withAuthenticator(UnauthedApp);
