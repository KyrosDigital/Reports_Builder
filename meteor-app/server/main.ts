import { Meteor } from 'meteor/meteor';

// roles 
import { configureRoles } from './startup/roles'

// publications
import './publications/publications';

// methods
import './api/accounts/methods';
import './api/reports/methods';

// api endpoints
import './api/endpoints'

// seeders
import { seedUserData } from './seeders/seeder'

Meteor.startup(() => {

	configureRoles()

	seedUserData()
	
});
