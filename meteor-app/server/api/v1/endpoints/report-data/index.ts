import { Meteor } from 'meteor/meteor'
import { WebApp } from 'meteor/webapp'
import { getJson } from '../parser'
import { validateJWT } from '../validate-jwt'


WebApp.connectHandlers.use('/v1/report-data/create', async (req, res) => {
  const { headers } = req

	if(!headers.authorization) {
		res.writeHead(401)
		res.end('Auth failed - Missing authorization header')
		return
	}

	// validate JWT before doing anything
	const authToken = headers.authorization.split(" ")[1]
	if(!validateJWT(authToken)) {
		res.writeHead(401)
		res.end('Auth failed - Invalid token')
		return
	}
	
  // console.info('/report-data/create route - headers\n', headers)

	const json = await getJson(req).catch(e => {
    console.error('/v1/report-data/create - err catch parsing JSON:\n', e)
	})

	// validate auth token
	// fetch accountId
	await Meteor.call("Insert_Report_Data", json, (error: Error) => {
		if(error) {
			res.writeHead(403)
  		res.end(`${JSON.stringify(error.message)}`)
		}
	})

  res.writeHead(200)
  res.end(`${JSON.stringify(json)}`)
})


WebApp.connectHandlers.use('/v1/report-data', async (req, res) => {
  const { headers } = req

	if(!headers.authorization) {
		res.writeHead(401)
		res.end('Auth failed - Missing authorization header')
		return
	}
	
	// validate JWT before doing anything
	const authToken = headers.authorization.split(" ")[1]
	if(!validateJWT(authToken)) {
		res.writeHead(401)
		res.end('Auth failed - Invalid token')
		return
	}

  // console.info('/report-data route - headers\n', headers)

	const json = await getJson(req).catch(e => {
    console.error('/v1/report-data - err catch parsing JSON:\n', e)
 	})

  res.writeHead(200)
  res.end(`${JSON.stringify(json)}`)
})