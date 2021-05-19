import { Meteor } from 'meteor/meteor';
import React, { useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '/imports/api/contexts/userContext';

const Navbar = () => {

	const history = useHistory()

	const [user, setUser] = useContext(UserContext)

	const logout = () => {
		Meteor.logout((error) => {
			if(error) console.log(error)
			setUser(null)
			history.push('/login')
		})
	}

	useEffect(() => {}, [user])

  return (
    <>
      <div className="bg-gray-200 h-12 flex justify-between p-2 pl-6">
        <div className="flex items-center mr-4">

					{/* authed users */}
					{user ? <>
						<Link to='/report-builder' className="mr-4">
							Report Builder
						</Link>
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