import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { StrapiTypesCollection } from '../../imports/api/collections';

Meteor.publish('Types', function () {
	// const _id = new Mongo.ObjectID("609584fde9b5eb05f54c0787");
	return StrapiTypesCollection.find()
})