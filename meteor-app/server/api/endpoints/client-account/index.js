import { Meteor } from 'meteor/meteor'
import { WebApp } from 'meteor/webapp'
import parse from 'urlencoded-body-parser'
import { getJson } from '../parser'
import { validateJWT } from '../validate-jwt'


/**
 * Updates a Client_Account
 * auth via jwt required
 */ 
WebApp.connectHandlers.use('/client-account/update', async (req, res, next) => {
  const { headers } = req

	// validate JWT before doing anything
	const authToken = headers.authorization.split(" ")[1]
	if(!validateJWT(authToken)) {
		res.writeHead(401)
		res.end('Auth failed - Invalid token')
		return
	}

  console.info('/client-account/update route - headers\n', headers)

	const json = await getJson(req).catch(e => {
    console.error('/client-account/update - err catch parsing JSON:\n', e)
 	})

	if(!json.name) {
		res.writeHead(400)
		res.end('invalid Request - Missing "name: string"')
		return
	}

	// fetch Client_Account
	await Meteor.call("Update_Account", authToken, json.name, (error, result) => {
		if(error) console.error('/client-account/update - err updating data:\n', error)
		if(result) {
			res.writeHead(200)
  		res.end(`${JSON.stringify(result)}`)
		}
	})
})


/**
 * Fetches a Client_Account
 * auth via jwt required
 */ 
WebApp.connectHandlers.use('/client-account', async (req, res, next) => {
  const { headers } = req

	// validate JWT before doing anything
	const authToken = headers.authorization.split(" ")[1]
	if(!validateJWT(authToken)) {
		res.writeHead(401)
		res.end('Auth failed - Invalid token')
		return
	}
	
  console.info('/client-account route - headers\n', headers)

	const json = await getJson(req).catch(e => {
    console.error('/client-account - err catch parsing JSON:\n', e)
	})

	// fetch Client_Account
	await Meteor.call("Fetch_Account", authToken, (error, result) => {
		if(error) console.error('/client-account - err fetching account:\n', error)
		if(result) {
			res.writeHead(200)
  		res.end(`${JSON.stringify(result)}`)
		}
	})

})