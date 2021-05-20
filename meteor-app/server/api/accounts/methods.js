import { Meteor } from "meteor/meteor";
import { Client_Accounts } from "/imports/api/collections";

Meteor.methods({

	Create_Account: function() {

	},

	// used in api, retrieves the client account
	Fetch_Account: function(jwt) {
		if(jwt) {
			return Client_Accounts.findOne({jwt})
		}
	},

	// used in meteor server, to access a client account object for a given user
	Fetch_Account_For_User: function() {
		if(this.userId) {
			const user = Meteor.users.findOne({_id: userId})
			const accountId = user.profile.accountId
			if(accountId) {
				return Client_Accounts.findOne({_id: accountId})
			}
		}
	},

	// used in api, retrieves the client account
	Update_Account: function(jwt, name) {
		if(jwt && name) {
			const update = Client_Accounts.update({jwt}, {$set: {name: name, updated_at: new Date()}})
			if(update) return Client_Accounts.findOne({jwt})
		}
	},

	Create_Editor_User: function() {

	},

	Create_Viewer_User: function(jwt, json) {
		return new Promise((resolve, reject) => {

			const accountId = Client_Accounts.findOne({jwt})._id

			json.profile.accountId = accountId

			let newUserId = null 
			
			try {
				newUserId = Accounts.createUser(json)
			} catch (error) {
				reject(error)
			}
			
			if(newUserId) {
				console.log(`Create_Viewer_User - Viewer user created: ${newUserId}`)
				resolve(newUserId)
			} else {
				reject('Failed to create Viewer user!!')
			}
			
		}).then(userId => {
			if(userId) {
				Roles.addUsersToRoles(userId, 'Viewer')
				return userId
			}
		}).then((userId) => {
			const checkRole = Roles.userIsInRole(userId, ['Viewer'])
			console.log('Check if user is in Role "Viewer": ', checkRole)
			if(checkRole) return userId
		}).then(userId => {
			return Meteor.users.findOne({_id: userId})
		})
	},

	Fetch_Viewer_User: function() {

	},

	Modify_Viewer_User_Profile: function() {
		
	} 

})