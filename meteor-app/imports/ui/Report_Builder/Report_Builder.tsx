import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import useSubscription from '../../api/hooks'
import { 
	ReportStructure, 
	ReportColumnStructure, 
	Report_Structure_Collection, 
	StrapiClientDataCollection
} from '../../api/collections';


export const Report_Builder = () => {

	const loading = useSubscription('ReportStructure')
	const loading2 = useSubscription('ClientData')

	const [reportStructure, setReportStructure] = useState<ReportStructure>({_id: '', tables: []})
	const [columSelected, setColumnSelected] = useState({tableId: '', columnId: ''})
	const [cellSelected, setCellSelected] = useState({tableId: '', cellId: ''})
	const [collections, setCollections] = useState<any>({})
	// holds all queries, hopefully under the key of the variable they're replacing
	const [queries, setQueries] = useState<any>({})
	// hold variables to be set as keys for everything else
	const [variables, setVariables] = useState<any[]>([])
	const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 
		'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 
		'x', 'y', 'z']

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
		// used for input
		const [value, setValue] = useState('');
		// displaying stuff in the buttons
		const [queryChooser, setQueryChooser] = useState<any>({});
		// storing the query in string form
		const [mongoQuery, setMongoQuery] = useState<any>({})
		// for the update choices, I just need the first if statement to run once
		const [counter, setCounter] = useState<any>({})
	  
		const onChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		  setValue(event.target.value);
		};
		
		useEffect(() => {
			queryChooser !== {} && console.log('I changed queryChooser to ', queryChooser);
		  }, [queryChooser])
	
		function updateChoices(the: string, el : string) {
			if (counter[el] < 1) {
				let temp:{[k: string] : any} = {}
				let count = counter
				count[el] = 1
				setCounter(count)
				temp[el]["collectionName"] = the
				temp[el]["path"] = "data"
				setMongoQuery(temp)
				console.log(collections[the]["data"])
				//console.log(currentQuery)
				var keys = Object.keys(collections[the]["data"])
				setQueryChooser(keys)
			} else { // we are assuming no nested objects
				let temp = mongoQuery
				temp[el]["path"] = temp["path"].concat("." + the)
				let temp2 = queries
				temp2[el] = temp
				setQueries(temp2)
				setMongoQuery({})
				setQueryChooser([])
				setCounter(0)
				console.log(queries)
			}
		}
		
		const handleButtonClicked = () => {
			var vars: any[] = []
			for (var i = 0; i < value.length; i++) {
				if (alphabet.includes(value[i])) {
					console.log("letter detected")
					
					// setting variables(keys for other stuff)
					vars.push(value[i])
				}
			}
			//setVariables(vars)
			//console.log(vars)
			var temp_queries:{[k: string] : any} = {}
			var temp_queryChooser:{[k: string] : any} = {}
			var temp_counter:{[k: string] : any} = {}
			for(var i = 0; i < vars.length; i++) {
				temp_queries[vars[i]] = false
				temp_queryChooser[vars[i]] = Object.keys(collections)
				temp_counter[vars[i]] = 0
			}
			setQueries(temp_queries)
			console.log("temp_querychooser" , temp_queryChooser)
			setQueryChooser(temp_queryChooser)
			//setCounter(temp_counter)
			//console.log(temp_queries)
			
		}
	
		return (
		  <>
			<div>Input equation: {value}</div>
			<input value={value} onChange={onChange} />
			<button onClick={handleButtonClicked}> submit</button>
			<div className="query_selection">
				{variables.map((el : string, ind) => {
					console.log(queryChooser)
					console.log(el)
					return <div key = {ind} className = ""> 
						{queryChooser[el].map((element : string, index : number) => {
							return <button key = {index} onClick={() => updateChoices(element, el)}> {element} </button>
						})}
						</div>
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