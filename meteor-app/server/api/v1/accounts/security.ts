import { Meteor } from 'meteor/meteor';


export const security = () => {

	// Deny all client-side updates to user documents
	Meteor.users.deny({
		update() { return true; }
	});
	
}

