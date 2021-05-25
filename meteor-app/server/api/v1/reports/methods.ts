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
	*/
	Insert_Report_Data: function(json) {
		Report_Data.insert({accountId: 'fyS84mmYeNLqDuaSS', ...json})
	},

	/*
		Used to fetch distinct collection names belonging to an account
		TODO: restrict to account and user roles
	*/
	Fetch_Collection_Names: function() {
		let distinct = _.uniq(Report_Data.find({}, {
			sort: {collectionName: 1}, fields: {collectionName: 1}
		}).fetch().map(function(x) {
				return x.collectionName;
		}), true);
	return distinct
	},

	/*
		Used to create a new report, or to update one
	*/
	Upsert_Report: function(report: ReportStructure) {
		let action = null;
		if(!report._id) {
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
			report = Report_Structures.findOne({_id: reportId})
		}

		// used to generate rows, if table is collection driven
		const performQuery = (collection: string) => {
			if (report.public || user.role === 'Editor') {
        return Report_Data.find({
					account_id: user.account_id,
          collectionName: collection 
        }).fetch()
      } else { // must be viewer if not editor. Will need to change if more roles are added
        return Report_Data.find({
					account_id: user.account_id,
          collectionName: collection,
					$or: [{ viewer_id: user.viewer_id }, { viewer_id: { $exists: false } }]
        }).fetch()
			}
		}

		// generates cells, for a given row, if table is collection driven
		const generateCells = (columns: Array<TableColumn>, document: ReportData) => {
			return columns.map((column, i) => {
				let type = '', property = null, propertyValue = null, value: number | Object| string | null | undefined = 0;
				// a column should only have either a formula, or a property assigned, never both
				property = column.property
				propertyValue = document[property]
				if(!column.formulaId) {
					type = 'property'
					value = document[property]
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
			// return the mutated report, containing the accurate values to display
			return report
		}

		return run()
	}

})