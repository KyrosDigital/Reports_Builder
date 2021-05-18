import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import useSubscription from '../../api/hooks'
import { ClientData, StrapiClientDataCollection } from '../../api/collections';
import { Button } from '../components/buttons';

export const Report_View = () => {
	const { id } = useParams()
	// const loading = useSubscription('ClientData')

	// const [clientData, setClientData] = useState<Array<ClientData>>([])

	// useEffect(() => {
	// 	if(!loading) {
	// 		let query = StrapiClientDataCollection.find().fetch()
	// 		if(query) setClientData(query)
	// 	}
	// }, [loading])

	const [report, setReport] = useState(null)

	const makeReport = () => {
		Meteor.call('Compose_Report', id, (error, result) => {
			if(error) console.log(error)
			if(result) {console.log(result); setReport(result)}
		})
	}

  return (
    <div className='container p-6'>
      <h2>Report View</h2>
			<p> id of report is {id}</p>
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
