import { Meteor } from 'meteor/meteor';
import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '../components/buttons'
import { Redirect } from 'react-router-dom';
import { UserContext } from '/imports/api/contexts/userContext';
import toast from 'react-hot-toast';
import * as d3 from "d3";
import { useEffect } from 'react';

export const Login = () => {

	const { user } = useContext(UserContext)
	if (user) {
		return <Redirect to='/report-list' />
	}

	const history = useHistory()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleUserName = (event: {target: {value: React.SetStateAction<string>; }; }) => {
  	setUsername(event.target.value)
  }

  const handlePassword = (event: {target: {value: React.SetStateAction<string>; }; }) => {
    setPassword(event.target.value)
  }

	const handleSubmit = () => {
		
		if (!username || !password) {
			toast.error('missing username or password')
		} else {
			Meteor.loginWithPassword(username, password, (error) => {
				if(error) {
					toast.error('username or password invalid')
				} 
				else {
					setUsername('')
					setPassword('')
					history.push('report-list')
				}
			})
		}
		
	}

	const BarChart = (w, h) =>  {
		const data = [12, 5, 6, 6, 9, 10];

		const svg = d3.select("#bar-chart")
			.append("svg")
			.attr("width", w)
			.attr("height", h)
			.style("margin-left", 100);

		svg.selectAll("rect")
			.data(data)
			.enter()
			.append("rect")
			.attr("x", (d, i) => i * 70)
			.attr("y", (d, i) => h - 10 * d)
			.attr("width", 65)
			.attr("height", (d, i) => d * 10)
			.attr("fill", "green")
	}

	useEffect(() => {
		BarChart(300, 300)
	}, [])

    

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
			<div id={'bar-chart'}></div>
        <div >
            <h1 className="font-semibold tracking-wide text-xl my-2">Login</h1>
            <div className="w-56 mb-3 pt-0">
                <h1 className="font-light">Username: </h1>
                <input 
                    className="w-48 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
                    type="text" 
                    value={username}
                    placeholder="Enter User Name" onChange={(e) => handleUserName(e)} 
                />
            </div>
            <div className="w-56 mb-3 pt-0">
					<h1 className="font-light">Password: </h1>
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