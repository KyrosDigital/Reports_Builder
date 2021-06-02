import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data'
import React, { useState, useEffect, useContext } from 'react'
import { Viewer } from '../../api/types/accounts'
import { UserContext } from '../../api/contexts/userContext';
import  SearchBar from '../components/searchbar'
import { Redirect } from 'react-router-dom';

const usePage = (account_id) => useTracker(() => {
	const subscription = Meteor.subscribe('AccountViewers')
	let viewers = Meteor.users.find({ 'profile.account_id': account_id }).fetch()
	return {
		viewers,
		isLoading: !subscription.ready()
	}
}, [])

export const Viewers_List = () => {

	const { user, account_id } = useContext(UserContext)
	const { isLoading, viewers } = usePage(account_id)
	const [query, setQuery] = useState('')
	const [viewersShown, setViewersShown] = useState(viewers)
	let viewersShownRegex = new RegExp(query, "i")

	if (!user) {
		return <Redirect to='/login' />
	}

	useEffect(() => {
		filterDishes()
	}, [query])

	useEffect(() => {
		setViewersShown(viewers)
	}, [viewers])

	const filterDishes = () => {
		if(query.length > 0) {
			let newResults = viewers.filter(viewer =>
				viewersShownRegex.test(viewer.profile.first_name) || viewersShownRegex.test(viewer.profile.last_name) 
				|| viewersShownRegex.test(viewer.emails[0].address) || viewersShownRegex.test(viewer.username)
				|| viewersShownRegex.test(viewer.profile.tags))
			setViewersShown(newResults)
		} else if (query.length === 0) {
			setViewersShown(viewers)
		}
	}

	return (
		<div className='h-screen w-screen p-6 bg-gray-100'>
			<SearchBar query={query} setQuery={setQuery} />
			<h1 className="text-xl font-semibold tracking-wide my-4">Viewers:</h1>
			<div className="">
				<table className="table-auto">
					<thead>
						<tr>
							<th className="px-4 font-light py-2 tracking-wide">NAME</th>
							<th className="px-4 font-light py-2 tracking-wide">USERNAME</th>
							<th className="px-4 font-light py-2 tracking-wide">EMAIL</th>
							<th className="px-4 font-light py-2 tracking-wide">TAGS</th>
						</tr>
					</thead>
					<tbody>
						{!isLoading && viewersShown.map((viewer, i) => {
						return <tr key={i} className="bg-white">
							<td className="border border-black border-solid px-4 py-2 font-normal">{viewer.profile.first_name} {viewer.profile.last_name}</td>
							<td className="border border-black border-solid px-4 py-2 font-normal">{viewer.username}</td>
							<td className="border border-black border-solid px-4 py-2 font-normal">{viewer.emails[0].address}</td>
							<td className="border border-black border-solid px-4 py-2 font-normal">{viewer.profile.tags}</td>
						</tr>
					})}
					</tbody>
				</table>
			</div>
		</div>
	);
};