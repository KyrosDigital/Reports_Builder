import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ToolBar } from './toolBar'
import { Button } from '../components/buttons'
import useSubscription from '../../api/hooks'
import { Report, TableColumn } from '../../api/types/reports';
import { Report_Structure_Collection, StrapiClientCollectionNames } from '../../api/collections'

export const Report_Builder = () => {

	const loading = useSubscription('CollectionNames')
	const loading2 = useSubscription('ClientData')

	const [reportStructure, setReportStructure] = useState<Report>({_id: '', tables: [], formulas: []})
	const [cellSelected, setCellSelected] = useState({tableId: '', cellId: ''})
	const [userCollections, setUserCollections] = useState([])
	const [showToolBar, setShowToolBar] = useState(false)
	const [selectedTable, setSelectedTable] = useState(null)
	const [selectedColumn, setSelectedColumn] = useState(null)

	useEffect(() => {
		if(!loading && !loading2) {
			let query = StrapiClientCollectionNames.find().fetch()
			if(query) setUserCollections(query)
		}
	}, [loading, loading2])

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

		setReportStructure({ _id: '', tables: updatedTables, formulas: [...reportStructure.formulas]})
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

	const toggleToolBarForTable = (table) => {
		if(table) {
			setSelectedColumn(null)
			setSelectedTable(table)
			setShowToolBar(true)
		}
	}

	const toggleToolBarForColumn = (tableId, column, columnIndex) => {
		if(column) {
			setSelectedTable(null)
			setSelectedColumn({tableId, column, columnIndex})
			setShowToolBar(true)
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
					column={selectedColumn}
					handleColumnLabelChange={handleColumnLabelChange}
				/>
			}

			<Button onClick={() => createNewTable('static')} text="+ New Static Table" color="green"/>
			<Button onClick={() => createNewTable('collection')} text="+ New Collection Table" color="green"/>

			<div>

				{/* tables */}
				{reportStructure.tables.map((table) => (
					<div key={table.id} className="my-10 p-4 bg-indigo-50 rounded">

						<p className="text-xl font-medium">{table.title}</p>
						<Button onClick={() => toggleToolBarForTable(table)} text="✏️" color="indigo"/>
						<div>

							{/* column headers */}
							<div className="flex"> 
								{table.columns.map((col, i) => {
									return <div 
										key={col.id} 
										className="flex justify-center items-center h-10 w-40 max-w-sm m-1 border-2 border-indigo-200 rounded-md bg-white" 
										onClick={() => toggleToolBarForColumn(table.id, col, i)}>
										<span>{col.label}</span>
									</div>
								})}
							</div>
							
							{/* rows and cells - if static driven */}
							{table.rows.map((row) => {
								return <div key={row.id} className="flex">
									{row.cells.map((cell) => {
										return <div key={cell.id} className="flex justify-center items-center h-10 w-40 max-w-sm m-1 border-2 border-indigo-200 rounded-md bg-white" onClick={() => setCellSelected({tableId: table.id, cellId: cell.id})}>
											<div></div>
										</div>
									})}
								</div>
							})}

							{/* Fake rows - if table is collection driven */}
							{table.type === 'collection' && Array.from([1, 2]).map((col, x) => {
								return <div key={Math.random()} className="flex">
									{table.columns.map((i) => {
										return <div key={Math.random()} className="flex justify-center items-center h-10 w-40 max-w-sm m-1 border-2 border-indigo-100 border-dashed rounded-md bg-white">
											<div className="text-indigo-100">data</div>
										</div>
									})}
								</div>
							})}

						</div>
						
					</div>
				))}
			</div>
			
    </div>
  );
};