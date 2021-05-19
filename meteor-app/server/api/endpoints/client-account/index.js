import { Meteor } from 'meteor/meteor'
import { WebApp } from 'meteor/webapp'
import parse from 'urlencoded-body-parser'
import { getJson } from '../parser'
import { validateJWT } from '../validate-jwt'


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

  res.writeHead(200)
  res.end(`${JSON.stringify(json)}`)
})

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

	// validate auth token
	// fetch accountId
	// await Meteor.call("Insert_Report_Data", json, (error) => {
	// 	if(error) console.error('/client-account - err inserting data to db:\n', error)
	// })

  res.writeHead(200)
  res.end(`${JSON.stringify(json)}`)
})