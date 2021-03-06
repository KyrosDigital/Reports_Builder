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
					tags: ['agent', 'manager']
				}

				account.jwt = jwt.sign(account, Meteor.settings.private.jwt_secret);

				const account_id = Client_Accounts.insert(account)

				if (account_id) {
					console.log(`Seeder - Account created: ${account_id}`)
					resolve(account_id)
				} else {
					reject('Failed to create Account!!')
				}
			})
		}

		const createEditor = (account_id, username, email, first_name, last_name) => {
			return new Promise((resolve, reject) => {
				const newUserId = Accounts.createUser({
					username: username,
					email: email,
					password: 'password',
					profile: {
						first_name: first_name,
						last_name: last_name,
						account_id: account_id,
						tags: [],
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

		const createViewers = (account_id, viewer_id, tag, username, email, first_name, last_name) => {
			return new Promise((resolve, reject) => {
				const newUserId = Accounts.createUser({
					username: username,
					email: email,
					password: 'password',
					profile: {
						first_name: first_name,
						last_name: last_name,
						account_id: account_id,
						tags: [tag],
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

		const createReportData = (data) => {
			return new Promise((resolve, reject) => {
				const newObjectId = Report_Data.insert({
					...data
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
			const account_id = await createAccount('City2Shore')
			await createEditor(account_id, 'NathanJean', 'nathan@c2s.com', 'Nate', 'Jean')
			await createViewers(account_id, 'xxxyyyzzz', 'agent', 'CraigGeers', 'craig@c2s.com', 'Craig', 'Geers')
			await createViewers(account_id, 'bbbcccaaa', 'manager', 'ShelleyFrody', 'shelly@c2s.com', 'Shelley', 'Frody')
			await createReportData({ account_id, collection_name: 'Transactions', price: 500, viewer_id: 'xxxyyyzzz', date: new Date(2021, 03, 02), commission: .5, agent_id: 'qqqwwweee' })
			await createReportData({ account_id, collection_name: 'Transactions', price: 100, viewer_id: 'xxxyyyzzz', date: new Date(2021, 03, 01), commission: .1, agent_id: 'qqqwwweee' })
			await createReportData({ account_id, collection_name: 'Transactions', price: 200, viewer_id: 'bbbcccaaa', date: new Date(2021, 04, 01), commission: .25, agent_id: 'rrreeewww' })
			await createReportData({ account_id, collection_name: 'Transactions', price: 300, viewer_id: 'bbbcccaaa', date: new Date(2021, 04, 02), commission: 1, agent_id: 'rrreeewww' })
			await createReportData({ account_id, collection_name: 'Agents', viewer_id: 'xxxyyyzzz', first_name: 'Craig', last_name: 'Geers', agent_id: 'qqqwwweee' })
			await createReportData({ account_id, collection_name: 'Agents', viewer_id: 'bbbcccaaa', first_name: 'Shelley', last_name: 'Frody', agent_id: 'rrreeewww' })
		}

		run()

	} else {
		console.log("Skipping seed of users and data, as it already exists.")
	}
}