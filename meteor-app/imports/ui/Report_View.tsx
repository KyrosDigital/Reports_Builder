import React, { useState, useEffect } from 'react';
import useSubscription from '../api/hooks'
import { Types, StrapiTypesCollection } from '../api/collections';

export const Report_View = () => {

	const loading = useSubscription('Types')

	const [types, setTypes] = useState<Array<Types>>([])

	useEffect(() => {
		if(!loading) {
			let query = StrapiTypesCollection.find().fetch()
			if(query) setTypes(query)
		}
	}, [loading])

  return (
    <div>
      <p>Here are the Types created within Strapi</p>
			{types.map(type => {
				return <div>{type.CollectionName}</div>
			})}
    </div>
  );
};
