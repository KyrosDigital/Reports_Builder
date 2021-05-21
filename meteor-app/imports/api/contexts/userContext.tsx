import { Meteor } from 'meteor/meteor'
import React, { createContext } from 'react'
import { withTracker } from 'meteor/react-meteor-data'

export const UserContext = createContext({user: {}, userId: '', role: '', isLoggedIn: false})

export const withAccount = withTracker((props) => {
  const user = Meteor.isServer ? null : Meteor.user()
  const userId = Meteor.isServer ? null : Meteor.userId()
	const roleAssignment = Meteor.roleAssignment.findOne({ 'user._id': userId })
	let role = roleAssignment?.role?._id
	
  return {
    user,
    userId,
		role,
    isLoggedIn: !!userId
  }
})

function Provider (props) {
  return <UserContext.Provider value={props}>
    {props.children}
  </UserContext.Provider>
}

export const UserProvider = withAccount(Provider)
export const UserConsumer = UserContext.Consumer