import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data'
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/buttons'
import { Report_Structures } from '../../api/collections'
import { UserContext } from '../../api/contexts/userContext';
import { Redirect } from 'react-router-dom';
import  SearchBar from '../components/searchbar'

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

	const { user, role, tags } = useContext(UserContext)
	if (!user) {
		return <Redirect to='/login' />
	}
	
	
	const { isLoading, reports } = usePage()
	const [query, setQuery] = useState('')
	const [reportsShown, setReportsShown] = useState(reports)
	let reportsShownRegex = new RegExp(query, "i")

	useEffect(() => {
		filterReports()
	}, [query])

	useEffect(() => {
		setReportsShown(reports)
	}, [reports])

	const filterReports = () => {
		if(query.length > 0) {
			let newResults = reports.filter(report => reportsShownRegex.test(report.name))
			setReportsShown(newResults)
		} else if (query.length === 0) {
			setReportsShown(reports)
		}
	}

  return (
    <div className='min-h-screen h-full w-full p-6 bg-gray-100'>
			<SearchBar query={query} setQuery={setQuery} />
			<div className="flex justify-between">
				<p className="text-xl font-semibold tracking-wide">Your Reports:</p>
				{role === "Editor" && <Link to='/report-builder' className="mr-4">
					<Button onClick={() => { }} text="Make New Report" color="blue" />
				</Link>}
			</div>

			{!isLoading && reportsShown.map((report, id) => {
				let hasTag = false
				tags.forEach((tag) => {
					if (report.tags.includes(tag)) hasTag = true
				})
				if (hasTag || role === 'Editor') {
					return <div key={id} className="my-4 box-border w-1/4 p-4 bg-white rounded filter drop-shadow-md">
						<h2 className="text-md">{report.name}</h2>
						<div className="flex py-2">
							<Link to={'/report-view/' + report._id}>
								<Button onClick={() => { }} text="View" color="blue" />
							</Link>
							{role === "Editor" && <Link to={'/report-builder/' + report._id}>
								<Button onClick={() => { }} text="Edit" color="blue" />
							</Link>}
						</div>
					</div>
				}
			})}

		</div>
	);
};