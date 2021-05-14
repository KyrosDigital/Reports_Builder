import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useSubscription from '../../api/hooks'
import { Report, TableColumn } from '../../api/types/reports';
import { Report_Structure_Collection, StrapiClientCollectionNames } from '../../api/collections'
import { ToolBar } from './toolBar'

export const Report_Builder = () => {

	const loading = useSubscription('CollectionNames')

	const [reportStructure, setReportStructure] = useState<Report>({_id: '', tables: [], formulas: []})
	const [columSelected, setColumnSelected] = useState({tableId: '', columnId: ''})
	const [cellSelected, setCellSelected] = useState({tableId: '', cellId: ''})
	const [userCollections, setUserCollections] = useState([])
	const [showToolBar, setShowToolBar] = useState(false)
	const [selectedTable, setSelectedTable] = useState(null)

	useEffect(() => {
		if(!loading) {
			let query = StrapiClientCollectionNames.find().fetch()
			if(query) setUserCollections(query)
		}
	}, [loading])

	useEffect(() => {
		console.log(reportStructure)
	}, [reportStructure])

	const createNewTable = (type: string) => {
		const table = {
			id: uuidv4(),
			title: '',
			type: type,
			columns: [{id: uuidv4(), label: '', property: '', enum: ''}],
			rows: [], 
			collection: ''
		}
		setReportStructure({
			_id: '', 
			tables: [...reportStructure.tables, table],
			formulas: [] 
		})
		setSelectedTable(table)
		setShowToolBar(true)
	}

	const setCollectionForTable = (tableId: string, collectionName: string) => {
		let tableIndex = reportStructure.tables.findIndex(table => table.id === tableId)
		reportStructure.tables[tableIndex].collection = collectionName
		setReportStructure(prevState => {
			return { ...prevState,  tables : reportStructure.tables }
		});
  }

	const addColumnToTable = (tableId: string) => {
		const updatedTables = reportStructure.tables.map(table => {
			if(table.id === tableId) {
				table.columns.push({id: uuidv4(), label: '', property: '', enum: ''})
				table.rows.forEach(row => { 
					row.cells.push({
						id: uuidv4(),
						index: table.columns.length,
						type : '',
						property: '',
						propertyValue: '',
						value: '',
						expression: '',
					}) 
				})
			}
			return table
		})

		setReportStructure({ _id: '', tables:  updatedTables, formulas: [...reportStructure.formulas]})
	}

	const addRowToTable = (tableId: string) => {
		const cells = (tableColumns: Array<TableColumn>) => {
			return tableColumns.map(() => ({id: uuidv4()}))
		}
		const updatedTables = reportStructure.tables.map(table => {
			if(table.id === tableId) {
				table.rows.push({id: uuidv4(), cells: cells(table.columns)})
			}
			return table
		})

		setReportStructure({ _id: '', tables:  updatedTables, formulas: [...reportStructure.formulas]})
	}

	const handleColumnLabelChange = (tableId, columnIndex, label) => {
		let tableIndex = reportStructure.tables.findIndex(table => table.id === tableId)

		reportStructure.tables[tableIndex].columns[columnIndex].label = label
		setReportStructure(prevState => {
			return { ...prevState,  tables : reportStructure.tables }
		});
	}

	const deleteTable = (tableId) => {
		let c = confirm("Are you sure you want to delete this table?")
		if(c) {
			let tableIndex = reportStructure.tables.findIndex(table => table.id === tableId)
			reportStructure.tables.splice(tableIndex, 1);
			setReportStructure(prevState => {
				return { ...prevState,  tables : reportStructure.tables }
			});
			setShowToolBar(false)
			setSelectedTable(null)
		}
	}

	const handleTableTitleUpdate = (tableId, title) => {
		let tableIndex = reportStructure.tables.findIndex(table => table.id === tableId)
		reportStructure.tables[tableIndex].title = title
		setReportStructure(prevState => {
			return { ...prevState,  tables : reportStructure.tables }
		});
	}

	const toggleToolBar = (table) => {
		if(table) {
			setSelectedTable(table)
			setShowToolBar(true)
		} else {
			setShowToolBar(false)
			setSelectedTable(null)
		}
	}

  return (
    <div className='container p-6'>

			{/* ToolBar */}
			{showToolBar && 
				<ToolBar 
					table={selectedTable} 
					handleTableTitleUpdate={handleTableTitleUpdate}
					userCollections={userCollections}
					setCollectionForTable={setCollectionForTable}
					deleteTable={deleteTable}
					addColumnToTable={addColumnToTable}
					addRowToTable={addRowToTable}
				/>
			}

			<button onClick={() => createNewTable('static')}>+ New Static Table</button>
			<button onClick={() => createNewTable('collection')}>+ New Collection Table</button>

			<hr />

			<div style={{height: '100vh'}}>

				{/* tables */}
				{reportStructure.tables.map((table) => (
					<div key={table.id} className="table" onClick={()=>toggleToolBar(table)}>

						<div>

							

							{/* column headers */}
							<div className="row"> 
								{table.columns.map((col, i) => {
									return <div key={col.id} className="col hover-col" onClick={() => setColumnSelected({tableId: table.id, columnId: col.id})}>
										<input placeholder={'Enter column header'} value={col.label} onChange={(e) => handleColumnLabelChange(table.id, i, e.target.value)}/>
									</div>
								})}
							</div>
							
							{/* rows and cells */}
							{table.rows.map((row) => {
								return <div key={row.id} className="row">
									{row.cells.map((cell) => {
										return <div key={cell.id} className="col hover-cell" onClick={() => setCellSelected({tableId: table.id, cellId: cell.id})}>
											<div></div>
										</div>
									})}
								</div>
							})}
							
						</div>

						<hr />
						
					</div>
				))}
			</div>
			
    </div>
  );
};