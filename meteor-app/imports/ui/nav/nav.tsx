import { Meteor } from 'meteor/meteor';
import React, { useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '/imports/api/contexts/userContext';

const Navbar = () => {

	const history = useHistory()

	const [userId, setUserId] = useContext(UserContext)

	const logout = () => {
		Meteor.logout((error) => {
			if(error) console.log(error)
			setUserId(null)
			history.push('/login')
		})
	}

	useEffect(() => {}, [userId])

  return (
    <>
      <div className="bg-gray-200 h-12 flex justify-between p-2 pl-6">
        <div className="flex items-center mr-4">

					{/* authed users */}
					{userId ? <>
						<Link to='/viewers' className="mr-4">
							Viewers
						</Link>
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