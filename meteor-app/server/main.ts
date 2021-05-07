import { Meteor } from 'meteor/meteor';
import { StrapiUsersCollection } from '../imports/api/collections';

Meteor.startup(() => {

	console.log(StrapiUsersCollection.find().fetch())

});
