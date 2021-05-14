import React from 'react';
import { Report_View } from './Report_View';
import { Report_Builder } from './Report_Builder/Report_Builder';
import Navbar from './nav/nav';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

export const App = () => (
  <div>
		<Router>
      <Navbar />
      <Switch>
        <Route path='/' exact component={Report_Builder} />
        <Route path='/report-view' component={Report_View} />
        <Route path='/report-builder' component={Report_Builder} />
      </Switch>
    </Router>
  </div>
);
