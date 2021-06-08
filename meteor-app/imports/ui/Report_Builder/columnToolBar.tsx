import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect } from 'react';
import { Button } from '../components/buttons'
import { Input } from '../components/inputs'
import { Label } from '../components/labels'
import { DataPicker } from '../components/dataPicker';
import { Report_Data } from '../../api/collections'
import toast from 'react-hot-toast';

export const ColumnToolBar = ({
	reportStructure, column, columnIndex, tableId, 
	handleColumnLabelChange, handleColumnPropertyChange,
	handleFormulaUpdate, handleFormulaRemoval, columnFormula,
	handleColumnRelationKeyChange,
	deleteColumn, userCollections, handleColumnSymbol
}) => {

	const [formulaString, setFormulaString] = useState('')
	const [formulaVariables, setFormulaVariables] = useState([])
	const [formulaValues, setFormulaValues] = useState([])
	const [symbolState, setSymbolState] = useState('')
	const [colProperty, setColProperty] = useState()
	const [toggleDataPicker, setToggleDataPicker] = useState(false)
	const [toggleRelationPicker, setToggleRelationPicker] = useState(false)
	const alphabet = "abcdefghijklmnopqrstuvwxyz"
	const symbols = ['$', '%']

	// preload data from loaded report structure
	useEffect(() => {
		if(columnFormula) {
			setFormulaString(columnFormula.expression)
			setFormulaValues(columnFormula.values)

			const mapVariableArray = columnFormula.values.map(value => {
				let obj = {
					char: value.key,
					collection_name: value.collection_name,
					keys: [],
					selectedKey: value.property,
					queryModifier: value.queryModifier
				}
				Meteor.call('Fetch_Single_Collection_Keys', value.collection_name, (error, result) => {
					if(error) console.log(error)
					if(result) { obj.keys = result.keys }
				})
				return obj
			})
			setFormulaVariables(mapVariableArray)
		} else { // handles toggling between columns, if one has a formula and one does not
			setFormulaString('')
			setFormulaValues([])
			setFormulaVariables([])
		}
	}, [columnFormula])
	useEffect(() => {
		if (column.symbol) {
			setSymbolState(column.symbol)
		}
	}, [column.symbol])
	useEffect(() => {
		setColProperty(column.property)
	}, [column.property])

	// if the formula string, or formula values change
	useEffect(() => {
		formulaVariables.forEach(variable => {
			if(!Array.from(formulaString).includes(variable.char)) {
				let redacted = formulaVariables.filter(item => item.char !== variable.char)
				setFormulaVariables(redacted);
			}
		})
		Array.from(formulaString).forEach(char => {
			if(alphabet.includes(char) && formulaVariables.filter(variable => variable.char === char).length === 0) {
				setFormulaVariables(oldArray => [...oldArray, { char: char, collection_name: null, keys: [], slectedKey: null, queryModifier: null }]);
			}
		})

	}, [formulaString, formulaValues])

	// If formula variable state changes
	useEffect(() => {
		const values = formulaVariables.map(variable => {
			return {
				key: variable.char,
				type: 'query', // TODO:
				operation: 'sum', // TODO: 
				collection_name: variable.collection_name || null,
				queryModifier: variable.queryModifier,
				// TODO:
				query: {
					// "accountId": "60958c98857a7b14acb156d9", // TODO:
					"collection_name": variable.collection_name
				},
				property: variable.selectedKey || null
			}
		})
		setFormulaValues(values)
	}, [formulaVariables])

	const handleSelectCollectionForVariable = (collection_name, i) => {
		Meteor.call('Fetch_Single_Collection_Keys',collection_name, (error, result) => {
			if(error) console.log(error)
			if(result) {
				setFormulaVariables(prevState => {
					prevState[i].collection_name = collection_name
					prevState[i].keys = result.keys
					return [...prevState]
				});
			}
		})
	}

	const handleSelectedKey = (key, i) => {
		setFormulaVariables(prevState => {
			prevState[i].selectedKey = key
			return [...prevState]
		});
	}

	const handleSelectedQueryModifier = (collection_name, key, i) => {
		setFormulaVariables(prevState => {
			prevState[i].queryModifier = key
			return [...prevState]
		});
		// we also need to corespond the query modifier to the column property
		handleColumnPropertyChange(tableId, columnIndex, collection_name, key)
	}

	// NOTE: we must save formula by click for time being.
	// the way the data is passed back and forth, it prevent us from being able to 
	// update on click or type, and being able to toggle between columns, and have the data be accurate
	// if you call handleFormulaUpdate within the useEffect for [formulaString, formulaValues],
	// you'll see what I mean. 
	const saveFormula = () => {
		handleFormulaUpdate({ // update report structure here
			tableId: tableId, columnId: column.id, columnIndex: columnIndex,
			expression: formulaString, values: formulaValues
		})
		toast.success('Formula Saved!')
	}

	const removeFormula = () => {
		handleFormulaRemoval(tableId, columnIndex, column.id)
		handleColumnPropertyChange(tableId, columnIndex, '', '')
		setFormulaString('')
		setFormulaValues([])
		setFormulaVariables([])
		toast.success('Formula Removed!')
	}


	const add_symbol = (symbol) => {
		if (symbolState == symbol) {
			setSymbolState('')
			handleColumnSymbol(tableId, columnIndex, null)
		} else {
			setSymbolState(symbol)
			handleColumnSymbol(tableId, columnIndex, symbol)
		}
  }

	const handleDataPicker = () => {
		setToggleDataPicker(true)
	}

	const handleRelationPicker = () => {
		setToggleRelationPicker(true)
	}

	return (
		<>

			{/* Modal for selecting data */}
			<DataPicker 
				callback={(value) => handleColumnPropertyChange(tableId, columnIndex, value.collection_name, value.key)} 
				open={toggleDataPicker} setOpen={setToggleDataPicker} 
				collectionOnly={false} 
				forcedCollection={null}
				// forcedCollection={reportStructure?.tables.find(table => table.id === tableId).collection}
			/>

			{/* Modal for selecting relationship */}
			<DataPicker 
				callback={(value) => handleColumnRelationKeyChange(tableId, columnIndex, value.key)} 
				open={toggleRelationPicker} setOpen={setToggleRelationPicker} 
				collectionOnly={false} 
				forcedCollection={null}
			/>

			{/* Column type */}
			<div className="flex">
				<Label text={`Column Type:`} color={'indigo'}/>
				{formulaString && <Label text={'Formula'} color={'yellow'}/>}
				{column.property && <Label text={'Property'} color={'yellow'}/>}
			</div>

			{/* Column label */}
			<div className="mb-4">
				<Input 
					placeholder={'Enter column header'}
					label={"Column Header:"} 
					value={column.label} 
					onChange={(e) => handleColumnLabelChange(tableId, columnIndex, e.target.value)}
					/>
			</div>

			{/* Column property - if no formula */}
			{!formulaString &&
				<div className="mb-4">
					<Input 
						placeholder={'Enter column property'}
						label={"Column Property:"} 
						value={column.property} 
						onClick={() => handleDataPicker()}
						disabled={true}
						/>
				</div>
			}

			{/* formula - if no property*/}
			{
			!colProperty && 
				<div className="mb-4">
					<Input 
						placeholder={'(2 * x) / y'}
						label={"Column Formula:"} 
						value={formulaString} 
						onChange={(e) => setFormulaString(e.target.value.toLowerCase())}
						/>
				</div>
			}

			{/* formula variables*/}
			{formulaVariables.map((variable, i) => {

				let label = `${variable.char}`
				if (variable.collection_name) label = `${variable.char} = ${variable.collection_name}`
				if (variable.selectedKey) label = `${variable.char} = ${variable.collection_name}.${variable.selectedKey}`

				return <div className="mb-4" key={i}>
					<Label text={label} color={'indigo'}/>
					{!variable.collection_name && userCollections.map((collection_name, y) => {
						return <Button key={y} onClick={() => handleSelectCollectionForVariable(collection_name, i)} text={collection_name} color="green" />
					})}
					{!variable.selectedKey && variable.keys.map((key, x) => {
						return <Button key={x} onClick={() => handleSelectedKey(key, i)} text={key} color="green"/>
					})}
				</div>
			})}

			{/* formula data query modifiers  */}
			{formulaVariables.map((variable, i) => {
				let label = `${variable.char} filter:`
				if(variable.queryModifier) label = `${variable.char} filter: ${variable.queryModifier}`

				return <div className="mb-4" key={i}>
					<Label text={label} color={'indigo'}/>
					{!variable.queryModifier && variable.keys.map((key, x) => {
						return <Button key={x} onClick={() => handleSelectedQueryModifier(variable.collection_name, key, i)} text={key} color="green"/>
					})}
				</div>
			})}
			
			{/* Save formula */}
			{formulaString && 
				<div className="flex">
					<Button onClick={() => saveFormula()} text={'Save Formula'} color="blue"/>
					<Button onClick={() => removeFormula()} text={'Remove Formula'} color="red"/>
				</div>
			}

			{/* Column relation_key - if no formula */}
			{!formulaString &&
				<div className="mb-4">
					<Input 
						placeholder={'Enter relation key'}
						label={"Relation key:"} 
						value={column.relation_key} 
						onClick={() => handleRelationPicker()}
						disabled={true}
						/>
				</div>
			}
			
			<div>
				<span className="whitespace-nowrap text-xs font-semibold inline-block py-1 px-2 rounded text-indigo-600 bg-indigo-200 last:mr-0 mr-1">
						Symbol For Viewing:
				</span>
				<div className="flex content-start items-stretch m-4">
					{symbols.map((symbol, i) => {
						return <div className="self-end" key={i}>
							<button onClick={() => add_symbol(symbol)} className={`flex ${symbolState == symbol? 'bg-gray-300 text-black' : 'bg-transparent text-gray-600'} px-2 py-2 mx-2 font-bold hover:bg-gray-200 border-2 border-gray-500 rounded`}
						>{symbol}</button>
						</div>
					})}
				</div>
			</div>
			{/* delete table */}
			<div className="flex">
				<Button onClick={() => deleteColumn(tableId, columnIndex)} text="Delete Column" color="red"/>
			</div>
			
		</>
	)
}