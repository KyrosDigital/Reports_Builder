import { ReportStructure } from '../../api/types/reports'
import { check, Match } from 'meteor/check'


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

export const verify_report = (report : ReportStructure) => {
	if (!report) return 'no report found'
	if (!report['name']) return 'please name report'
	if (report.tables) {
		report.tables.forEach((table) => {
			if (!table.title) return 'please name table'
			if (table.type === 'collection' && !table.collection) return 'please select collection for ' + table.title + ' table'
			if (table.columns.length > 0) {
				table.columns.forEach((col) => {
					
				})
			}
			if (table.rows.length > 0) {
				table.rows.forEach((row) => {
					
				})
			}
		})
		
	}

	return ''
}