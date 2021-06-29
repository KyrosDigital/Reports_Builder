import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '/imports/api/contexts/userContext';

export const Data_Overview = () => {
	const [data, setData] = useState({})

	useEffect(() => {
		Meteor.call('Fetch_Data', (error : Error, result : ReportStructure) => {
			if(error) console.log(error)
			if (result) {
				console.log(result)
				setData(result)
			}
		})
	}, [])

	return (
		<div className="m-4">
			<h1 className="text-lg font-semibold tracking-wide"> Data: </h1>
			{data? Object.keys(data).map((collection, i) => {
				return <div className="m-4" key={i}>
					<h1 className="font-normal"> {collection}  -  {data[collection].length} </h1>
					{Object.keys(data[collection][0]).map((obj_key, j) => {
						return <div key={j}>
							<h1 className="font-light mx-4"> {obj_key} </h1>
						</div>
					})}
					<span></span>
				</div>
			}): <h1>No data available</h1>}
		</div>
	);
};