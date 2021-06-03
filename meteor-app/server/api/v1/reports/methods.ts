import { Meteor } from "meteor/meteor";
import { _ } from "meteor/underscore";
import { v4 as uuidv4 } from 'uuid';
import math, { string } from 'mathjs'
import { Report_Data, Report_Structures } from '../../../../imports/api/collections';
import { ReportStructure, ReportData, Table, TableRow, TableColumn, FormulaValue } from '../../../../imports/api/types/reports'
import { getUserDetails } from "./functions";
import { check, Match } from 'meteor/check'

Meteor.methods({

	/*
		Used to create a new report data, from rest API
		TODO: restrict to account and user roles
	*/
	Insert_Report_Data: function(json) {
		check(json, Match.ObjectIncluding({collection_name : String}))
		Report_Data.insert({accountId: 'fyS84mmYeNLqDuaSS', ...json})
	},

	/*
		Used to fetch distinct collection names belonging to an account
		TODO: restrict to user roles
	*/
	Fetch_Collection_Names: function() {
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
	// export interface ReportStructure {
	// 	_id: string | null | undefined; // the mongoId of the report object

	// 	name: string;
	// 	tables: Array<Table>; // all the tables within a report
	// 	formulas: Array<Formula>; // the formulas to process when viewing a report
	// 	public: boolean;	// makes all tables in report public
	// 	tags: Array<string>; // These are the permissable tags for viewers
	// }
	// export interface Table {
	// 	id: string; // unique id of the table within a report
	// 	title: string; // title that is used for display
	// 	type: string; // collection - a table that uses a collection for generating rows. static - user defined dimensions, non looping
	// 	columns: Array<TableColumn>; // the columns within a table
	// 	rows: Array<TableRow>; // the rows within a table, if type: collection, rows are generated, if type:static, rows are pre defined by user
	// 	collection: string; // the collection used if table is collection driven
	// 	sort_by: string; // defines how the data should be sorted when viewing a report
	// }
	// export interface TableColumn {
	// 	id: string; // the uuid of the column within a table
	// 	label: string; // used for display
	// 	formulaId?: string; // if the column has a formula applied to it
	// 	property: string; // the property of a mongo object, from collection driven tables
	// 	collection_name: string; // the collection the property belongs to
	// 	relation_key?: string; // a key name that outlines a relationship to other collection objects
	// 	enum: string; // defines the intended enumeration for the cell under a column
	// 	symbol?: string;
	// }
	// export interface TableRow {
	// 	id: string; // the uuid of the row
	// 	cells: Array<TableCell>; // there should be a cell for each column
	// }
	// export interface TableCell {
	// 	id: string; // a uuid for the cell
	// 	index: number; // the index of a cell within a row
	// 	type: string; // input - whatever the user typed, formula - a user crafted formula, property - a property from a document within a collection
	// 	property: string; // if type is "property", we store the designated property name here
	// 	propertyValue: string | number | null; // we store values of properties here, which are used with query modifiers
	// 	value: string; // either what the user typed, or the output of a a formula
	// 	expression?: string; // the mathmatical expression that was calculated with math.evaluate()
	// }
	// export interface Formula {
	// 	id: string; // the uuid of the formula in a given report
	// 	tableId: string; // the id of the table, the formula belongs to
	// 	columnId: string; // the column the formula should be applied to
	// 	columnIndex: number; // the index of the column, the formula runs for. Used for applying results to row cells
	// 	expression: string; // the mathmatical expression to be calculated with math.evaluate()
	// 	values: Array<FormulaValue>; // an array of values, that need to be calculated
	// }
	// export interface FormulaValue {
	// 	key: string; // points to a position in the formula, id like string xxxxxxxxxxxxxxxxxx
	// 	type: string; // query - "a mongo query", query_count - "a number of objects from a query", pointer - 'grabs the value of another cell or field in the table'
	// 	operation: string; // sum, min, max, mean - "math.sum, math.min, ..."
	// 	collection_name: string; // user defined collection, used for display purposes
	// 	queryModifier?: string; // a modifier for a query, selected from the collection that drives the table
	// 	query: FormulaQuery; // a json formatted query object for slamming into mongo.find().fetch()
	// 	property: string; // the property we want to use, when fetching objects in a collection
	// 	path?: string; // the path traversal for a document fetched by a mongo query
	// 	columnId?: string; // the column targeted, if type is "pointer"
	// 	cellIndex?: number; // used to fetch a value from a cell that has already been calculated
	// }
	
	// export interface FormulaQuery {
	// 	[key: string]: string | number | null;
	// }
	
	// export interface ReportData {
	// 	_id: string | undefined;
	// 	collection_name: string;
	// 	viewer_id?: string;
	// 	[key: string]: string | number | Object | null | undefined;
	
	// }
	Upsert_Report: function(report: ReportStructure) {
		console.log('report: ', report)
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

		let user = getUserDetails(Meteor.user())

		let report: ReportStructure | null | undefined = null;

		const setReportToDisplay = () => {
			report = Report_Structures.findOne({ _id: reportId, account_id: user?.account_id })
		}

		// used to generate rows, if table is collection driven
		const performQuery = (collection: string) => {
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

		// generates cells, for a given row, if table is collection driven
		const generateCells = (columns: Array<TableColumn>, document: ReportData) => {

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
			// if type is "static", the rows should already be defined
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