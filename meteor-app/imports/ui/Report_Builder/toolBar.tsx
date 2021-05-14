import React, { useState, useEffect } from 'react';
import { Button } from '../components/buttons'
import { Input } from '../components/inputs'
import { Label } from '../components/labels'
import { TableToolBar } from './tableToolBar'
import { ColumnToolBar } from './columnToolBar'

export const ToolBar = ({
	table, handleTableTitleUpdate, 
	userCollections, setCollectionForTable, 
	addColumnToTable, addRowToTable, deleteTable,
	column, handleColumnLabelChange
}) => {

  return (
    <div className="container h-3/4 w-3/12 p-4 absolute top-12 right-0 bg-gray-100">
      
			{table && 
				<TableToolBar 
					table={table}
					handleTableTitleUpdate={handleTableTitleUpdate}
					userCollections={userCollections}
					setCollectionForTable={setCollectionForTable}
					addColumnToTable={addColumnToTable}
					addRowToTable={addRowToTable}
					deleteTable={deleteTable}
				/>
			}

			{column && 
				<ColumnToolBar 
					column={column.column}
					columnIndex={column.columnIndex}
					tableId={column.tableId}
					handleColumnLabelChange={handleColumnLabelChange}
					deleteColumn={() => {}}
				/>
			}

    </div>
  );
};