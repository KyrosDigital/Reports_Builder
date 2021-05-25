import { Meteor } from "meteor/meteor"

import { Client_Accounts, Report_Data } from "/imports/api/collections"

export const seedUserData = () => {
	if (Meteor.users.find().count() === 0) {

		const jwt = require('jsonwebtoken')

		const createAccount = () => {
			return new Promise((resolve, reject) => {

				const account = {
					name: 'City2Shore',
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

		const createEditor = (accountId) => {
			return new Promise((resolve, reject) => {
				const newUserId = Accounts.createUser({
					username: 'NathanJean',
					email: 'nathan@c2s.com',
					password: 'password',
					profile: {
						first_name: 'Nathan',
						last_name: 'Jean',
						accountId: accountId,
						viewer_id: ''
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

		const createViewers = (accountId) => {
			return new Promise((resolve, reject) => {
				const newUserId = Accounts.createUser({
					username: 'CraigGeers',
					email: 'craig@c2s.com',
					password: 'password',
					profile: {
						first_name: 'Craig',
						last_name: 'Geers',
						agentId: 'xxxyyyzzz',
						accountId: accountId,
						viewer_id: '2',
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

		const createReportData = (accountId) => {
			return new Promise((resolve, reject) => {
				const newObjectId = Report_Data.insert({
					accountId: accountId,
					collectionName: 'Transactions',
					viewer_id: '2',
					agentId: 'xxxyyyzzz',
					price: 1500.00
				})

				if (newObjectId) {
					console.log(`Seeder - Report Data created: ${newObjectId}`)
					resolve(newObjectId)
				} else {
					reject('Failed to create Viewer user!!')
				}

				newObjectId = Report_Data.insert({
					accountId: accountId,
					collectionName: 'Transactions',
					viewer_id: '3',
					agentId: 'xxxyyyzzz',
					price: 700.00
				})

				if (newObjectId) {
					console.log(`Seeder - Report Data created: ${newObjectId}`)
					resolve(newObjectId)
				} else {
					reject('Failed to create Viewer user!!')
				}

				const newObjectId2 = Report_Data.insert({
					accountId: accountId,
					collectionName: 'Transactions',
					viewer_id: 'xxxyyyzzz',
					agentId: '2',
					price: 750.00
				})

				if (newObjectId2) {
					console.log(`Seeder - Report Data created: ${newObjectId2}`)
					resolve(newObjectId2)
				} else {
					reject('Failed to create Viewer user!!')
				}

				newObjectId2 = Report_Data.insert({
					accountId: accountId,
					collectionName: 'Transactions',
					agentId: '2',
					price: 1200.00
				})

				if (newObjectId2) {
					console.log(`Seeder - Report Data created: ${newObjectId2}`)
					resolve(newObjectId2)
				} else {
					reject('Failed to create Viewer user!!')
				}
			})
		}


		const run = async () => {
			const accountId = await createAccount()
			await createEditor(accountId)
			await createViewers(accountId)
			await createReportData(accountId)
		}

		run()

	} else {
		console.log("Skipping seed of users and data, as it already exists.")
	}
}