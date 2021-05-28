export interface ReportStructure {
	_id: string | null | undefined; // the mongoId of the report object
	account_id: string; // the account the report belongs to
	name: string;
	tables: Array<Table>; // all the tables within a report
	formulas: Array<Formula>; // the formulas to process when viewing a report
	public: boolean;	// makes all tables in report public
	tags: Array<string>; // These are the permissable tags for viewers
}
export interface Table {
	id: string; // unique id of the table within a report
	title: string; // title that is used for display
	type: string; // collection - a table that uses a collection for generating rows. static - user defined dimensions, non looping
	columns: Array<TableColumn>; // the columns within a table
	rows: Array<TableRow>; // the rows within a table, if type: collection, rows are generated, if type:static, rows are pre defined by user
	collection: string; // the collection used if table is collection driven
	sort_by: string; // defines how the data should be sorted when viewing a report
}
export interface TableColumn {
	id: string; // the uuid of the column within a table
	label: string; // used for display
	formulaId?: string; // if the column has a formula applied to it
	property: string; // the property of a mongo object, from collection driven tables
	enum: string; // defines the intended enumeration for the cell under a column
	symbol?: string;
}
export interface TableRow {
	id: string; // the uuid of the row
	cells: Array<TableCell>; // there should be a cell for each column
}
export interface TableCell {
	id: string; // a uuid for the cell
	index: number; // the index of a cell within a row
	type: string; // input - whatever the user typed, formula - a user crafted formula, property - a property from a document within a collection
	property: string; // if type is "property", we store the designated property name here
	propertyValue: string | number | null; // we store values of properties here, which are used with query modifiers
	value: string; // either what the user typed, or the output of a a formula
	expression?: string; // the mathmatical expression that was calculated with math.evaluate()
}
export interface Formula {
	id: string; // the uuid of the formula in a given report
	tableId: string; // the id of the table, the formula belongs to
	columnId: string; // the column the formula should be applied to
	columnIndex: number; // the index of the column, the formula runs for. Used for applying results to row cells
	expression: string; // the mathmatical expression to be calculated with math.evaluate()
	values: Array<FormulaValue>; // an array of values, that need to be calculated
}
export interface FormulaValue {
	key: string; // points to a position in the formula, id like string xxxxxxxxxxxxxxxxxx
	type: string; // query - "a mongo query", query_count - "a number of objects from a query", pointer - 'grabs the value of another cell or field in the table'
	operation: string; // sum, min, max, mean - "math.sum, math.min, ..."
	collection_name: string; // user defined collection, used for display purposes
	queryModifier?: string; // a modifier for a query, selected from the collection that drives the table
	query: FormulaQuery; // a json formatted query object for slamming into mongo.find().fetch()
	property: string; // the property we want to use, when fetching objects in a collection
	path?: string; // the path traversal for a document fetched by a mongo query
	columnId?: string; // the column targeted, if type is "pointer"
	cellIndex?: number; // used to fetch a value from a cell that has already been calculated
}

export interface FormulaQuery {
	[key: string]: string | number | null;
}

export interface ReportData {
	_id: string | undefined;
	collection_name: string;
	viewer_id?: string;
	[key: string]: string | number | Object | null | undefined;

}