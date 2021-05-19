import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './nav/nav';
import { Login } from './Login/login'
import { Report_View } from './Report_View/Report_View';
import { Report_Builder } from './Report_Builder/Report_Builder';
import { Report_List } from './Report_List/Report_List'

export const App = () => (
  <div>
		<form action="/hello" method="post" target="_blank">
    <h2>API Test Form</h2>
    <p className="subtitle">Paste or enter some text content to submit to the <code>/hello</code> endpoint.</p>
    <textarea name="content" placeholder="Enter some sample input here..." rows={3}></textarea>
    <button className="btn" type="submit">Submit to API</button>
  </form>
		<Toaster position="top-right"/>
		<Router>
      <Navbar />
      <Switch>
        <Route path='/' exact component={Report_Builder} />
        <Route path='/report-view/:id?' component={Report_View} />
        <Route path='/report-builder/:id?' component={Report_Builder} />
        <Route path='/report-list' component={Report_List} />
        <Route path='/login' component={Login} />
      </Switch>
    </Router>
  </div>
  
);
