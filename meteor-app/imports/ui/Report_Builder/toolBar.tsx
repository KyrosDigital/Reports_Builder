import React from 'react';
import { ProgressBar } from '../components/progressBar'
import { TableToolBar } from './tableToolBar'
import { ColumnToolBar } from './columnToolBar'

export const ToolBar = ({
	reportStructure, table, handleTableTitleUpdate, handleTableSort,
	userCollections, setCollectionForTable, 
	addColumnToTable, deleteColumn, addRowToTable, deleteTable,
	column, columnFormula, handleColumnLabelChange, handleColumnPropertyChange,
	handleColumnRelationKeyChange,
	handleFormulaUpdate, handleFormulaRemoval, handleColumnSymbol, removeRow
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
					setCollectionForTable={setCollectionForTable}
					addColumnToTable={addColumnToTable}
					addRowToTable={addRowToTable}
					deleteTable={deleteTable}
					removeRow={removeRow}
				/>
			}

			{column && 
				<ColumnToolBar 
					reportStructure={reportStructure}
					column={column.column}
					columnIndex={column.columnIndex}
					tableId={column.tableId}
					handleColumnLabelChange={handleColumnLabelChange}
					handleColumnPropertyChange={handleColumnPropertyChange}
					handleColumnRelationKeyChange={handleColumnRelationKeyChange}
					deleteColumn={deleteColumn}
					userCollections={userCollections}
					handleFormulaUpdate={handleFormulaUpdate}
					handleFormulaRemoval={handleFormulaRemoval}
					columnFormula={columnFormula}
					handleColumnSymbol={handleColumnSymbol}
				/>
			}

    </div>
  );
};