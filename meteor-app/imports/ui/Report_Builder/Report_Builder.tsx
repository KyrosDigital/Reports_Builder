import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useSubscription from '../../api/hooks'
import { ReportStructure, Report_Structure_Collection } from '../../api/collections';


export const Report_Builder = () => {

	const loading = useSubscription('ReportStructure')

	const [reportStructure, setReportStructure] = useState({tables: []})

	useEffect(() => {
		if(!loading) {
			let query = Report_Structure_Collection.findOne()
			if(query) setReportStructure(query)
		}
	}, [loading])

	useEffect(() => {
		console.log(reportStructure)
	}, [reportStructure])

	const createNewTable = () => {
		setReportStructure({ tables: [...reportStructure.tables, {
			id: uuidv4(),
			columns: [{id: uuidv4(), label: 'col1'}, {id: uuidv4(), label: 'col2'}, {id: uuidv4(), label: 'col3'}],
			rows: [{
				id: uuidv4(),
				cells: [{id: 'cell1'}, {id: "cell2"}, {id: "cell3"}]
			}, {
				id: 'row2',
				cells: [{id: 'cell4'}, {id: "cell5"}, {id: "cell6"}]
			}], 
		}] })
	}

  return (
    <div>
      <p>Report Builder</p>

			<button onClick={createNewTable}>New Table</button>
			
			{reportStructure.tables.map((table) => {
				return <div key={table.id} className="table">
					<div className="row">
					{table.columns.map(col => {
						return <div key={col.id} className="col">
							<div>{col.label}</div>
						</div>
					})}
					</div>
					{table.rows.map((row) => {
						return <div key={row.id} className="row">
							{row.cells.map((cell) => {
								return <div key={cell.id} className="col">
									<div>{cell.id}</div>
								</div>
							})}
						</div>
					})}
				</div>
			})}
    </div>
  );
};