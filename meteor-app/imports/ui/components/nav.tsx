import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '/imports/api/contexts/userContext';

const Navbar = () => {

	const history = useHistory()

  const {isLoggedIn, role} = useContext(UserContext)

	const logout = () => {
		Meteor.logout((error) => {
			if(error) console.log(error)
			history.push('/login')
		})
	}

  return (
    <>
      <div className="bg-indigo-900 text-white text-sm h-12 flex justify-between p-2 pl-6">

			<div className="flex items-center mr-4">
				{/* authed users */}
				{isLoggedIn && <>
					{/* Editor Links */}
					{role === "Editor" && <>
						<Link to='/viewers' className="mr-4 active:text-indigo-600">
							Viewers
						</Link>
						<Link to='/report-builder' className="mr-4">
							Report Builder
						</Link>
						<Link to='/report-data-overview' className="mr-4">
							Report Data
						</Link>
					</>
					}
					{/* Viewer & Editor Links */}
					<Link to='/report-list' className="mr-4">
						Report List
					</Link>
				</>} 
			</div>

        <div className="flex items-center mr-4">

					{/* authed users */}
					{isLoggedIn && <>						
						<Link to='#' className="mr-4" onClick={logout}>
							Logout
						</Link>
					</>} 

					{/* non-authed users */}
					{!isLoggedIn && <> 
						<Link to='/login' className="mr-4">
							Login
						</Link>
					</>}
          
        </div>
      </div>
    </>
  );
};
  
export default Navbar;