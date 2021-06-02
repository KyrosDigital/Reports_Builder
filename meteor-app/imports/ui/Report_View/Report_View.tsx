import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment'
import { UserContext } from '/imports/api/contexts/userContext';
import { ReportStructure } from '/imports/api/types/reports';
import { Tooltip } from '../components/tooltips'
import { Redirect } from 'react-router-dom';

export const Report_View = () => {
	const { id } = useParams()

  const [report, setReport] = useState(null)

	const { user } = useContext(UserContext)

	if (!user) {
		return <Redirect to='/login' />
	}

	useEffect(() => {
		Meteor.call('Compose_Report', id, (error : Error, result : ReportStructure) => {
			if(error) console.log(error)
			if (result) {
				console.log(result)
				setReport(result)
			}
		})
	}, [])

	const handleValue = (value, symbol) => {
		if (typeof value === 'string') {
			return value
		}
		if (typeof value === 'number') {
			if (symbol) {
				if (symbol == '$') return '$' + value
				if (symbol == '%') return (value * 100) + '%'
			}
			return value
		}
		if (typeof value === "object") { // is an object
			if (typeof value.getMonth === 'function') { // object is a date
				return moment(value, 'YYYY-MM-DD').format('LL')
			}
		}
	}

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
									return <Tooltip key={col.id} tooltipText={`filter: ${table.collection}.${col.property}`}>
										<div className="flex justify-center items-center h-10 w-40 max-w-sm m-1 border-2 border-indigo-200 rounded-md bg-white cursor-pointer">
											<span>{col.label}</span>
										</div>
									</Tooltip>
								})}
							</div>
							
							{/* rows and cells - if static driven */}
							{table.rows.map((row) => {
                return <div key={row.id} className="flex">
                {row.cells.map((cell) => {
                  return <div key={cell.id} className="flex justify-center items-center h-10 w-40 max-w-sm m-1 border-2 border-indigo-200 rounded-md bg-white" onClick={() => setCellSelected({tableId: table.id, cellId: cell.id})}>
										<div>{ handleValue(cell.value, table.columns[cell.index].symbol) }</div>
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
