import { Meteor } from "meteor/meteor"

import { Client_Accounts, Report_Data } from "/imports/api/collections"

export const seedUserData = () => {
	if (Meteor.users.find().count() === 0) {

		const jwt = require('jsonwebtoken')

		const createAccount = (accountName) => {
			return new Promise((resolve, reject) => {

				const account = {
					name: accountName,
					created_at: new Date(),
					updated_at: null,
				}

				account.jwt = jwt.sign(account, Meteor.settings.private.jwt_secret);

				const accountId = Client_Accounts.insert(account)

				if (accountId) {
					console.log(`Seeder - Account created: ${accountId}`)
					resolve(accountId)
				} else {
					reject('Failed to create Account!!')
				}
			})
		}

		const createEditor = (accountId, username, email, first_name, last_name) => {
			return new Promise((resolve, reject) => {
				const newUserId = Accounts.createUser({
					username: username,
					email: email,
					password: 'password',
					profile: {
						first_name: first_name,
						last_name: last_name,
						accountId: accountId,
						viewer_id: null
					}
				})

				if (newUserId) {
					console.log(`Seeder - Editor user created: ${newUserId}`)
					resolve(newUserId)
				} else {
					reject('Failed to create Editor user!!')
				}

			}).then(userId => {
				if (userId) {
					Roles.addUsersToRoles(userId, 'Editor')
					return userId
				}
			}).then((userId) => {
				const checkRole = Roles.userIsInRole(userId, ['Editor'])
				console.log('Check if user is in Role "Editor": ', checkRole)
			})
		}

		const createViewers = (accountId, viewer_id, username, email, first_name, last_name) => {
			return new Promise((resolve, reject) => {
				const newUserId = Accounts.createUser({
					username: username,
					email: email,
					password: 'password',
					profile: {
						first_name: first_name,
						last_name: last_name,
						accountId: accountId,
						viewer_id: viewer_id
					}
				})

				if (newUserId) {
					console.log(`Seeder - View user created: ${newUserId}`)
					resolve(newUserId)
				} else {
					reject('Failed to create Viewer user!!')
				}

			}).then(userId => {
				if (userId) {
					Roles.addUsersToRoles(userId, 'Viewer')
					return userId
				}
			}).then((userId) => {
				const checkRole = Roles.userIsInRole(userId, ['Viewer'])
				console.log('Check if user is in Role "Viewer": ', checkRole)
			})
		}

		const createReportData = (accountId, price, viewer_id) => {
			return new Promise((resolve, reject) => {
				const newObjectId = Report_Data.insert({
					accountId: accountId,
					collectionName: 'Transactions',
					viewer_id: viewer_id,
					price: price
				})

				if (newObjectId) {
					console.log(`Seeder - Report Data created: ${newObjectId}`)
					resolve(newObjectId)
				} else {
					reject('Failed to create Report_Data!!')
				}
			})
		}


		const run = async () => {
			const accountId = await createAccount('City2Shore')
			await createEditor(accountId, 'NathanJean', 'nathan@c2s.com', 'Nate', 'Jean')
			await createViewers(accountId, 'xxxyyyzzz', 'CraigGeers', 'craig@c2s.com', 'Craig', 'Geers')
			await createViewers(accountId, 'bbbcccaaa', 'ShelleyFrody', 'shelly@c2s.com', 'Shelley', 'Frody')
			await createReportData(accountId, 500, 'xxxyyyzzz')
			await createReportData(accountId, 100, 'xxxyyyzzz')
			await createReportData(accountId, 200, 'bbbcccaaa')
			await createReportData(accountId, 300, 'bbbcccaaa')
		}

		run()

	} else {
		console.log("Skipping seed of users and data, as it already exists.")
	}
}