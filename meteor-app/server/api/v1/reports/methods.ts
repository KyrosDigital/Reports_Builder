import { Meteor } from "meteor/meteor";
import { _ } from "meteor/underscore";
import { v4 as uuidv4 } from 'uuid';
import math from 'mathjs'
import { Report_Data, Report_Structures } from '../../../../imports/api/collections';
import { ReportStructure, ReportData, Table, TableRow, TableColumn, FormulaValue } from '../../../../imports/api/types/reports'
import { getUserDetails } from "./functions";

Meteor.methods({

	/*
		Used to create a new report data, from rest API
		TODO: restrict to account and user roles
	*/
	Insert_Report_Data: function(json) {
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
				// literal document in collection
				let doc = document

				let type = '', property = null, propertyValue = null, value: number | Object| string | null | undefined = 0;

				// if there is a relation key, we overide the document from table collection, to the column specific collection
				// if (column.relation_key) {
				// 	// query used as the WHERE for the mongo find
				// 	let query = {
				// 		account_id: user.account_id,
				// 		// query from column collection
				// 		collection_name: column.collection_name,
				// 	}
				// 	// if report is private, add viewer_id to field for another WHERE filter
				// 	if (!report.public && user.role === 'Viewer') {
				// 		query['viewer_id'] = user.viewer_id
				// 	}
				// 	// set relation key to match whatever column was supposed to be queried
				// 	// query['viewer_id'] = doc['viewer_id']
				// 	// WHERE A.viewer_id = T.viewer_id
				// 	// must have matching key for this to work
				// 	query[column.relation_key] = doc[column.relation_key]
				// 	doc = Report_Data.findOne(query)

					/*
					this loops thru every document in transactions becuase the table is transactions driven. It will normally just query 
					from the table collection, but since there is a relation key, it queries the document from the column collection
					with the relation key value from the original transactions document, therefore "joining" them. In this way, 
					relation key must be common among both, otherwise will return nothing
					*/
				


				// auto assign relation key for table join
				if (column.collection_name != doc.collection_name) {
					// query used as the WHERE for the mongo find
					let query = {
						account_id: user.account_id,
						collection_name: column.collection_name,
					}
					// if report is private, add viewer_id to field for another WHERE filter
					if (!report.public && user.role === 'Viewer') {
						query['viewer_id'] = user.viewer_id
					}
					// set relation key to be whatever similar key, most likely viewer_id
					// assume all docs in collection have same format
					let column_collection = Report_Data.findOne({
																	account_id: user.account_id,
																	collection_name: column.collection_name
																})
					let {_id, collection_name, account_id, ...filtered_column_collection} = column_collection
					let column_collection_keys = Object.keys(filtered_column_collection)
					let doc_keys = Object.keys(doc)
					let shared_key = column_collection_keys.filter(key => doc_keys.includes(key))
					if (shared_key.length) {
						query[shared_key[0]] = doc[shared_key[0]]
					}
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

				// each row in table
				table.rows.forEach(row => {

					let expression = '';

					// run through each formula
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

