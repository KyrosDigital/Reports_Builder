import { ReportStructure } from '../../api/types/reports'

export const verifyReport = (report : ReportStructure) => {
	
	if (!report) return 'No report found'
	
	if (!report.name) return 'Please name report'

	if (report.tables.length > 0) {
		
		for (const table of report.tables) {
			
			if (!table.title) return 'Please name table'

			if (!table.collection) return 'Please assign collection to \"' + table.title + '\"'

			if (table.columns.length == 0) return '\"' + table.title + '\" table must have at least one column'
			
			if (table.type === 'collection' && !table.collection) return 'Please select collection for \"' + table.title + '\"'
			
			if (table.columns.length > 0) {

				for (const col of table.columns) {

					if (!col.label) return 'Please label columns in \"' + table.title + '\"'

					if (!col.collection_name) return 'Please add property or formula to \"' + col.label + '\" column in \"' + table.title + '\"'

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