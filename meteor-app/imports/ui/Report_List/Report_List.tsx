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
    <div className='h-screen w-screen p-6 bg-gray-100'>
			
			<div className="flex justify-between">
				<p className="text-md font-bold">Your Reports:</p>
				{role === "Editor" && <Link to='/report-builder' className="mr-4">
					<Button onClick={() => {}} text="Make New Report" color="blue"/>
				</Link>}
			</div>

      {reportCollection.map((el, id) => {
        return <div key = {id} className="my-4 box-border w-1/4 p-4 bg-white rounded filter drop-shadow-md">
          <h2 className="text-md">{el.name}</h2>
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