import React, { useState, createContext } from 'react'

export const UserContext = createContext([{}, () => {}])

export const UserProvider = function(props) {

	const [state, setState] = useState([
		null,
		data => {
			setState([
				data,
				state[1]
			])
		}
	])

	return (
		<UserContext.Provider value={state}>
			{ props.children }
		</UserContext.Provider>
	)
}
