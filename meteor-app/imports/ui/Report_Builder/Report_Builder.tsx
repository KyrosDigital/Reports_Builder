import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useSubscription from '../../api/hooks'
import { 
	ReportStructure, 
	ReportColumnStructure, 
	Report_Structure_Collection, 
	StrapiClientDataCollection
} from '../../api/collections';
import 'underscore';
import _, { any } from 'underscore';


export const Report_Builder = () => {

	const loading = useSubscription('ReportStructure')
	const loading2 = useSubscription('ClientData')

	const [reportStructure, setReportStructure] = useState<ReportStructure>({_id: '', tables: []})
	const [columSelected, setColumnSelected] = useState({tableId: '', columnId: ''})
	const [cellSelected, setCellSelected] = useState({tableId: '', cellId: ''})
	const [collections, setCollections] = useState<object[]>([])

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

	const addColumnToTable = (tableId: any) => {
		const updatedTables = reportStructure.tables.map(table => {
			if(table.id === tableId) {
				table.columns.push({id: uuidv4(), label: `col${table.columns.length + 1}`})
				table.rows.forEach(row => { row.cells.push({id: uuidv4()}) })
			}
			return table
		})

		setReportStructure({ _id: '', tables:  updatedTables})
	}

	const addRowToTable = (tableId: any) => {
		const cells = (tableColumns: any[]) => {
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
		const [queryChooser, setQueryChooser] = useState<any[]>([]);
		var mongoQuery: {[k: string]: any} = {};
		var currentQuery: {[k: string]: any} = {};
		var queries : any = []
	  
		const onChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		  setValue(event.target.value);
		};

		const updateChoices = (the: string) => {
			if (!("collectionName" in mongoQuery)) {
				console.log(mongoQuery)
				console.log("first branch")
				console.log("the: " + the)
				
				mongoQuery["collectionName"] = the
				mongoQuery["path"] = "data"
				currentQuery = StrapiClientDataCollection.find({"collectionName" : the}).fetch()[0]["data"]
				//console.log(currentQuery)
				var keys = Object.keys(currentQuery)
				setQueryChooser(keys)
				// console.log("this works")
			} else {
				console.log('working')
				if (typeof(currentQuery[the] == "object")) {
					mongoQuery["path"] = mongoQuery["path"].concat(".${the}")
					currentQuery = currentQuery[the]
					var keys = Object.keys(currentQuery);
					setQueryChooser(keys)
				} else {
					queries.push(mongoQuery)
					mongoQuery = {}
					currentQuery = {}
					setQueryChooser([])
				}
				
			}
			//console.log(mongoQuery)
		}
		
		const handleButtonClicked = () => {
			
			for (var i = 0; i < value.length; i++) {
				if (value[i] == '&') {
					var objects = _.uniq(StrapiClientDataCollection.find({}, {fields : {"collectionName" : 1}}).fetch());
					var keys : string[] = []
					mongoQuery = {}
					console.log(mongoQuery)
					objects.forEach((el) => {
						if (!(keys.includes(el["collectionName"]))) {
							keys.push(el["collectionName"])
						}
					})
					setQueryChooser(keys)
				}
			}
			// console.log(runMath(value, queries));
			setValue('');
			
		}

		return (
		  <>
			<div>Input equation: {value}</div>
			<input value={value} onChange={onChange} />
			<button onClick={handleButtonClicked}> submit</button>
			<div className="query_selection">
				{queryChooser.map((element, index) => {
					return <button key = {index} onClick={() => updateChoices(element)}> 
					{element} </button>
				})}
			</div>
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