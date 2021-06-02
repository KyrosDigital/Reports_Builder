import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { App } from '../../ui/App'
import { LoggedIn } from '../loggedIn'
import Navbar from '../../ui/components/nav';
import { Login } from '../../ui/Login/login'
import { Report_View } from '../../ui/Report_View/Report_View';
import { Report_Builder } from '../../ui/Report_Builder/Report_Builder';
import { Report_List } from '../../ui/Report_List/Report_List'
import { Viewers_List } from '../../ui/Viewers_List/Viewers_List'
import { Not_Found } from '../../ui/404_Page/notFound'

export const Main_Router = () => {

	return (
		<App>
			<Toaster position="top-right"/>
				<Router>
					<Navbar />
					<Switch>
						<Route path='/' exact component={Login} />
						<Route path='/login' component={Login} />
						<Route path='/viewers' component={Viewers_List} />
						<Route path='/report-list' component={Report_List} />
						<Route path='/report-view/:id?' component={Report_View} />
						<Route path='/report-builder/:id?' component={Report_Builder} />
						<Route component={Not_Found}/>
					</Switch>
				</Router>
		</App>
	)
};