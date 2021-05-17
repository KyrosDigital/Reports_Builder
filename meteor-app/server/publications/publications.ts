import { Meteor } from 'meteor/meteor';
// import { Mongo } from 'meteor/mongo';
import { StrapiClientDataCollection, StrapiClientCollectionNames, Report_Structure_Collection } from '../../imports/api/collections';


Meteor.publish('ClientData', function () {
	// const _id = new Mongo.ObjectID("609584fde9b5eb05f54c0787");
	// const _id = Mongo.ObjectID._str
	return StrapiClientDataCollection.find()
})

Meteor.publish('CollectionNames', function () {
	// const _id = new Mongo.ObjectID("609584fde9b5eb05f54c0787");
	// const _id = Mongo.ObjectID._str
	return StrapiClientCollectionNames.find()
})

Meteor.publish('ReportStructure', function () {
	// const _id = new Mongo.ObjectID("609584fde9b5eb05f54c0787");
	// const _id = Mongo.ObjectID._str
	return Report_Structure_Collection.find()
})