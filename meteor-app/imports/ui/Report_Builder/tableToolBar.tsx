import React, { useState } from 'react';
import { Button } from '../components/buttons'
import { DataPicker } from '../components/dataPicker';
import { Input } from '../components/inputs'
import { Label } from '../components/labels'

export const TableToolBar = ({
	table, setCollectionForTable, handleTableTitleUpdate,
	handleTableSort, addColumnToTable, addRowToTable, deleteTable, removeRow
}) => {

	const [toggleDataPicker, setToggleDataPicker] = useState(false)
	const [target, setTarget] = useState(null)
	const [collectionOnly, setCollectionOnly] = useState(false)
	const [forcedCollection, setForcedCollection] = useState(null)

	const handleDataPicker = (target) => {
		if (target === 'collection') {
			setCollectionOnly(true)
			setForcedCollection(null)
		}
		setTarget(target)
		setToggleDataPicker(true)
	}

	const handleDataPickerResult = (value) => {
		if (target === 'sort_by') {
			handleTableSort(table.id, value.key)
		}
		if (target === 'collection') {
			setCollectionForTable(table.id, value.collection_name)
			setForcedCollection(value.collection_name)
			handleTableSort(table.id, '') // reset the sort if changing collections
		}
		
		setTarget(null)
		setCollectionOnly(false)
	}

	return (
		<>

			{/* Modal for selecting data */}
			<DataPicker 
				callback={(value) => handleDataPickerResult(value)} 
				open={toggleDataPicker} setOpen={setToggleDataPicker} 
				collectionOnly={collectionOnly} 
				forcedCollection={table.collection ? forcedCollection : null}
			/>

			{/* Table type */}
			<div className="flex">
				<Label text={`Table Type:`} color={'indigo'}/>
				<Label text={table.type} color={'yellow'}/>
			</div>

			{/* Table title */}
			<div className="mb-4">
				<Input 
					placeholder={'Enter Table Title'}
					label={"Table Title:"} 
					value={table.title} 
					onChange={(e) => handleTableTitleUpdate(table.id, e.target.value)}
					/>
			</div>

			{/* collection table - select collection to drive the table */}
			{table.type === 'collection' && <div className="mb-4">
				<Input
					placeholder={'Select Collection'}
					label={"Choose Collection:"}
					value={table.collection}
					onClick={() => handleDataPicker('collection')}
					disabled={true}
				/>
			</div>}

			{/* Sort by */}
			{table.collection && <div className="mb-4">
				<Input
					placeholder={'Enter collection property'}
					label={"Sort by:"}
					value={table.sort_by}
					onClick={() => handleDataPicker('sort_by')}
					disabled={true}
				/>
			</div>}

			{/* controls */}
			<div className="mb-4">
				<Label text={`Structure:`} color={'indigo'}/>
				<div className="flex">
					<Button onClick={() => addColumnToTable(table.id)} text="+ Column" color="green"/>

					{table.type === 'static' && 
						<Button onClick={() => addRowToTable(table.id)} text="+ Row" color="green"/>
					}

          
				</div>
			</div>
      
			{/* delete table */}
			<Button onClick={() => removeRow(table.id)} text="Remove row" color="red"/>

			{/* delete table */}
			<Button onClick={() => deleteTable(table.id)} text="Delete table" color="red"/>
		</>
	)
}