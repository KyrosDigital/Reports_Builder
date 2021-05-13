import { Meteor } from "meteor/meteor";
import { v4 as uuidv4 } from 'uuid';
import math from 'mathjs'
import { StrapiClientDataCollection } from '../../../imports/api/collections';

Meteor.methods({

	/*
		Determine if table is collection driven, or static
		if collection driven, fetch, and loop
		for each "row", process each column
		if the column has a formula, do the math
		the goal is to populate the rows, and cells within, with correct information
	
		This method, mutates the original report object, and returns it
	*/

	Compose_Report: function(report) {

		let collection = [] // if table is collection driven, this is used.

		// used to generate rows, if table is collection driven
		const performQuery = (collection: string) => {
			return StrapiClientDataCollection.find({
				userId: '60958c98857a7b14acb156d9',
				collectionName: collection,
			}).fetch()
		}

		// generates cells, for a given row, if table is collection driven
		const generateCells = (columns, document) => {
			return columns.map((column, i) => {
				let type = '', property = null, propertyValue = null, value = 0;
				if(!column.formulaId) {
					type = 'property'
					value = document.data[column.property]
				}
				if(column.formulaId) {
					type = 'formula'
				}
					property = column.property
					propertyValue = document.data[column.property]
				return { index: i, type, property, propertyValue, value }
			})
		}

		// generates rows within a table, if collection driven
		const generateRows =  (table: []) => {
			// if type is "static", the rows should already be defined
			if(table.type === 'collection') {
				collection = performQuery(table.collection)
				return collection.map(document => ({
					id: uuidv4(),
					cells: generateCells(table.columns, document)
				}))
			} else {
				return table.rows;
			}
		}

		const createRowsInTable = async (report) => {
			// run for each table, ensuring proper amount of rows
			await report.tables.map((table: []) => {
				table.rows = generateRows(table)
				return table
			});
		}

		const computeFormulas = async (report) => {
			
			// we must loop over every row, so that formula results can be applied to individual cells, under a column

			await report.tables.map(table => {

				table.rows.map(row => {
					// perform logic on tables, to compile the data to be displayed

					let expression = '';

					report.formulas.map(formula => {
						
						expression = formula.expression;

						console.log("Before: ", formula.expression)
	
						// individually process each value, for the final expression
						formula.values.map(value => {
	
							if(value.type === 'query') {
	
								/**
								 * TODO: problem : the formula process, does not calculate on a per row basis
								 * this results in us not being able to use query modifies to get specific data
								 * for a specific row
								 */ 
	
								if(value.queryModifier) {
									const cellPropertyValue = row.cells[formula.columnIndex].propertyValue
									value.query[value.queryModifier] = cellPropertyValue
								}
	
								const query = StrapiClientDataCollection.find(value.query).fetch()

								if(value.operation === 'sum') {
									let values = query.map(obj => obj.data[value.property])
									expression = expression.replace(value.key, math.sum(values))
								}
	
							}
	
							if(value.type === 'query_count') {
								const count = StrapiClientDataCollection.find(value.query).count()
								expression = expression.replace(value.key, count)
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

		const applyFormulasToTables = async (report) => {

			// map over formulas
			// determine where the result should be applied
			// apply the result to the correct cell, within a row

			/**
			 * TODO: problem : we apply a single formula result, to all rows.
			 * We should instead support muliple results, for each row
			 * so that the value is specific to the row's conditions
			 * such as collection, or query modifiers  
			 * 
			 * we could instead, call this within the formula loop, and apply to each row?
			 */

			report.formulas.map(formula => {
				const table = report.tables.find(table => table.id === formula.tableId)
				const tableIndex = report.tables.findIndex(table => table.id === formula.tableId)
				const cellIndex = table.columns.findIndex(col => col.id === formula.columnId)

				report.tables[tableIndex].rows.map(row => (
					row.cells[cellIndex].value = formula.result
				))
			})
		}
		
		const run = async () => {

			await createRowsInTable(report)
			await computeFormulas(report)
			// await applyFormulasToTables(report)
			// return the mutated report, containing the accurate values to display
			return report

		}

		return run()
	}

})

