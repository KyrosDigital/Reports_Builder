import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/buttons'

export const Login = () => {

    const [credentials, setCredentials] = useState({})
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleUserName = (event: {target: {value: React.SetStateAction<string>; }; }) => {
        setUsername(event.target.value)
    }

    const handlePassword = (event: {target: {value: React.SetStateAction<string>; }; }) => {
        setPassword(event.target.value)
    }

    const handleSubmit = () => {
        let info = {"username" : username, "password" : password}
        setCredentials(info)
        setUsername('')
        setPassword('')
        console.log('working')
    }
    

  return (
    <div className="h-screen flex justify-center items-center">
        <div >
            <h1>Login</h1>
            <div className="w-56 mb-3 pt-0">
                <h1>Username: </h1>
                <input 
                    className="w-48 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                    type="text" 
                    value={username}
                    placeholder="Enter User Name" onChange={(e) => handleUserName(e)} 
                />
            </div>
            <div className="w-56 mb-3 pt-0">
                <h1>Username: </h1>
                <input 
                    className="w-48 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                    type="text" 
                    value={password}
                    placeholder="Enter Password" onChange={(e) => handlePassword(e)} 
                />
            </div>
            <Button
                text="Submit"
                onClick = {() => handleSubmit()}
                color="blue"
            />
        </div>
    </div>
  );
};