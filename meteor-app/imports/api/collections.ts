import { Mongo } from 'meteor/mongo';

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

export interface Types {
  _id?: string;
  type: Object;
	CollectionName: string;
	uid: string;
	published_at?: string;
	createdAt: Date;
	updatedAt: Date;
	__v: number;
	created_by?: string;
	updated_by?: string; 
}

export const StrapiTypesCollection = new Mongo.Collection<Types>('types');


