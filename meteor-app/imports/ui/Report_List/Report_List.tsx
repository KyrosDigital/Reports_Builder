import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data'
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/buttons'
import { Report_Structures } from '../../api/collections'
import { UserContext } from '../../api/contexts/userContext';


const usePage = () => useTracker(() => {
	// The publication must also be secure
	const subscription = Meteor.subscribe('ReportStructure')
	const reports = Report_Structures.find().fetch()
	return {
		reports,
		isLoading: !subscription.ready()
	}
}, [])

export const Report_List = () => {

	const { role, tags } = useContext(UserContext)
	
	const { isLoading, reports } = usePage()

  return (
    <div className='h-screen w-screen p-6 bg-gray-100'>
			
			<div className="flex justify-between">
				<p className="text-md font-bold">Your Reports:</p>
				{role === "Editor" && <Link to='/report-builder' className="mr-4">
					<Button onClick={() => { }} text="Make New Report" color="blue" />
				</Link>}
			</div>

			{!isLoading && reports.map((el, id) => {
				let hasTag = false
				tags.forEach((element) => {
					if (el.tags.includes(element)) hasTag = true
				})
				if (hasTag || role === 'Editor') {
					return <div key={id} className="my-4 box-border w-1/4 p-4 bg-white rounded filter drop-shadow-md">
						<h2 className="text-md">{el.name}</h2>
						<div className="flex py-2">
							<Link to={'/report-view/' + el._id}>
								<Button onClick={() => { }} text="View" color="blue" />
							</Link>
							{role === "Editor" && <Link to={'/report-builder/' + el._id}>
								<Button onClick={() => { }} text="Edit" color="blue" />
							</Link>}
						</div>
					</div>
				}
			})}

		</div>
	);
};