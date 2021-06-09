import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles'
import { Client_Accounts, Report_Data } from "/imports/api/collections"
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

	// finds all report data and returns and object with keys as the collection names
	Fetch_Data: function () {
		// TODO: add enforce roles
		let account_obj = getAccount(this.userId)
		let account = account_obj._id
		let data = {}
		Report_Data.find({ 'account_id' : account}).forEach((document) => {
			let {collection_name, account_id, _id, ...rest} = document
			if (data.hasOwnProperty(document.collection_name)) {
				data[document.collection_name].push(rest)
			} else {
				data[document.collection_name] = [rest]
			}
		})
		return data
		// return Report_Data.rawCollection().aggregate([
		// 		{$match: {account_id: '$account_id'}},
		// 		{$group: {_id: '$collection_name'}}
		// ])
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

	// used in report builder to assign viewer tags
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