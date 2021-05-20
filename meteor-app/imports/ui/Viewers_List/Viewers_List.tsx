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
		<div className="space-y-4">
			<h1 className="font-sans text-xl font-bold">Viewers:</h1>
			{viewers.map((viewer, i) => {
				return <div key={i} className="">
					<div>Name: {viewer.profile.first_name} {viewer.profile.last_name}</div>
					<div>username: {viewer.username}</div>
					<div>email: {viewer.emails[0].address}</div>
				</div>
			})}
		</div>
	);
};