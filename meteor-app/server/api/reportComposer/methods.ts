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
				let type = '', value = 0;
				if(column.property) {
					type = 'property'
					value = document.data[column.property]
				}
				if(column.formulaId) {
					type = 'formula'
				}
				return { index: i, type: type, value: value }
			})
		}

		// generates rows within a table, if collection driven
		const generateRows =  (table: []) => {
			// if type is "static", the rows should already be defined
			if(table.type === 'collection') {
				const collection = performQuery(table.collection)
				return collection.map(document => ({
					id: uuidv4(),
					cells: generateCells(table.columns, document)
				}))
			} else {
				return table.rows;
			}
		}

		const computeFormulas = async (report) => {
			// run for each table, ensuring proper amount of rows
			await report.tables.map((table: []) => {
				table.rows = generateRows(table)
				return table
			});

			// perform logic on tables, to compile the data to be displayed
			await report.formulas.map(formula => {

				console.log("Before: ", formula.originalExpression)

				// individually process each value, for the final expression
				formula.values.map(value => {

					if(value.type === 'query') {
						const query = StrapiClientDataCollection.find(value.query).fetch()

						if(value.operation === 'sum') {
							let values = query.map(obj => obj.data[value.property])
							formula.expression = formula.expression.replace(value.key, math.sum(values))
						}

					}

					if(value.type === 'query_count') {
						const count = StrapiClientDataCollection.find(value.query).count()
						formula.expression = formula.expression.replace(value.key, count)
					}

				})

				// evaluate the expression, after the values have been harvested
				formula.result = math.evaluate(formula.expression)	
				console.log("After: ", formula.expression)
				console.log("Eval: ", formula.result, "\n\n" )
			})
		}

		const applyFormulasToTables = async (report) => {

			// map over formulas
			// determine where the result should be applied
			// apply the result to the correct cell, within a row

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

			await computeFormulas(report)
			await applyFormulasToTables(report)
			// return the mutated report, containing the accurate values to display
			return report

		}

		return run()
	}

})

