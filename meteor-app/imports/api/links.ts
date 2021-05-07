import { Mongo } from 'meteor/mongo';

export interface DummyType {
  _id?: string;
  title: string;
  url: string;
  createdAt: Date;
}

export const DummyCollection = new Mongo.Collection<DummyType>('DummyCollection');
