import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/buttons'
import useSubscription from '../../api/hooks'
import { Report_Structures } from '../../api/collections'
import { UserContext } from '../../api/contexts/userContext';

export const Report_List = () => {

	const { role } = useContext(UserContext)
  const loading = useSubscription('ReportStructure')
  const [reportCollection, setReportCollection] = useState([])
	

  useEffect(() => {
    if (!loading) {
      let query = Report_Structures.find().fetch()
      setReportCollection(query)
    }
  }, [loading])

  return (
    <div className='container p-6'>
      
			{role === "Editor" && <Link to='/report-builder' className="mr-4">
        <Button onClick={() => {}} text="Make New Report" color="blue"/>
      </Link>}

      <h1 className="font-sans text-xl font-bold">Your Reports:</h1>

      {reportCollection.map((el, id) => {
        return <div key = {id} className="my-4 box-border  w-56 p-4 bg-gray-100 rounded-xl">
          <h2 className="font-sans text-xl font-bold">{el.name}</h2>
					<div className="flex py-2">
						<Link to={'/report-view/' + el._id}>
							<Button onClick={() => {}} text="View" color="blue"/>
						</Link>
						{role === "Editor" && <Link to={'/report-builder/' + el._id}>
							<Button onClick={() => {}} text="Edit" color="blue"/>
						</Link>}
					</div>
      	</div>
    	})}

    </div>
  );
};