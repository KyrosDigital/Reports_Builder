import React from 'react'
import { UserProvider } from '../api/contexts/userContext'

export const App = (props) => {
	return (
		<UserProvider>
			{props.children}
		</UserProvider>
	)
}
