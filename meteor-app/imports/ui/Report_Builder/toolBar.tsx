import React, { useState, useEffect } from 'react';

export const ToolBar = ({
	table, handleTableTitleUpdate, userCollections, setCollectionForTable, deleteTable
}) => {

  return (
    <div style={{
			height: "100vh",
			width: "250px",
			backgroundColor: 'slategray',
			position: "fixed",
			right: 0
		}}>
      
			{/* Table type */}
			<div style={{marginBottom: '25px'}}>Table Type: {table.type}</div>

			{/* Table title */}
			<div style={{marginBottom: '25px'}}>
				<label>Table Title: </label>
				<input placeholder={'Enter Table Title'} value={table.title} onChange={(e) => handleTableTitleUpdate(table.id, e.target.value)}/>
			</div>

			{/* collection table - select collection to drive the table */}
			{table.type === 'collection' && (table.collection.length === 0) && 
				<div style={{marginBottom: '25px'}}>
					<span>Choose Collection:</span>
					{table.type === 'collection' && userCollections.map((collection, i) => {
						return <button key={i} onClick={() => setCollectionForTable(table.id, collection.collectionName)}>{collection.collectionName}</button>
					})}
				</div>
			}

			{table.type === 'collection' && (table.collection.length > 0) && 
				<div style={{marginBottom: '25px'}}>Collection Selected: {table.collection}</div>}

			{/* delete table */}
			<button onClick={() => deleteTable(table.id)}>- delete table</button>

    </div>
  );
};