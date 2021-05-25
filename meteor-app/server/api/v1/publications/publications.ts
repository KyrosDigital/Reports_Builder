import { Meteor } from 'meteor/meteor';
import { Report_Data, Report_Structures } from '../../../../imports/api/collections';

// TODO: retrict to account ownership of user
Meteor.publish('AccountViewers', function () {
	if (this.userId && Roles.userIsInRole(this.userId, ['Editor'])) {
		let account_id = Meteor.users.findOne({ _id: this.userId })?.profile.account_id
		return Meteor.users.find({ 'profile.account_id': account_id })
	} else {
		this.ready()
	}
})

// TODO: retrict to account ownership of user
Meteor.publish('ReportData', function () {
	return Report_Data.find()
})

// TODO: retrict to account ownership of user and role of Editor
Meteor.publish('ReportStructure', function () {
	if (this.userId) {
    return Report_Structures.find()
	} else {
		this.ready()
	}
})

// publishes the roles assigned to a user who is logged in
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  } else {
    this.ready()
  }
})