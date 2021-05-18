import React, { useState, useEffect } from 'react';
import { Button } from '../components/buttons'
import { Input } from '../components/inputs'
import { Label } from '../components/labels'
import { StrapiClientDataCollection } from '../../api/collections'
import toast from 'react-hot-toast';

export const ColumnToolBar = ({
	column, columnIndex, tableId, 
	handleColumnLabelChange, handleColumnPropertyChange,
	handleFormulaUpdate, columnFormula,
	deleteColumn, userCollections
}) => {

	const [formulaString, setFormulaString] = useState('')
	const [formulaVariables, setFormulaVariables] = useState([])
	const [formulaValues, setFormulaValues] = useState([])
	const alphabet = "abcdefghijklmnopqrstuvwxyz"

	// preload data from loaded report structure
	useEffect(() => {
		if(columnFormula) {
			setFormulaString(columnFormula.expression)
			setFormulaValues(columnFormula.values)

			const mapVariableArray = columnFormula.values.map(value => {
				const query = StrapiClientDataCollection.findOne({"userId" : "60958c98857a7b14acb156d9", "collectionName" : value.collectionName}, {fields : {"collectionName" : 1, "data" : 1}})
				return {
					char: value.key, 
					collectionName: value.collectionName,
					keys: query ? Object.keys(query.data) : [],
					selectedKey: value.property
				}
			})
			setFormulaVariables(mapVariableArray)
		} else { // handles toggling between columns, if one has a formula and one does not
			setFormulaString('')
			setFormulaValues([])
			setFormulaVariables([])
		}
	}, [columnFormula])

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
				setFormulaVariables(oldArray => [...oldArray, {char: char, collectionName: null, keys: [], slectedKey: null}]);
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
				collectionName: variable.collectionName || null,
				queryModifier: "data.agentId", // TODO: 
				query: {"userId": "60958c98857a7b14acb156d9", "collectionName": variable.collectionName}, // TODO:
				property: variable.selectedKey || null
			}
		})
		setFormulaValues(values)
	}, [formulaVariables])

	const handleSelectCollectionForVariable = (collectionName, i) => {
		const query = StrapiClientDataCollection.findOne({"userId" : "60958c98857a7b14acb156d9", "collectionName" : collectionName}, {fields : {"collectionName" : 1, "data" : 1}})
		setFormulaVariables(prevState => {
			prevState[i].collectionName = collectionName
			prevState[i].keys = Object.keys(query.data)
			return [...prevState]
		});
	}

	const handleSelectedKey = (key, i) => {
		setFormulaVariables(prevState => {
			prevState[i].selectedKey = key
			return [...prevState]
		});
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

	return (
		<>
			{/* Column type */}
			<div className="flex">
				<Label text={`Column Type:`} color={'indigo'}/>
				{formulaString && <Label text={'Formula'} color={'yellow'}/>}
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

			{/* Column property */}
			<div className="mb-4">
				<Input 
					placeholder={'Enter column property'}
					label={"Column Property:"} 
					value={column.property} 
					onChange={(e) => handleColumnPropertyChange(tableId, columnIndex, e.target.value)}
					/>
			</div>

			{/* formula */}
			<div className="mb-4">
				<Input 
					placeholder={'(2 * x) / y'}
					label={"Column Formula:"} 
					value={formulaString} 
					onChange={(e) => setFormulaString(e.target.value.toLowerCase())}
					/>
			</div>

			{/* formula variables*/}
			{formulaVariables.map((variable, i) => {

				let label = `${variable.char}`
				if(variable.collectionName) label = `${variable.char} = ${variable.collectionName}`
				if(variable.selectedKey) label = `${variable.char} = ${variable.collectionName}.${variable.selectedKey}`

				return <div className="mb-4" key={i}>
					<Label text={label} color={'indigo'}/>
					{!variable.collectionName && userCollections.map((collection, y) => {
						return <Button key={y} onClick={() => handleSelectCollectionForVariable(collection.collectionName, i)} text={collection.collectionName} color="green"/>
					})}
					{!variable.selectedKey && variable.keys.map((key, x) => {
						return <Button key={x} onClick={() => handleSelectedKey(key, i)} text={key} color="green"/>
					})}
				</div>
			})}
			
			{/* Save formula */}
			<div>
				<Button onClick={() => saveFormula()} text={'Save Formula'} color="blue"/>
			</div>
			

			{/* delete table */}
			<div>
				<Button onClick={() => deleteColumn(tableId, columnIndex)} text="Delete Column" color="red"/>
			</div>
			
		</>
	)
}