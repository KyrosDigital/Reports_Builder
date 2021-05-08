import { Meteor } from 'meteor/meteor';
// import { Mongo } from 'meteor/mongo';
import { StrapiClientDataCollection } from '../../imports/api/collections';

Meteor.publish('Types', function () {
	// const _id = new Mongo.ObjectID("609584fde9b5eb05f54c0787");
	// const _id = Mongo.ObjectID._str
	return StrapiClientDataCollection.find()
})