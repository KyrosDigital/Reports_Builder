import React from 'react';
import { ProgressBar } from '../components/progressBar'
import { TableToolBar } from './tableToolBar'
import { ColumnToolBar } from './columnToolBar'

export const ToolBar = ({
	table, handleTableTitleUpdate, handleTableSort,
	userCollections, setCollectionForTable, 
	addColumnToTable, deleteColumn, addRowToTable, deleteTable,
	column, columnFormula, handleColumnLabelChange, handleColumnPropertyChange,
	handleFormulaUpdate, handleFormulaRemoval
}) => {

  return (
    <div className="h-full w-3/12 p-4 absolute top-12 right-0 bg-white filter drop-shadow-md">
      
			{/* TODO: wire this up to keep track of if table is completed */}
			<ProgressBar />

			{table && 
				<TableToolBar 
					table={table}
					handleTableTitleUpdate={handleTableTitleUpdate}
				handleTableSort={handleTableSort}
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
					handleColumnPropertyChange={handleColumnPropertyChange}
					deleteColumn={deleteColumn}
					userCollections={userCollections}
					handleFormulaUpdate={handleFormulaUpdate}
					handleFormulaRemoval={handleFormulaRemoval}
					columnFormula={columnFormula}
				/>
			}

    </div>
  );
};