import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useSubscription from '../../api/hooks'
import { Report, TableColumn } from '../../api/types/reports';
import { Report_Structure_Collection } from '../../api/collections'


export const Report_Builder = () => {

	const loading = useSubscription('ReportStructure')

	const [reportStructure, setReportStructure] = useState<Report>({_id: '', tables: [], formulas: []})
	const [columSelected, setColumnSelected] = useState({tableId: '', columnId: ''})
	const [cellSelected, setCellSelected] = useState({tableId: '', cellId: ''})

	useEffect(() => {
		if(!loading) {
			let query = Report_Structure_Collection.findOne()
			if(query) setReportStructure(query)
		}
	}, [loading])

	useEffect(() => {
		// console.log(reportStructure)
	}, [reportStructure])

	const createNewTable = () => {
		setReportStructure({_id: '', tables: [...reportStructure.tables, {
			id: uuidv4(),
			columns: [{id: uuidv4(), label: 'col1'}, {id: uuidv4(), label: 'col2'}, {id: uuidv4(), label: 'col3'}],
			rows: [{
				id: uuidv4(),
				cells: [{id: uuidv4()}, {id: uuidv4()}, {id: uuidv4()}]
			}, {
				id: 'row2',
				cells: [{id: uuidv4()}, {id: uuidv4()}, {id: uuidv4()}]
			}], 
		}] })
	}

	const addColumnToTable = (tableId: string) => {
		const updatedTables = reportStructure.tables.map(table => {
			if(table.id === tableId) {
				table.columns.push({id: uuidv4(), label: `col${table.columns.length + 1}`})
				table.rows.forEach(row => { row.cells.push({id: uuidv4()}) })
			}
			return table
		})

		setReportStructure({ _id: '', tables:  updatedTables})
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

		setReportStructure({ _id: '', tables:  updatedTables})
	}

  return (
    <div>
      <p>Report Builder</p>

			<button onClick={createNewTable}>+ New Table</button>

			{columSelected.tableId !== '' && <div>
				<p>{`Table: ${columSelected.tableId}`}</p>
				<p>{`Column: ${columSelected.columnId}`}</p>
			</div>}
			
			{cellSelected.tableId !== '' && <div>
				<p>{`Table: ${cellSelected.tableId}`}</p>
				<p>{`Cell: ${cellSelected.cellId}`}</p>
			</div>}
			
			{/* tables */}
			{reportStructure.tables.map((table) => {
				return <div key={table.id} className="table">

					<div className="">

						{/* controls */}
						<button onClick={() => addColumnToTable(table.id)}>+ Column</button>
						<button onClick={() => addRowToTable(table.id)}>+ Row</button>

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
			})}
    </div>
  );
};