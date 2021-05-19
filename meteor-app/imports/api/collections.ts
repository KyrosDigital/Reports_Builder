import { Mongo } from 'meteor/mongo';

// import types
import { Account } from './types/accounts'
import { ReportStructure, ReportData } from './types/reports'

// declare collections
export const Client_Accounts = new Mongo.Collection<Account>('Client_Accounts');

export const Report_Data = new Mongo.Collection<ReportData>('Report_Data');

export const Report_Structures = new Mongo.Collection<ReportStructure>('Report_Structures');
