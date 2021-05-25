import React, { useState, useEffect } from 'react';
import { Button } from '../components/buttons'
import { Input } from '../components/inputs'
import { Label } from '../components/labels'

export const TableToolBar = ({
	table, userCollections, setCollectionForTable, handleTableTitleUpdate,
	handleTableSort, addColumnToTable, addRowToTable, deleteTable
}) => {


	return (
		<>
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
			{table.type === 'collection' && (table.collection.length === 0) && 
				<div className="mb-4">
					<Label text={`Choose Collection:`} color={'indigo'}/>
				{table.type === 'collection' && userCollections.map((collection_name, i) => {
					return <Button key={i} onClick={() => setCollectionForTable(table.id, collection_name)}
						text={collection_name} color="yellow"
						/>
					})}
				</div>
			}

			{table.type === 'collection' && (table.collection.length > 0) &&
				<div className="flex">
					<Label text={`Collection Selected:`} color={'indigo'}/>
					<Label text={table.collection} color={'yellow'}/>
				</div> 
			}

			{/* Sort by */}
			<div className="mb-4">
				<Input
					placeholder={'Enter collection property'}
					label={"Sort by:"}
					value={table.sort_by}
					onChange={(e) => handleTableSort(table.id, e.target.value)}
				/>
			</div>

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
			<Button onClick={() => deleteTable(table.id)} text="Delete table" color="red"/>
		</>
	)
}