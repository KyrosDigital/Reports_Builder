import React from 'react'
import { UserProvider } from '../api/contexts/userContext'

export const App = (props) => {
	return (
		<UserProvider>
			<div className='App'>
				{props.children}
			</div>
		</UserProvider>
	)
}
