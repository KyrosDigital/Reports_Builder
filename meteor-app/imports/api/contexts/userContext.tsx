import { Meteor } from 'meteor/meteor'
import React, { createContext } from 'react'
import { withTracker } from 'meteor/react-meteor-data'

export const UserContext = createContext({ user: {}, userId: '', role: '', viewer_id: '', tags: [''], isLoggedIn: false })

export const withAccount = withTracker((props) => {
	let viewer_id = '', account_id
	let tags = []
	const user = Meteor.isServer ? null : Meteor.user()
	if (user) {
		viewer_id = user.profile.viewer_id
		tags = user.profile.tags
		account_id = user.profile.account_id
	}
	const userId = Meteor.isServer ? null : Meteor.userId()
	const roleAssignment = Meteor.roleAssignment.findOne({ 'user._id': userId })
	let role = roleAssignment?.role?._id



	return {
		user,
		userId,
		role,
		viewer_id,
		account_id,
		tags,
		isLoggedIn: !!userId
	}
})

function Provider(props) {
	return <UserContext.Provider value={props}>
		{props.children}
	</UserContext.Provider>
}

export const UserProvider = withAccount(Provider)
export const UserConsumer = UserContext.Consumer
