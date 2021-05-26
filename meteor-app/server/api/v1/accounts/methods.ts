import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles'
import { Client_Accounts } from "/imports/api/collections"
import { getUserDetails } from "../reports/functions";
import { getAccount } from "./functions";

Meteor.methods({


	Get_User_Role: function () {
		if (this.userId) {
			return Roles.getRolesForUser(this.userId)[0]
		}
	},

	Create_Account: function () {

	},

	// used in api, retrieves the client account
	Fetch_Account: function (jwt) {
		if (jwt) {
			return Client_Accounts.findOne({ jwt })
		}
	},

	// used in meteor server, to access a client account object for a given user
	Fetch_Account_For_User: function () {
		return getAccount(this.userId)
	},

	Get_Tags: function () {
		let account = getAccount(this.userId)
		return account?.tags
	},

	// used in api, retrieves the client account
	Update_Account: function (jwt, name) {
		if (jwt && name) { // Update tags
			const update = Client_Accounts.update({ jwt }, { $set: { name: name, updated_at: new Date() } })
			if (update) return Client_Accounts.findOne({ jwt })
		}
	},

	Create_Editor_User: function () {

	},

	// used in api, creates a viewer user under an account
	Create_Viewer_User: function (jwt, json) {
		return new Promise<string>((resolve, reject) => {

			const accountId = Client_Accounts.findOne({ jwt })?._id
			if (!accountId) reject('Failed to locate client account')

			json.profile.accountId = accountId

			let newUserId = null

			try {
				newUserId = Accounts.createUser(json)
			} catch (error) {
				reject(error)
			}

			if (newUserId) {
				console.log(`Create_Viewer_User - Viewer user created: ${newUserId}`)
				resolve(newUserId)
			} else {
				reject('Failed to create Viewer user!!')
			}

		}).then(userId => {
			if (userId) {
				Roles.addUsersToRoles(userId, 'Viewer')
				return userId
			}
		}).then(userId => {
			const checkRole = Roles.userIsInRole(userId, ['Viewer'])
			console.log('Check if user is in Role "Viewer": ', checkRole)
			if (checkRole) return userId
		}).then(userId => {
			return Meteor.users.findOne({ _id: userId })?.username
		})
	},

	Fetch_Viewer_User: function () {

	},

	Fetch_Viewers_For_Account: function () {
		if (this.userId && Roles.userIsInRole(this.userId, ['Editor'])) {
			let accountId = Meteor.users.findOne({ _id: this.userId })?.profile.accountId
			return Meteor.users.find({ 'profile.accountId': accountId }).fetch()
		}
	},

	Modify_Viewer_User_Profile: function () {

	}

})