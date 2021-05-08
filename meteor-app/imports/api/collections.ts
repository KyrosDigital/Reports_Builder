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

export interface ClientData {
  _id?: string;
  data: Object;
	collectionName: string;
	userId: string;
	published_at?: string;
	createdAt: Date;
	updatedAt: Date;
	__v: number;
	created_by?: string;
	updated_by?: string; 
}

export const StrapiClientDataCollection = new Mongo.Collection<ClientData>('client_data');

export interface ReportStructure {
  _id: string;
	tables: [];
}

export const Report_Structure_Collection = new Mongo.Collection<ReportStructure>('Report_Structure_Collection');
