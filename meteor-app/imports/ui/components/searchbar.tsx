import React, { useEffect } from 'react';
import { Input } from './inputs'
import { Button } from './buttons'

const SearchBar = ({ query, setQuery }) => {
    const handleClick = () => {
        setQuery("")
    }

		

    return (
        <div className="flex relative search-bar-div items-stretch">
					<Input placeholder={'type to search'} value={query} onChange={(e) => setQuery(e.target.value)} />
					<Button 
					color="red"
					text="Clear"
					onClick={() => handleClick()}
					/>
        </div>
    );
}

export default SearchBar;