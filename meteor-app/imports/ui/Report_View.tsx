import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect } from 'react';
import useSubscription from '../api/hooks'
import { ClientData, StrapiClientDataCollection } from '../api/collections';

export const Report_View = () => {

	// const loading = useSubscription('ClientData')

	// const [clientData, setClientData] = useState<Array<ClientData>>([])

	// useEffect(() => {
	// 	if(!loading) {
	// 		let query = StrapiClientDataCollection.find().fetch()
	// 		if(query) setClientData(query)
	// 	}
	// }, [loading])

	const report = {
		_id: 'asdopasdkdas', // the mongo id of the object
		tables: [ // the table structure, crafted by user
			{
				id: 'uuid',
				type: 'collection', // collection - loops over a set of data, static - user manually sets the amount of rows
				columns: [ {id: 'yyy', label: 'sales', formulaId: 'xxx'} ], // the columns in the table
				rows: [ ],
				collection: 'Agents' // could be null, if rowType is static
			}
		],
		formulas: [
			{
				id: 'xxx',
				tableId: 'uuid',
				columnId: 'yyy',
				cellIndex: null,
				originalExpression: 'sum(x + 1) / y',
				expression: 'sum(x + 1) / y',
				result: null, 
				values: [
					{
						key: 'x',
						type: 'query',
						operation: 'sum',
						collectionName: 'Transactions',
						query: {"userId": "60958c98857a7b14acb156d9", "collectionName": "Transactions"},
						property: 'price'
					},
					{
						key: 'y',
						type: 'query_count',
						collectionName: 'Agents',
						query: {"userId": "60958c98857a7b14acb156d9", "collectionName": "Agents"}
					},
					// {
					// 	key: 'z',
					// 	type: 'pointer',
					// 	collumnId: 'uuid',
					// 	cellIndex: 0
					// }
				]
			}
		]
	}

	Meteor.call('Compose_Report', report, (error, result) => {
		if(error) console.log(error)
		if(result) console.log(result)
	})

  return (
    <div>
      <h2>Report View</h2>
    </div>
  );
};
