import React, { useState, createContext } from 'react'

export const UserContext = createContext()

export const UserProvider = function(props) {

	const [state, setState] = useState({
    'userId' : "",
    'role' : ""
  })

	return (
		<UserContext.Provider value={[state, setState]}>
			{ props.children }
		</UserContext.Provider>
	)
}
