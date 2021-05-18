import React from 'react';
import { Report_View } from './Report_View/Report_View';
import { Report_Builder } from './Report_Builder/Report_Builder';
import { Report_List } from './Report_List/Report_List'
import Navbar from './nav/nav';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

export const App = () => (
  <div>
		<Toaster position="top-right"/>
		<Router>
      <Navbar />
      <Switch>
        <Route path='/' exact component={Report_Builder} />
        <Route path='/report-view/:id?' component={Report_View} />
        <Route path='/report-builder/:id?' component={Report_Builder} />
        <Route path='/report-list' component={Report_List} />
      </Switch>
    </Router>
  </div>
  
);
