import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <>
      <div className="bg-gray-200 h-12 flex justify-between p-2 pl-6">
        <div className="flex items-center mr-4">
          <Link to='/report-builder' className="mr-4">
            Report Builder
          </Link>
          <Link to='/report-view' className="mr-4">
            Report View
          </Link>
          <Link to='/report-list' className="mr-4">
            Report List
          </Link>
          <Link to='/login' className="mr-4">
            Login
          </Link>
        </div>
      </div>
    </>
  );
};
  
export default Navbar;