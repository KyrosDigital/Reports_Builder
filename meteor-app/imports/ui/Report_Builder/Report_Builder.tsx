import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useSubscription from '../../api/hooks'
import { 
	ReportStructure, 
	ReportColumnStructure, 
	Report_Structure_Collection, 
	StrapiClientDataCollection
} from '../../api/collections';
import {runMath} from '../../api/math';
import 'underscore';


export const Report_Builder = () => {

	const loading = useSubscription('ReportStructure')
	const loading2 = useSubscription('ClientData')

	const [reportStructure, setReportStructure] = useState<ReportStructure>({_id: '', tables: []})
	const [columSelected, setColumnSelected] = useState({tableId: '', columnId: ''})
	const [cellSelected, setCellSelected] = useState({tableId: '', cellId: ''})

	useEffect(() => {
		if(!loading) {
			let query = Report_Structure_Collection.findOne()
			if(query) setReportStructure(query)
		}
	}, [loading])

	useEffect(() => {
		// console.log(reportStructure)
	}, [reportStructure])

	

	const createNewTable = () => {
		setReportStructure({_id: '', tables: [...reportStructure.tables, {
			id: uuidv4(),
			columns: [{id: uuidv4(), label: 'col1'}, {id: uuidv4(), label: 'col2'}, {id: uuidv4(), label: 'col3'}],
			rows: [{
				id: uuidv4(),
				cells: [{id: uuidv4()}, {id: uuidv4()}, {id: uuidv4()}]
			}, {
				id: 'row2',
				cells: [{id: uuidv4()}, {id: uuidv4()}, {id: uuidv4()}]
			}], 
		}] })
	}

	const addColumnToTable = (tableId: string) => {
		const updatedTables = reportStructure.tables.map(table => {
			if(table.id === tableId) {
				table.columns.push({id: uuidv4(), label: `col${table.columns.length + 1}`})
				table.rows.forEach(row => { row.cells.push({id: uuidv4()}) })
			}
			return table
		})

		setReportStructure({ _id: '', tables:  updatedTables})
	}

	const addRowToTable = (tableId: string) => {
		const cells = (tableColumns: Array<ReportColumnStructure>) => {
			return tableColumns.map(() => ({id: uuidv4()}))
		}
		const updatedTables = reportStructure.tables.map(table => {
			if(table.id === tableId) {
				table.rows.push({id: uuidv4(), cells: cells(table.columns)})
			}
			return table
		})

		setReportStructure({ _id: '', tables:  updatedTables})
	};

	function MyControlledInput({ }) {
		const [value, setValue] = useState('');
		var queries = [];
	  
		const onChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		  setValue(event.target.value);
		};

		function querySelection(element: string) {
			let collectionName = element;
			let path = "";
			let arr = StrapiClientDataCollection.find({"collecitonName" : element}).fetch();
			let keys = Object.keys(arr[0]["data"]);
			keys.forEach((the) => {
				return <button onClick={the => {
					let dataString = "data.";
					let theString = String(the);
					path = dataString.concat(theString);
				})}> {the} </button>
			})
			let query = {};
			query["collection"] = collectionName;

		}
		
		const handleButtonClicked = () => {
			
			for (var i = 0; i < value.length; i++) {
				if (value[i] == '&') {
					var keys = _.uniq(StrapiClientDataCollection.find({}, {fields : {"collectionName" : 1}}).fetch());
					keys.forEach((element) => {
						return <button onClick={querySelection(element)}> {element} </button>
					});
				}
			}
			console.log(runMath(value, query));
			setValue('');
			//console.log(temp);
			
		}

		return (
		  <>
			<div>Input equation: {value}</div>
			<input value={value} onChange={onChange} />
			<button onClick={handleButtonClicked}> submit</button>
		  </>
		);
	}

  return (
    <div>
      <p>Report Builder</p>

			<button onClick={createNewTable}>+ New Table</button>
			<MyControlledInput/>
			{columSelected.tableId !== '' && <div>
				<p>{`Table: ${columSelected.tableId}`}</p>
				<p>{`Column: ${columSelected.columnId}`}</p>
			</div>}
			
			{cellSelected.tableId !== '' && <div>
				<p>{`Table: ${cellSelected.tableId}`}</p>
				<p>{`Cell: ${cellSelected.cellId}`}</p>
			</div>}
			
			{/* tables */}
			{reportStructure.tables.map((table) => {
				return <div key={table.id} className="table">

					<div className="">

						{/* controls */}
						<button onClick={() => addColumnToTable(table.id)}>+ Column</button>
						<button onClick={() => addRowToTable(table.id)}>+ Row</button>

						{/* column headers */}
						<div className="row"> 
							{table.columns.map(col => {
								return <div key={col.id} className="col hover-col" onClick={() => setColumnSelected({tableId: table.id, columnId: col.id})}>
									<div>{col.label}</div>
								</div>
							})}
						</div>
						
						{/* rows and cells */}
						{table.rows.map((row) => {
							return <div key={row.id} className="row">
								{row.cells.map((cell) => {
									return <div key={cell.id} className="col hover-cell" onClick={() => setCellSelected({tableId: table.id, cellId: cell.id})}>
										<div></div>
									</div>
								})}
							</div>
						})}
						
					</div>
					
				</div>
			})}
    </div>
  );
};