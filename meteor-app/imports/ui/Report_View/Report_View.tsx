import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import {useParams} from 'react-router-dom';
import { Button } from '../components/buttons';

export const Report_View = () => {
	const { id } = useParams()

	const [report, setReport] = useState(null)

	const makeReport = () => {	
		Meteor.call('Compose_Report', id, (error : any, result : any) => {
			if(error) console.log(error)
			if(result) {console.log(result); setReport(result)}
		})
	}

  return (
    <div className='container p-6'>
      <h2 className="text-xl font-bold">{report?.name}</h2>

			<Button onClick={makeReport} text="Make Report" color="indigo"/>

			<div>

				{report && report.tables.map((table) => {
					return <div key={table.id} className="my-10 p-4 bg-indigo-50 rounded">

						<p className="text-xl font-medium">{table.title}</p>

						<div>

							{/* column headers */}
							<div className="flex"> 
								{table.columns.map((col, i) => {
									return <div key={col.id} className="flex justify-center items-center h-10 w-40 max-w-sm m-1 border-2 border-indigo-200 rounded-md bg-white">
										<span>{col.label}</span>
									</div>
								})}
							</div>
							
							{/* rows and cells - if static driven */}
							{table.rows.map((row) => {
								return <div key={row.id} className="flex">
									{row.cells.map((cell) => {
										return <div key={cell.id} className="flex justify-center items-center h-10 w-40 max-w-sm m-1 border-2 border-indigo-200 rounded-md bg-white" onClick={() => setCellSelected({tableId: table.id, cellId: cell.id})}>
											<div>{cell.value}</div>
										</div>
									})}
								</div>
							})}
							
						</div>
						
					</div>
				})}

			</div>
    </div>
  );
};
