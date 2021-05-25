import { Meteor } from 'meteor/meteor'
import React, { useState, useEffect } from 'react'
import { Viewer } from '../../api/types/accounts'

export const Viewers_List = () => {

	const [viewers, setViewers] = useState<Array<Viewer>>([])

	useEffect(() => {
		Meteor.call("Fetch_Viewers_For_Account", (error: Error, result: Array<Viewer>) => {
			if (error) console.log(error)
			if (result) setViewers(result)
		})
	}, [])

	return (
		<div className='container p-6 bg-gray-50'>
			<h1 className="font-sans text-xl font-bold">Viewers:</h1>
      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-4 text-pink-500 py-2">Name</th>
            <th className="px-4 text-pink-500 py-2">Username</th>
            <th className="px-4 text-pink-500 py-2">Email</th>
          </tr>
        </thead>
        <tbody>
        {viewers.map((viewer, i) => {
          return <tr key={i} className="">
            <td className="border border-black border-solid px-4 py-2 font-medium">{viewer.profile.first_name} {viewer.profile.last_name}</td>
            <td className="border border-black border-solid px-4 py-2 font-medium">{viewer.username}</td>
            <td className="border border-black border-solid px-4 py-2 font-medium">{viewer.emails[0].address}</td>
          </tr>
			  })}
        </tbody>
      </table>
			
		</div>
	);
};