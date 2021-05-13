import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useSubscription from '../../api/hooks'
import { Report, TableColumn } from '../../api/types/reports';
import { Report_Structure_Collection } from '../../api/collections'


export const Report_Builder = () => {

	// const loading = useSubscription('ReportStructure')

	const [reportStructure, setReportStructure] = useState<Report>({_id: '', tables: [], formulas: []})
	const [columSelected, setColumnSelected] = useState({tableId: '', columnId: ''})
	const [cellSelected, setCellSelected] = useState({tableId: '', cellId: ''})
	const [userCollections, setUserCollections] = useState(['Agents', 'Transactions'])


	// useEffect(() => {
	// 	if(!loading) {
	// 		let query = Report_Structure_Collection.findOne()
	// 		if(query) setReportStructure(query)
	// 	}
	// }, [loading])

	useEffect(() => {
		console.log(reportStructure)
	}, [reportStructure])

	const createNewStaticTable = () => {
		setReportStructure({
			_id: '', 
			tables: [...reportStructure.tables, {
				id: uuidv4(),
				title: 'Static Table Name',
				type: 'static',
				columns: [{id: uuidv4(), label: '', property: '', enum: ''}],
				rows: [], 
				collection: ''
			}],
			formulas: [] 
		})
	}

	const createCollectionTable = () => {
		setReportStructure({
			_id: '', 
			tables: [...reportStructure.tables, {
				id: uuidv4(),
				title: 'Collection Table Name',
				type: 'collection',
				columns: [{id: uuidv4(), label: '', property: '', enum: ''}],
				rows: [], 
				collection: ''
			}],
			formulas: [] 
		})
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

  return (
    <div>
      <p>Report Builder</p>

			<button onClick={createNewStaticTable}>+ New Static Table</button>
			<button onClick={createCollectionTable}>+ New Collection Table</button>

			{columSelected.tableId !== '' && <div>
				<p>{`Table: ${columSelected.tableId}`}</p>
				<p>{`Column: ${columSelected.columnId}`}</p>
			</div>}
			
			{cellSelected.tableId !== '' && <div>
				<p>{`Table: ${cellSelected.tableId}`}</p>
				<p>{`Cell: ${cellSelected.cellId}`}</p>
			</div>}
			
			{/* tables */}
			{reportStructure.tables.map((table) => (
				<div key={table.id} className="table">

					<div className="">

						<h2>{table.title}</h2>

						{/* controls */}
						<button onClick={() => addColumnToTable(table.id)}>+ Column</button>
						{table.type === 'static' && <button onClick={() => addRowToTable(table.id)}>+ Row</button>}
						
						{/* collection table - select collection to drive the table */}
						{table.type === 'collection' && userCollections.map(collectionName => {
							return <button onClick={() => setCollectionForTable(table.id, collectionName)}>{collectionName}</button>
						})}

						{/* column headers */}
						<div className="row"> 
							{table.columns.map(col => {
								return <div key={col.id} className="col hover-col" onClick={() => setColumnSelected({tableId: table.id, columnId: col.id})}>
									<div>{col.label}</div>
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
					
				</div>
			))}
    </div>
  );
};