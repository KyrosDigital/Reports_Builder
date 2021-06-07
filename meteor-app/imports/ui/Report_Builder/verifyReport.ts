import { ReportStructure } from '../../api/types/reports'


// {_id : Match.Maybe(String), account_id : Match.Maybe(String), name : String, 
// 	tables : [{id : String, title : String, type : String, 
// 		columns : [{id : String, label : String, formulaId : Match.Maybe(String), property : Match.Maybe(String), collection_name : String, relation_key : Match.Maybe(String), enum : String, symbol : Match.Maybe(String)}], 
// 		rows : [{id : String, 
// 			cells : [{id : String, index : Number, type : String, property : String, propertyValue : String, value : String, expression : String}] }], 
// 		collection : String, sort_by : String}], 
// 	formulas : [{id : String, tableId : String, columnId : String, columnIndex : Number, expression : String, 
// 		// some of the formula types were decided by looking at how they are created in the columnToolBar
// 		values : [{key : String, type : String, operation : String, collection_name : Match.Maybe(String), queryModifier : String, query : {collection_name : String}, property : Match.Maybe(String), path : Match.Maybe(String), columnId : Match.Maybe(String), cellIndex : Match.Maybe(String)}] }], 
// 	public : Boolean, tags : [String] }

export const verifyReport = (report : ReportStructure) => {
	
	if (!report) return 'no report found'
	
	if (!report.name) return 'please name report'

	if (report.tables.length > 0) {
		
		for (const table of report.tables) {
			
			if (!table.title) return 'please name table'
			
			if (table.type === 'collection' && !table.collection) return 'please select collection for ' + table.title + ' table'
			
			if (table.columns.length > 0) {

				for (const col of table.columns) {

					if (!col.label) return 'please label columns'

					if (!col.collection_name) return 'please add property or formula to ' + col.label + ' column in ' + table.title

				}
			}
		}
	}
	
	if (report.formulas.length > 0) {

		for (const formula of report.formulas) {

			for (const value of formula.values) {

				if (!value.collection_name) return 'Please select collection for ' + value.key

				if (!value.property) return 'Please select property for ' + value.key

				if (!value.queryModifier) return 'Please select filter for ' + value.key

			}
		}
	}

	return ''
}