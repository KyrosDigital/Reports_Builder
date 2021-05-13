import { Mongo } from 'meteor/mongo';

import { Report } from './types/reports'

export interface StrapiUsers {
  _id?: string;
  confirmed: boolean;
  blocked: boolean;
  username: string;
	email: string;
	password: string;
	provider: string;
	createdAt: Date;
	updatedAt: Date;
	__v: number;
	created_by?: string;
	role?: string;
	updated_by?: string; 
}

export const StrapiUsersCollection = new Mongo.Collection<StrapiUsers>('users-permissions_user');

export interface ClientData {
	// [key: string]: string | number | Object | null | undefined;
  _id?: string;
  data: ClientDataObject;
	collectionName: string;
	userId: string;
	published_at?: string;
	createdAt: Date;
	updatedAt: Date;
	__v: number;
	created_by?: string;
	updated_by?: string; 
}

export interface ClientDataObject {
	[key: string]: string | number | null | undefined;
}

export const StrapiClientDataCollection = new Mongo.Collection<ClientData>('client_data');

export const StrapiClientCollectionNames = new Mongo.Collection('collection_names');

export const Report_Structure_Collection = new Mongo.Collection<Report>('Report_Structure_Collection');
