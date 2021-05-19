// Framework Resources
import { Roles } from 'meteor/alanning:roles'

// configures roles accourding to the new version 3.0 of roles package
// https://github.com/Meteor-Community-Packages/meteor-roles#roles-naming
/**
 * Configures three Roles: 'Admin', 'Editor', 'Viewer'
 */
export const configureRoles = () => {
	// administrators with access to /admin routes and methods
	Roles.createRole('Admin', { unlessExists: true })

	// For all users under an account, that should have ability to edit reports
	Roles.createRole('Editor', { unlessExists: true })

	// For all sub users under an account, that should only be able to view reports
	Roles.createRole('Viewer', { unlessExists: true })
}