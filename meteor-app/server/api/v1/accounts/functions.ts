import { Meteor } from "meteor/meteor";
import { Client_Accounts } from "/imports/api/collections"
import { Accounts } from 'meteor/accounts-base';

export const getAccount = (userId) => {
	if (userId) {
		const user = Meteor.users.findOne({ _id: userId })
		const accountId = user?.profile.account_id
		if (accountId) {
			return Client_Accounts.findOne({ _id: accountId })
		} 
	} 
}