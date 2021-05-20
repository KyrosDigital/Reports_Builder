import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '/imports/api/contexts/userContext';

const Navbar = () => {

	const history = useHistory()

  const [loginInfo, setLoginInfo] = useContext(UserContext)

	const logout = () => {
		Meteor.logout((error) => {
			if(error) console.log(error)
			setLoginInfo(null)
			history.push('/login')
		})
	}

  return (
    <>
      <div className="bg-gray-200 h-12 flex justify-between p-2 pl-6">
        <div className="flex items-center mr-4">

					{/* authed users */}
					{loginInfo ? <>
						{loginInfo.role === "Editor" && <Link to='/viewers' className="mr-4">
							Viewers
						</Link>}
						{loginInfo.role === "Editor" && <Link to='/report-builder' className="mr-4">
							Report Builder
						</Link>}
						<Link to='/report-list' className="mr-4">
							Report List
						</Link>
						<Link to='#' className="mr-4" onClick={logout}>
							Logout
						</Link>
					</> : <> {/* non-authed users */}
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