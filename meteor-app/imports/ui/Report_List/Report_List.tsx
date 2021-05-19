import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/buttons'
import useSubscription from '../../api/hooks'
import { Report_Structures } from '../../api/collections'

export const Report_List = () => {

  const loading = useSubscription('ReportStructure')
  const [reportCollection, setReportCollection] = useState([])

  useEffect(() => {
    if (!loading) {
      let query = Report_Structures.find().fetch()
      setReportCollection(query)
    }
  }, [loading])

  return (
    <div className="space-y-4">
        <Link to='/report-builder' className="mr-4">
            <Button onClick={() => {}} text="Make New Report" color="blue"/>
        </Link>
        <div></div>
        <h1 className="font-sans text-xl font-bold">Your Reports:</h1>
        {reportCollection.map((el, id) => {
          return <div key = {id} className="mx-4 box-border h-32 w-56 p-4 border-4 border-black bg-green-100 rounded-xl space-y-2">
                    <h2 className="font-sans text-xl font-bold">{el.name}</h2>
                    <Link to={'/report-view/' + el._id} className="mr-4">
                        <button className="border-black border-2 bg-yellow-200 font-sans rounded-md m-0.5 px-0.5">View Report</button>
                    </Link>
                    <Link to={'/report-builder/' + el._id} className="mr-4">
                        <button className="border-black border-2 bg-yellow-200 font-sans rounded-md m-0.5 px-0.5">Edit Report</button>
                    </Link>
            </div>
        })}
    </div>
  );
};