import { Meteor } from "meteor/meteor";
import { Roles } from 'meteor/alanning:roles'

export const getUserDetails = (user) => {
	if (!user) throw new Meteor.Error('getUserDetails - user undefined')

	let viewer_id = null, account_id = null, role = null;

	if (user) {
		viewer_id = user['profile']['viewer_id']
		account_id = user['profile']['account_id']
		role = Roles.getRolesForUser(user._id)[0]

		return {
			user,
			viewer_id,
			account_id,
			role
		}
	}
}