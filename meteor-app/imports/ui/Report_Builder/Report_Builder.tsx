import { Meteor } from 'meteor/meteor'
import React, { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { ToolBar } from './toolBar'
import { Button } from '../components/buttons'
import { Input } from '../components/inputs'
import { ToggleSwitch } from '../components/toggleSwitch'
import useSubscription from '../../api/hooks'
import { ReportStructure, TableColumn } from '../../api/types/reports'
import { useParams } from 'react-router-dom';
import { Report_Structures } from '../../api/collections'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'


export const Report_Builder = () => {
	const { id } = useParams()

	const loading1 = useSubscription('ReportData')
	const loading2 = useSubscription('ReportStructure')

	const [reportStructure, setReportStructure] = useState<ReportStructure>({ _id: id, name: '', tables: [], formulas: [], public: false, tags: [''] })
	const [cellSelected, setCellSelected] = useState({ tableId: '', cellId: '' })
	const [userCollections, setUserCollections] = useState([])
	const [showToolBar, setShowToolBar] = useState(false)
	const [selectedTable, setSelectedTable] = useState(null)
	const [selectedColumn, setSelectedColumn] = useState(null)
	const [selectedColumnFormula, setSelectedColumnFormula] = useState(null)
	const [tags, setTags] = useState([])
	const [showChoices, setShowChoices] = useState(false)
	

	useEffect(() => {
		Meteor.call('Get_Tags', (error, result) => {
			if (error) console.log(error)
			if (result) setTags(result)
		})
	}, [])

	useEffect(() => {
		if (!loading1 && !loading2) {

			Meteor.call('Fetch_Collection_Names', (error, result) => {
				if (error) console.log(error)
				if (result) setUserCollections(result)
			})

			if (id) {
				const reportQuery = Report_Structures.findOne({ _id: id })
				setReportStructure(reportQuery)
			}
		}
	}, [loading1, loading2])

	useEffect(() => {
		// console.log(reportStructure)
	}, [reportStructure])

	const createNewTable = (type: string) => {
		const table = {
			id: uuidv4(),
			title: '',
			type: type,
			columns: [{ id: uuidv4(), label: '', property: '', enum: '' }],
			rows: [],
			collection: '',
			sort_by: ''
		}
		setReportStructure(prevState => {
			return { ...prevState, tables: [...reportStructure.tables, table] }
		});
		setSelectedTable(table)
		setShowToolBar(true)
	}

	const handleReportName = (value) => {
		setReportStructure(prevState => {
			return { ...prevState, name: value }
		});
	}

	const setCollectionForTable = (tableId: string, collection_name: string) => {
		let tableIndex = reportStructure.tables.findIndex(table => table.id === tableId)
		reportStructure.tables[tableIndex].collection = collection_name
		reportStructure.tables[tableIndex].columns.forEach(col => col.property = '') // reset all column properties when collection changes
		setReportStructure(prevState => {
			return { ...prevState, tables: reportStructure.tables }
		});
	}

	const addColumnToTable = (tableId: string) => {
		const updatedTables = reportStructure.tables.map(table => {
			if (table.id === tableId) {
				table.columns.push({ id: uuidv4(), label: '', property: '', enum: '' })
				table.rows.forEach(row => {
					row.cells.push({
						id: uuidv4(),
						index: table.columns.length,
						type: '',
						property: '',
						propertyValue: '',
						value: '',
						expression: '',
					})
				})
			}
			return table
		})
		setReportStructure(prevState => {
			return { ...prevState, tables: updatedTables }
		});
	}

	const handleAccess = () => {
		if (!reportStructure.public) {
			setReportStructure(prevState => {
				return { ...prevState, public: true }
			});
		} else {
			setReportStructure(prevState => {
				return { ...prevState, public: false }
			});
		}
	}

	// deleting a column also means deleting coresponding formulas
	const deleteColumn = (tableId, columnIndex) => {
		let c = confirm("Are you sure you want to delete this column?")
		if (c) {
			let tableIndex = reportStructure.tables.findIndex(table => table.id === tableId)
			reportStructure.tables[tableIndex].columns.splice(columnIndex, 1);
			let formulaIndex = reportStructure.formulas.findIndex(formula => (formula.tableId === tableId && formula.columnIndex === columnIndex))
			reportStructure.formulas.splice(formulaIndex, 1);
			setReportStructure(prevState => {
				return { ...prevState, tables: reportStructure.tables, formulas: reportStructure.formulas }
			});
		}
	}

	const addRowToTable = (tableId: string) => {
		const cells = (tableColumns: Array<TableColumn>) => {
			return tableColumns.map(() => ({ id: uuidv4() }))
		}
		const updatedTables = reportStructure.tables.map(table => {
			if (table.id === tableId) {
				table.rows.push({ id: uuidv4(), cells: cells(table.columns) })
			}
			return table
		})

		setReportStructure(prevState => {
			return { ...prevState, tables: updatedTables }
		});
	}

	const handleColumnLabelChange = (tableId, columnIndex, label) => {
		let tableIndex = reportStructure.tables.findIndex(table => table.id === tableId)

		reportStructure.tables[tableIndex].columns[columnIndex].label = label
		setReportStructure(prevState => {
			return { ...prevState, tables: reportStructure.tables }
		});
	}

	const handleColumnSymbol = (tableId, columnIndex, symbol) => {
		let tableIndex = reportStructure.tables.findIndex(table => table.id === tableId)

		reportStructure.tables[tableIndex].columns[columnIndex].symbol = symbol
		setReportStructure(prevState => {
			return { ...prevState, tables: reportStructure.tables }
		});
	}

	const handleColumnPropertyChange = (tableId, columnIndex, collection_name, property) => {
		let tableIndex = reportStructure.tables.findIndex(table => table.id === tableId)
		reportStructure.tables[tableIndex].columns[columnIndex].collection_name = collection_name
		reportStructure.tables[tableIndex].columns[columnIndex].property = property
		setReportStructure(prevState => {
			return { ...prevState, tables: reportStructure.tables }
		});
	}

	const deleteTable = (tableId) => {
		let c = confirm("Are you sure you want to delete this table?")
		if (c) {
			let tableIndex = reportStructure.tables.findIndex(table => table.id === tableId)
			reportStructure.tables.splice(tableIndex, 1);
			setReportStructure(prevState => {
				return { ...prevState, tables: reportStructure.tables }
			});
			setShowToolBar(false)
			setSelectedTable(null)
		}
	}

	const handleTableTitleUpdate = (tableId, title) => {
		let tableIndex = reportStructure.tables.findIndex(table => table.id === tableId)
		reportStructure.tables[tableIndex].title = title
		setReportStructure(prevState => {
			return { ...prevState, tables: reportStructure.tables }
		});
	}

	const handleTableSort = (tableId, sortBy) => {
		let tableIndex = reportStructure.tables.findIndex(table => table.id === tableId)
		reportStructure.tables[tableIndex].sort_by = sortBy
		setReportStructure(prevState => {
			return { ...prevState, tables: reportStructure.tables }
		});
	}

	const handleFormulaUpdate = (formula) => {
		let tableIndex = reportStructure.tables.findIndex(table => table.id === formula.tableId)
		let existingFormula = reportStructure.formulas.find(each => (each.tableId === formula.tableId && each.columnId === formula.columnId))
		if (!existingFormula) { // add a new formula to the set
			formula.id = uuidv4()
			// apply formulaId to column
			reportStructure.tables[tableIndex].columns[formula.columnIndex].formulaId = formula.id
			setReportStructure(prevState => {
				return { ...prevState, tables: reportStructure.tables, formulas: [...reportStructure.formulas, formula] }
			});
		} else { // update an existing formula
			let formulaIndex = reportStructure.formulas.findIndex(each => each.id === existingFormula.id)
			reportStructure.formulas[formulaIndex] = formula
			setReportStructure(prevState => {
				return { ...prevState, formulas: reportStructure.formulas }
			});
		}
	}

	const handleFormulaRemoval = (tableId, columnIndex, columnId) => {
		let tableIndex = reportStructure.tables.findIndex(table => table.id === tableId)
		let existingFormula = reportStructure.formulas.find(each => (each.tableId === tableId && each.columnId === columnId))
		if (existingFormula) {
			reportStructure.tables[tableIndex].columns[columnIndex].formulaId = undefined
			let formulaIndex = reportStructure.formulas.findIndex(each => each.id === existingFormula.id)
			reportStructure.formulas.splice(formulaIndex, 1);
			setReportStructure(prevState => {
				return { ...prevState, tables: reportStructure.tables, formulas: reportStructure.formulas }
			});
		}
	}

	const toggleToolBarForTable = (table) => {
		if (table) {
			setSelectedColumn(null)
			setSelectedColumnFormula(null)
			setSelectedTable(table)
			setShowToolBar(true)
		}
	}

	const toggleToolBarForColumn = (tableId, column, columnIndex) => {
		if (column) {
			setSelectedTable(null)
			setSelectedColumn({ tableId, column, columnIndex })
			const columnSpecificFormula = reportStructure.formulas.find(formula => (formula.tableId === tableId && formula.columnId === column.id))
			if (columnSpecificFormula) {
				setSelectedColumnFormula(columnSpecificFormula);
			} else { setSelectedColumnFormula(null) }
			setShowToolBar(true)
		}
	}

	const saveReport = () => {
		Meteor.call('Upsert_Report', reportStructure, (error, result) => {
			if (error) console.log(error)
			if (result) {
				setReportStructure(result)
				toast.success('Report Saved!')
			}
		})
	}

	const update_tag = (tag) => {
		const updatedTags = reportStructure.tags
		if (reportStructure.tags.includes(tag)) {
			let index = reportStructure.tags.indexOf(tag)
			updatedTags.splice(index, 1)
		} else {
			updatedTags.push(tag)
		}
		setReportStructure(prevState => {
			return { ...prevState, tags: updatedTags }
		});
	}

	function useOutsideAlerter(ref) {
		useEffect(() => {
			/**
			 * Alert if clicked on outside of element
			 */
			function handleClickOutside(event) {
				if (ref.current && !ref.current.contains(event.target)) {
					setShowChoices(false)
				}
			}
			// Bind the event listener
			document.addEventListener("mousedown", handleClickOutside);
			return () => {
				// Unbind the event listener on clean up
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}, [ref]);
	}

	function OutsideAlerter(props) {
		const wrapperRef = useRef(null);
		useOutsideAlerter(wrapperRef);
	
		return <div ref={wrapperRef}>{props.children}</div>;
	}

	function TagSelector() {
		return (
			<div className="relative z-20 self-end">
				<button className="flex w-full py-2 pl-3 pr-10 border-black border-solid text-left bg-white rounded-lg shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm"
				onClick={()=> {showChoices? setShowChoices(false) : setShowChoices(true)}}>
					<span className="block truncate">Tags</span>
					<span className="items-end inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
						<SelectorIcon
							className="w-5 h-5 text-gray-400"
							aria-hidden="true"
						/>
					</span>
				</button>
				{showChoices && <div className="absolute w-full max-h-24 py-1 mt-1 z-30 overflow-auto text-base bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
					{tags.map((tag, tagIdx) => (
						<div
							key={tagIdx}
							className="text-amber-900 bg-amber-100 cursor-default select-none relative py-2 pl-10 pr-4 hover:bg-gray-200"
							onClick={() => update_tag(tag)}
						>
							{tag}
								<span
									className={`${
										reportStructure.tags.includes(tag) ? 'font-medium' : 'font-normal'
									} block truncate`}
								>
								</span>
								{reportStructure.tags.includes(tag)? (
									<span
										className='text-amber-600 absolute inset-y-0 left-0 flex items-center pl-3'
									>
										<CheckIcon className="w-5 h-5" aria-hidden="true" />
									</span>
								) : null}
						</div>
					))}
				</div>}
			</div>
		)
	}

	return (
		<div className='h-screen p-6 bg-gray-100'>

			{/* ToolBar */}
			{showToolBar &&
				<ToolBar
					reportStructure={reportStructure}
					table={selectedTable}
					handleTableTitleUpdate={handleTableTitleUpdate}
					handleTableSort={handleTableSort}
					userCollections={userCollections}
					setCollectionForTable={setCollectionForTable}
					deleteTable={deleteTable}
					addColumnToTable={addColumnToTable}
					deleteColumn={deleteColumn}
					addRowToTable={addRowToTable}
					column={selectedColumn}
					columnFormula={selectedColumnFormula}
					handleColumnLabelChange={handleColumnLabelChange}
					handleColumnPropertyChange={handleColumnPropertyChange}
					handleFormulaUpdate={handleFormulaUpdate}
					handleFormulaRemoval={handleFormulaRemoval}
					handleColumnSymbol={handleColumnSymbol}
				/>
			}

			<div className="relative flex z-10 justify-between mb-5 w-9/12 p-4 bg-white rounded filter drop-shadow-md">
				<ToggleSwitch enabled={!reportStructure.public} setEnabled={() => handleAccess()} />
				<OutsideAlerter>
					<TagSelector/>
				</OutsideAlerter>
				<Button onClick={() => saveReport()} text="Save Report" color="blue" />
			</div>

			<div className="relative flex z-0 justify-between mb-5 w-9/12 p-4 bg-white rounded filter drop-shadow-md">
				<Input placeholder={'Enter Report Name'} label={'Report Name'} value={reportStructure.name} flex={'flex'}
					onChange={(e) => handleReportName(e.target.value)}
				/>
				<div className="ml-4">
					<Button onClick={() => createNewTable('static')} text="+ New Static Table" color="green" />
					<Button onClick={() => createNewTable('collection')} text="+ New Collection Table" color="green" />
				</div>
			</div>
			


			<div className="flex-col w-9/12 z-0 overflow-auto">

				{/* tables */}
				{reportStructure.tables.map((table) => (
					<div key={table.id} className="mb-8 p-4 bg-white rounded filter drop-shadow-md">

						<div className="flex justify-between">
							<p className="text-md font-medium mb-3">{table.title}</p>
							<Button onClick={() => toggleToolBarForTable(table)} text="Edit ✏️" color="indigo" />
						</div>


						<div>

							{/* column headers */}
							<div className="flex">
								{table.columns.map((col, i) => {
									return <div
										key={col.id}
										className={`flex ${selectedColumn?.columnIndex == i? 'bg-blue-100': 'bg-white'} justify-center items-center h-8 w-40 max-w-sm m-1 border-2 border-indigo-200 hover:border-indigo-100 rounded-md text-xs cursor-pointer`}
										onClick={() => toggleToolBarForColumn(table.id, col, i)}>
										<span>{col.label}</span>
									</div>
								})}
							</div>

							{/* rows and cells - if static driven */}
							{table.rows.map((row) => {
								return <div key={row.id} className="flex">
									{row.cells.map((cell) => {
										return <div key={cell.id} className="flex justify-center items-center h-8 w-40 max-w-sm m-1 border-2 border-indigo-200 hover:border-indigo-100 rounded-md bg-white cursor-pointer"
											onClick={() => setCellSelected({ tableId: table.id, cellId: cell.id })}>
											<div></div>
										</div>
									})}
								</div>
							})}

							{/* Fake rows - if table is collection driven */}
							{table.type === 'collection' && Array.from([1, 2]).map((col, x) => {
								return <div key={Math.random()} className="flex">
									{table.columns.map((i) => {
										return <div key={Math.random()} className="flex justify-center items-center h-8 w-40 max-w-sm m-1 border-2 border-indigo-100 border-dashed rounded-md bg-white">
											<div className="text-indigo-100 text-xs">data</div>
										</div>
									})}
								</div>
							})}

						</div>

					</div>
				))}
			</div>

		</div>
	);
};