import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data'
import React, { useState, useEffect, useContext } from 'react'
import { Viewer } from '../../api/types/accounts'
import { UserContext } from '../../api/contexts/userContext';

const usePage = (account_id) => useTracker(() => {
	const subscription = Meteor.subscribe('AccountViewers')
	let viewers = Meteor.users.find({ 'profile.account_id': account_id }).fetch()
	return {
		viewers,
		isLoading: !subscription.ready()
	}
}, [])

export const Viewers_List = () => {

	const { account_id } = useContext(UserContext)
	const { isLoading, viewers } = usePage(account_id)

	return (
		<div className='container p-6 bg-gray-50'>
			<h1 className="font-sans text-xl font-bold">Viewers:</h1>
      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-4 text-pink-500 py-2">Name</th>
            <th className="px-4 text-pink-500 py-2">Username</th>
            <th className="px-4 text-pink-500 py-2">Email</th>
						<th className="px-4 text-pink-500 py-2">Tags</th>
          </tr>
        </thead>
        <tbody>
					{!isLoading && viewers.map((viewer, i) => {
          return <tr key={i} className="">
            <td className="border border-black border-solid px-4 py-2 font-medium">{viewer.profile.first_name} {viewer.profile.last_name}</td>
            <td className="border border-black border-solid px-4 py-2 font-medium">{viewer.username}</td>
            <td className="border border-black border-solid px-4 py-2 font-medium">{viewer.emails[0].address}</td>
						<td className="border border-black border-solid px-4 py-2 font-medium">{viewer.profile.tags}</td>
          </tr>
			  })}
        </tbody>
      </table>
			
		</div>
	);
};