import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import { Button } from '../components/buttons';
import { ReportStructure } from '/imports/api/types/reports';

export const Report_View = () => {
	const { id } = useParams()

	const [report, setReport] = useState(null)

	useEffect(() => {
		Meteor.call('Compose_Report', id, (error : Error, result : ReportStructure) => {
			if(error) console.log(error)
			if(result) {console.log(result); setReport(result)}
		})
	}, [])

  return (
    <div className='h-screen p-6 bg-gray-100'>

      <h2 className="mb-5 text-md font-bold">{report?.name}</h2>

			<div>

				{report && report.tables.map((table) => {
					return <div key={table.id} className="mb-8 p-4 bg-white rounded filter drop-shadow-md">

						<div className="flex justify-between">
							<p className="text-md font-medium mb-3">{table.title}</p>
						</div>

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
