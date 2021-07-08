import * as React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import AppLayout from "modules/common/layouts/App";
import Launches from "modules/launches";
import NotFound from "modules/notFound";

export default function AppRouter() {
  return (
    <AppLayout>
      <Switch>
        <Route exact path="/launches">
          <Launches />
        </Route>
        <Route exact path="/launches/:id">
          <Launches />
        </Route>
        <Route exact path="/">
          <Redirect to="/launches" />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </AppLayout>
  );
}
