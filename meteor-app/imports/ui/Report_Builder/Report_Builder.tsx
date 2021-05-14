import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useSubscription from '../../api/hooks'
import { Report, TableColumn } from '../../api/types/reports';
import { Report_Structure_Collection, StrapiClientCollectionNames } from '../../api/collections'


export const Report_Builder = () => {

	const loading = useSubscription('CollectionNames')

	const [reportStructure, setReportStructure] = useState<Report>({_id: '', tables: [], formulas: []})
	const [columSelected, setColumnSelected] = useState({tableId: '', columnId: ''})
	const [cellSelected, setCellSelected] = useState({tableId: '', cellId: ''})
	const [userCollections, setUserCollections] = useState([])


	useEffect(() => {
		if(!loading) {
			let query = StrapiClientCollectionNames.find().fetch()
			if(query) setUserCollections(query)
		}
	}, [loading])

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

	const handleColumnLabelChange = (tableId, columnIndex, label) => {
		let tableIndex = reportStructure.tables.findIndex(table => table.id === tableId)

		reportStructure.tables[tableIndex].columns[columnIndex].label = label
		setReportStructure(prevState => {
			return { ...prevState,  tables : reportStructure.tables }
		});
	}

	const removeTableFromReport = (tableId) => {
		let c = confirm("Are you sure you want to delete this table?")
		if(c) {
			let tableIndex = reportStructure.tables.findIndex(table => table.id === tableId)
			reportStructure.tables.splice(tableIndex, 1);
			setReportStructure(prevState => {
				return { ...prevState,  tables : reportStructure.tables }
			});
		}
	}

	const handleTableTitleUpdate = (tableId, title) => {
		let tableIndex = reportStructure.tables.findIndex(table => table.id === tableId)
		reportStructure.tables[tableIndex].title = title
		setReportStructure(prevState => {
			return { ...prevState,  tables : reportStructure.tables }
		});
	}

  return (
    <div>
      <p>Report Builder</p>

			<button onClick={createNewStaticTable}>+ New Static Table</button>
			<button onClick={createCollectionTable}>+ New Collection Table</button>

			<hr />
			{/* tables */}
			{reportStructure.tables.map((table) => (
				<div key={table.id} className="table">

					<div className="">

						<div style={{marginBottom: '25px'}}>
							<label>Table Title: </label>
							<input placeholder={'Enter Table Title'} value={table.title} onChange={(e) => handleTableTitleUpdate(table.id, e.target.value)}/>
						</div>

						<div style={{marginBottom: '25px'}}>Table Type: {table.type}</div>

						{/* collection table - select collection to drive the table */}
						{table.type === 'collection' && (table.collection.length === 0) && 
							<div style={{marginBottom: '25px'}}>
								<span>Choose Collection:</span>
								{table.type === 'collection' && userCollections.map(collection => {
									return <button onClick={() => setCollectionForTable(table.id, collection.collectionName)}>{collection.collectionName}</button>
								})}
							</div>
						}
						
						{table.type === 'collection' && (table.collection.length > 0) && 
						<div style={{marginBottom: '25px'}}>Collection Selected: {table.collection}</div>}
						

						{/* controls */}
						<div>
							<button onClick={() => removeTableFromReport(table.id)}>- delete table</button>
							<button onClick={() => addColumnToTable(table.id)}>+ Column</button>
							{table.type === 'static' && <button onClick={() => addRowToTable(table.id)}>+ Row</button>}
						</div>

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
  );
};