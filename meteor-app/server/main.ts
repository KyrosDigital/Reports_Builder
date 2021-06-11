import { Meteor } from 'meteor/meteor';

// publications
import './api/v1/publications/publications';

// methods
import './api/v1/accounts/methods';
import './api/v1/reports/methods';

// api endpoints
import './api/v1/endpoints'

// roles 
import { configureRoles } from './api/v1/roles/roles'

// seeders
import { seedUserData } from './api/v1/seeders/seeder'

// securiy
import { security } from './api/v1/accounts/security'

Meteor.startup(() => {

	configureRoles()

	seedUserData()

	security()
	
});