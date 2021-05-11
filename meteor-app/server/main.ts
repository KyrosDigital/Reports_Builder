import { Meteor } from 'meteor/meteor';
import math from 'mathjs'
import './publications/publications';
import { StrapiClientDataCollection } from '../imports/api/collections';


Meteor.startup(() => {
	
	// TODO: create a formula by parsing math strings such as ... 

	// ( (data_1 + data_2 * data_3) / (data_4 + data_5) )
	//           2        1 start   4         3

	// TODO: this does not yet factor in collection, and data sources ... 
	// requires strings to start with ( and end with )
	// we store object representations, so we can convert to JSON with JSON.parse
	const parseMath = (str : string) => {
		var i = 0;
		const main = () => {
			var arr = [], startIndex = i;
			const addWord = () => {
				if (i-1 > startIndex) arr.push(str.slice(startIndex, i-1));
			}
			while (i < str.length) {
				switch(str[i++]) {
					case " ":
						addWord(); startIndex = i; continue;
					case "(":
						arr.push(main()); startIndex = i; continue;
					case ")":
						addWord(); return arr;
				}
			}
			addWord();
			return arr;
		}
		return main();
	}

	console.log(JSON.parse('{"collection":"Transactions","index":0,"path":"data.price"}'))

	console.log(parseMath('(({"collection":"Transactions","index":0,"path":"data.price"} + {"collection":"Transactions","index":1,"path":"data.price"}) * {"value":.5}) / {"collection":"Agents","target":"count"})'));

	// which should result in something like ... 

	// a proto object created from parseMath
	const formula = {
		collections: ['Transactions', 'Agents'],
		steps: [
			{ 
				key: 'start', target: 'object',
			  collection: 'Transactions', index: 0, path: 'data.price',
			},
			{ 
				key: 'plus', target: 'object',
			  collection: 'Transactions', index: 1, path: 'data.price',
			},
			{ 
				key: 'mult', target: 'input', value: .5,
			},
			{
				key: 'mult', target: 'count',
				collection: 'Agents',
			}
		]
	}

	// we use the collections in the formula to compose queries
	const queries = {}

	formula.collections.forEach(collection => (
		queries[collection] = StrapiClientDataCollection.find({
			userId: '60958c98857a7b14acb156d9',
			collectionName: collection,
		}).fetch()
	))

	// create a mathjs chain
	let chain = math;

	// perform the steps described in the formula
	formula.steps.forEach(step => {
		let value = 0; // always start at 0

		// set values dynamically 
		if(step.target === 'input') value = step.value
		if(step.target === 'count') value = queries[step.collection].length
		if(step.target === 'object') value = queries[step.collection][step.index].data['price']

		// perform math operation sequentially
		if(step.key === 'start') chain = chain.chain(value)
		if(step.key === 'plus') chain = chain.add(value)
		if(step.key === 'mult') chain = chain.multiply(value)
		if(step.key === 'div') chain = chain.divide(value)
	})

	console.log(chain.done())

});
