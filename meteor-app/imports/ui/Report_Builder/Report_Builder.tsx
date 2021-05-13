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
	const [collections, setCollections] = useState<any>({})

	useEffect(() => {
		if(!loading) {
			let query = Report_Structure_Collection.findOne()
			if(query) setReportStructure(query)
		}
	}, [loading])

	useEffect(() => {
		if (!loading2) {
			let collNames = StrapiClientDataCollection.find({"userId" : "609d427f5077b0819f0e6011"}, {fields : {"collectionName" : 1}}).fetch()
		let documents: {[k: string]: any} = {}
		collNames.forEach((el) => {
			documents[el["collectionName"]] = (StrapiClientDataCollection.findOne({"userId" : "609d427f5077b0819f0e6011", "collectionName" : el["collectionName"]}, {fields : {"collectionName" : 1, "data" : 1}}))
		})
		setCollections(documents)
		}
	}, [loading2])

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
		const [mongoQuery, setMongoQuery] = useState<any>({})
		const [currentQuery, setCurrentQuery] = useState<any>({})
		var queries : any = []
	  
		const onChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		  setValue(event.target.value);
		};

		function updateChoices(the: string) {
			if (!("collection" in mongoQuery)) {
				let temp:{[k: string] : any} = {}
				temp["collectionName"] = the
				temp["path"] = "data"
				setMongoQuery(temp)
				setCurrentQuery(collections[the]["data"])
				console.log(collections[the]["data"])
				//console.log(currentQuery)
				var keys = Object.keys(collections[the]["data"])
				setQueryChooser(keys)
				// console.log("this works")
			} else {
				console.log('working')
				if (typeof(currentQuery[the] == "object")) {
					let temp = mongoQuery
					temp["path"] = temp["path"].concat("." + the)
					setMongoQuery(temp)
					setCurrentQuery(currentQuery[the])
					var keys = Object.keys(currentQuery[the]);
					setQueryChooser(keys)
				} else {
					queries.push(mongoQuery)
					setCurrentQuery({})
					setMongoQuery({})
					setQueryChooser([])
				}
				
			}
		}
		
		const handleButtonClicked = () => {
			
			for (var i = 0; i < value.length; i++) {
				if (value[i] == '&') {
					// console.log(mongoQuery)
					setQueryChooser(Object.keys(collections))
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