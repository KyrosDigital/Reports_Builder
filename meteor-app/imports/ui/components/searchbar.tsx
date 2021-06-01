import React, { useEffect } from 'react';
import { Input } from './inputs'

const SearchBar = ({ query, setQuery }) => {
    const handleXClick = () => {
        setQuery("")
    }

		

    return (
        <div className="flex relative search-bar-div items-stretch">
					<Input placeholder={'type to search'} value={query} onChange={(e) => setQuery(e.target.value)} />
					<button onClick={handleXClick}
							className="bg-red-400 rounded border-black border-2 px-2 mx-2"
					>
							Clear
					</button>
        </div>
    );
}

export default SearchBar;