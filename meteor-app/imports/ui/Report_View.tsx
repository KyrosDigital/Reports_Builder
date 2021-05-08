import React, { useState, useEffect } from 'react';
import useSubscription from '../api/hooks'
import { ClientData, StrapiClientDataCollection } from '../api/collections';

export const Report_View = () => {

	const loading = useSubscription('Types')

	const [clientData, setClientData] = useState<Array<ClientData>>([])

	useEffect(() => {
		if(!loading) {
			let query = StrapiClientDataCollection.find().fetch()
			if(query) setClientData(query)
		}
	}, [loading])

  return (
    <div>
      <p>Here are the Types created within Strapi</p>
			{clientData.map(the => {
				return <div>
					<p>{the.collectionName}</p>
					{Object.entries(the.data).map((key) => {
						return <p>{`${key}`}</p>
					})}
				</div>
			})}
    </div>
  );
};
