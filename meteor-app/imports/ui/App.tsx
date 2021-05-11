import React from 'react';
import { Report_View } from './Report_View';
import { Report_Builder } from './Report_Builder/Report_Builder';

export const App = () => (
  <div>
    <h1>Welcome to Kyros Report Builder!</h1>
		{/* <Report_View /> */}
    
    <Report_Builder/>
  </div>
);
