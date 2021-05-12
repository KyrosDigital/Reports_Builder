export interface Formula {
	id: string; // the uuid of the formula in a given report
	tableId: string; // the id of the table, the formula belongs to
	columnId: string; // the column the formula should be applied to
	cellIndex: number; // the index for a cell, under a column, within a row
	expression: string; // the mathmatical expression to be calculated
	evaluatedExpression: string; // the string that was evaluated with math.evaluate()
	values: Array<FormulaValue>; // an array of values, that need to be calculated
}

export interface FormulaValue {
	key: string; // points to a position in the formula, id like string xxxxxxxxxxxxxxxxxx
	type: string; // query - "a mongo query", query_count - "a number of objects from a query", pointer - 'grabs the value of another cell or field in the table'
	operation: string; // sum, min, max, mean - "math.sum, math.min, ..."
	collectionName: string; // user defined collection, used for display purposes
	query: Object; // a json formatted query object for slamming into mongo.find().fetch()
	path?: string; // the path traversal for a document fetched by a mongo query
	columnId?: string; // the column targeted, if type is "pointer"
	cellIndex?: number; // used to fetch a value from a cell that has already been calculated
}

export interface TableColumn {
	id: string; // the uuid of the column within a table
	label: string; // used for display
	formulaId: string; // if the column has a formula applied to it
}

export interface TableRow {
	id: string; // the uuid of the row
	cells: []; // there should be a cell for each column
}

export interface TableCell {
	index: number; // the index of a cell within a row
	type: string; // input - whatever the user typed, formula - a user crafted formula
	value: string; // either what the user typed, or the output of a a formula
}