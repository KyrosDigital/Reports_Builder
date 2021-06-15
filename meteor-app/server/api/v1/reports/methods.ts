import { Meteor } from "meteor/meteor";
import { _ } from "meteor/underscore";
import { v4 as uuidv4 } from 'uuid';
import math from 'mathjs'
import { Report_Data, Report_Structures } from '../../../../imports/api/collections';
import { ReportStructure, ReportData, Table, TableRow, TableColumn, FormulaValue } from '../../../../imports/api/types/reports'
import { getUserDetails } from "./functions";
import { check, Match } from 'meteor/check'
import { enforceRole } from '../roles/enforceRoles'
import { getAccount } from "../accounts/functions";

Meteor.methods({

	/*
		Used to create a new report data, from rest API
		TODO: restrict to account and user roles
	*/
	Insert_Report_Data: function(json) {
		enforceRole(this.userId, 'Editor')
		let account = getAccount(this.userId)
		check(json, Match.ObjectIncluding({collection_name : String}))
		Report_Data.insert({account_id: account._id, ...json})
	},

	/*
		Used to fetch distinct collection names belonging to an account
		TODO: restrict to user roles
	*/
	Fetch_Collection_Names: function() {
		enforceRole(this.userId, 'Editor')
		const user = getUserDetails(Meteor.user())
		let distinct = _.uniq(Report_Data.find({ account_id: user.account_id }, {
			sort: { collection_name: 1 }, fields: { collection_name: 1 }
		}).fetch().map(function(x) {
			return x.collection_name;
		}), true);
	return distinct
	},

	/*
		Used to fetch distinct collection names belonging to an account
		TODO: restrict to account and user roles
	*/
	Fetch_All_Collection_Keys: function () {
		enforceRole(this.userId, 'Editor')

		const user = getUserDetails(Meteor.user())

		let distinctCollections = _.uniq(Report_Data.find({}, {
			sort: { collection_name: 1 }, fields: { collection_name: 1 }
		}).fetch().map(function (x) {
			return x.collection_name;
		}), true);

		return distinctCollections.map(collection => {
			let keys = []

			let obj = Report_Data.findOne({ account_id: user.account_id, collection_name: collection })

			_.each(obj, function (val, key) {
				if (val) {
					keys.push(key);
				}
			});

			return {
				collection_name: collection,
				keys: keys
			}
		})

	},

	/*
	Used to fetch distinct collection names belonging to an account
	TODO: restrict to account and user roles
*/
	Fetch_Single_Collection_Keys: function (collection_name) {
		enforceRole(this.userId, 'Editor')
		check(collection_name, String)

		const user = getUserDetails(Meteor.user())

		let keys = []

		let obj = Report_Data.findOne({ account_id: user.account_id, collection_name: collection_name })

		_.each(obj, function (val, key) {
			if (val) {
				keys.push(key);
			}
		});

		return {
			collection_name: collection_name,
			keys: keys
		}

	},

	/*
		Used to create a new report, or to update one
	*/
	Upsert_Report: function(report: ReportStructure) {
		enforceRole(this.userId, 'Editor')
		check(report, {_id : Match.Maybe(String), account_id : Match.Maybe(String), name : String, 
			tables : [{id : String, title : String, type : String, 
				columns : [{id : String, label : String, formulaId : Match.Maybe(String), property : Match.Maybe(String), collection_name : String, relation_key : Match.Maybe(String), enum : String, symbol : Match.Maybe(String)}], 
				rows : [{id : String, 
					cells : [{id : String, index : Number, type : String, property : String, propertyValue : String, value : String, expression : String}] }], 
				collection : String, sort_by : String}], 
			formulas : [{id : String, tableId : String, columnId : String, columnIndex : Number, expression : String, 
				// some of the formula types were decided by looking at how they are created in the columnToolBar
				values : [{key : String, type : String, operation : String, collection_name : Match.Maybe(String), queryModifier : String, query : {collection_name : String}, property : Match.Maybe(String), path : Match.Maybe(String), columnId : Match.Maybe(String), cellIndex : Match.Maybe(String)}] }], 
			public : Boolean, tags : [String] })
		const user = getUserDetails(Meteor.user())
		let action = null;
		if(!report._id) {
			report.account_id = user.account_id // set the account_id
			action = Report_Structures.insert(report)
			console.log('Created report', action)
			return Report_Structures.findOne({_id: action})
		}
		if(report._id) {
			action = Report_Structures.update({_id: report._id}, report)
			console.log('Updated report', action)
			return Report_Structures.findOne({_id: report._id})
		}
	},

	/*
		For Viewing a Report

		Determine if table is collection driven, or static
		if collection driven, fetch, and loop
		for each "row", process each column
		if the column has a formula, do the math
		the goal is to populate the rows, and cells within, with correct information
	
		This method, mutates the original report object, and returns it
	*/

	Compose_Report: function(reportId: string) {
		if (!this.userId) {
			throw new Meteor.Error('No Permission', 'user is not logged in')
		}
		check(reportId, String)

		let user = getUserDetails(Meteor.user())

		let report: ReportStructure | null | undefined = null;

		const setReportToDisplay = () => {
			report = Report_Structures.findOne({ _id: reportId, account_id: user?.account_id })
		}

		// used to generate rows, if table is collection driven
		const performQuery = (collection: string) => {
			check(collection, String)
			if (report.public || user.role === 'Editor') {
        return Report_Data.find({
					account_id: user.account_id,
					collection_name: collection
        }).fetch()
      } else { // must be viewer if not editor. Will need to change if more roles are added
        return Report_Data.find({
					account_id: user.account_id,
					collection_name: collection,
					$or: [{ viewer_id: user.viewer_id }, { viewer_id: { $exists: false } }]
        }).fetch()
			}
		}

		// export interface ReportData {
		// 	_id: string | undefined;
		// 	collection_name: string;
		// 	viewer_id?: string;
		// 	[key: string]: string | number | Object | null | undefined;
		
		// }

		// generates cells, for a given row, if table is collection driven
		const generateCells = (columns: Array<TableColumn>, document: ReportData) => {
			check(columns, [{id : String, label : String, formulaId : Match.Maybe(String), property : Match.Maybe(String), collection_name : String, relation_key : Match.Maybe(String), enum : String, symbol : Match.Maybe(String)}])
			check(document, Match.ObjectIncluding({collection_name : String, viewer_id : String}))
			return columns.map((column, i) => {

				let doc = document

				let type = '', property = null, propertyValue = null, value: number | Object| string | null | undefined = 0;

				// if there is a relation key, we overide the document from table collection, to the column specific collection
				if(column.relation_key) {
					let query = {
						account_id: user.account_id,
						collection_name: column.collection_name,
					}
					if (!report.public && user.role === 'Viewer') {
						query['viewer_id'] = user.viewer_id
					}
					query[column.relation_key] = doc[column.relation_key]
					doc = Report_Data.findOne(query)
				}
				// a column should only have either a formula, or a property assigned, never both
				property = column.property
				propertyValue = doc[property]

				if(!column.formulaId) {
					type = 'property'
					value = doc[property]
				}
				if(column.formulaId) {
					type = 'formula'
				}
				return { index: i, id: uuidv4(), type, property, propertyValue, value }
			})
		}

		// generates rows within a table, if collection driven
		const generateRows =  (table: Table) => {
			check(table, {id : String, title : String, type : String, 
				columns : [{id : String, label : String, formulaId : Match.Maybe(String), property : Match.Maybe(String), collection_name : String, relation_key : Match.Maybe(String), enum : String, symbol : Match.Maybe(String)}], 
				rows : [{id : String, 
					cells : [{id : String, index : Number, type : String, property : String, propertyValue : String, value : String, expression : String}] }], 
				collection : String, sort_by : String})
			// if type is "static", the rows should already be defined
			// TODO : allow user to defind rows for static table
			if(table.type === 'collection') {
				const collection = performQuery(table.collection)

				return collection.map((document: ReportData) => ({
					id: uuidv4(),
					cells: generateCells(table.columns, document)
				}))
			} else return table.rows
		}

		const createRowsInTable = () => {
			// run for each table, ensuring proper amount of rows
			report?.tables.forEach((table: Table) => {
				table.rows = <Array<TableRow>> generateRows(table)
				return table
			});
		}

		const sortTables = () => {
			// run for each table, ensuring each table is sorted
			report?.tables.forEach((table: Table) => {
				if (table.sort_by) {
					const sortedRows = table.rows.sort((a, b) => a.cells.find(c => c.property === table.sort_by)?.propertyValue - b.cells.find(c => c.property === table.sort_by)?.propertyValue)
					table.rows = sortedRows
					return table
				}
			})
		}

		const computeFormulas = async () => {
			
			// we must loop over every table, row, so that formula results can be applied to individual cells, under a column
			report?.tables.forEach(table => {

				table.rows.forEach(row => {

					let expression = '';

					report?.formulas.forEach(formula => {
						
						expression = formula.expression;

						console.log("Before: ", formula.expression)
	
						// individually process each value, for the final expression
						formula.values.forEach((value: FormulaValue) => {
	
							if(value.type === 'query') {
	
								if(value.queryModifier) {
									const cellPropertyValue = row.cells[formula.columnIndex].propertyValue
									value.query[value.queryModifier] = cellPropertyValue
								}
								const query = Report_Data.find(value.query).fetch()

								if(value.operation === 'sum') {
									let values = query.map((obj: any) => obj[value.property])
									expression = expression.replace(value.key, math.sum(values))
								}
	
							}
	
							if(value.type === 'query_count') {
								const count = Report_Data.find(value.query).count()
								expression = expression.replace(value.key, String(count))
							}
	
						})
						
						// evaluate the expression, after the values have been harvested
						const result = math.evaluate(expression)
	
						row.cells[formula.columnIndex].value = result
						row.cells[formula.columnIndex].expression = expression

						console.log("After: ", expression)
						console.log("Eval: ", result, "\n\n" )
					})
				})
			})	
		}
		
		const run = async () => {

			setReportToDisplay()

			createRowsInTable()
			await computeFormulas()

			await sortTables()
			// return the mutated report, containing the accurate values to display
			return report
		}

		return run()
	}

})