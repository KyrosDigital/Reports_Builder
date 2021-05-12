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
		const generateCells = (columns) => {
			return columns.map((col, i) => ({
				index: i,
				type: 'formula',
				value: 0
			}))
		}

		// generates rows within a table, if collection driven
		const generateRows =  (table: []) => {
			// if type is "static", the rows should already be defined
			if(table.type === 'collection') {
				const collection = performQuery(table.collection)

				return collection.map(document => ({
					id: uuidv4(),
					cells: generateCells(table.columns)
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
				const output = math.evaluate(formula.expression)	

				console.log("After: ", formula.expression)
				console.log("Eval: ", math.evaluate(formula.expression), "\n\n" )
			})
		}
		
		const run = async () => {

			await computeFormulas(report)
			// return the mutated report, containing the accurate values to display
			return report

		}

		return run()
	}

})
