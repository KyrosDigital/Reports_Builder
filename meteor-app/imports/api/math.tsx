import math from 'mathjs';
// import '../../server/publications/publications';
import { StrapiClientDataCollection } from './collections';

export const runMath = (str : string, queries : object) => {



	// TODO: this does not yet factor in collection, and data sources ... 
	// requires strings to start with ( and end with )
	// we store object representations, so we can convert to JSON with JSON.parse
	const parseMath = () => {
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
					case "{":
						arr.push(main()); startIndex = i; continue;
					case "}":
						addWord(); return arr;
				}
			}
			addWord();
			return arr;
		}
		return main();
	}
	
	
	console.log(math.evaluate(str));

	// console.log(JSON.parse('{"collection":"Transactions","index":0,"path":"data.price"}'))

	// console.log(parseMath('(({"collection":"Transactions","index":0,"path":"data.price"} + {"collection":"Transactions","index":1,"path":"data.price"}) * {"value":.5}) / {"collection":"Agents","target":"count"})'));

	// which should result in something like ... 

	// a proto object created from parseMath
	

	

}

