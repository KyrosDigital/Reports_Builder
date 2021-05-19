import { Meteor } from 'meteor/meteor'
import { WebApp } from 'meteor/webapp'
import parse from 'urlencoded-body-parser'
import { getJson } from '../parser'
import { validateJWT } from '../validate-jwt'

WebApp.connectHandlers.use('/viewers/create', async (req, res, next) => {
  const { headers } = req

	// validate JWT before doing anything
	const authToken = headers.authorization.split(" ")[1]
	if(!validateJWT(authToken)) {
		res.writeHead(401)
		res.end('Auth failed - Invalid token')
		return
	}

  console.info('/viewers/create route - headers\n', headers)

	const json = await getJson(req).catch(e => {
    console.error('/viewers/create - err catch parsing JSON:\n', e)
 	})

  res.writeHead(200)
  res.end(`${JSON.stringify(json)}`)
})

WebApp.connectHandlers.use('/viewers', async (req, res, next) => {
  const { headers } = req

	// validate JWT before doing anything
	const authToken = headers.authorization.split(" ")[1]
	if(!validateJWT(authToken)) {
		res.writeHead(401)
		res.end('Auth failed - Invalid token')
		return
	}

  console.info('/viewers/create route - headers\n', headers)

	const json = await getJson(req).catch(e => {
    console.error('/viewers/create - err catch parsing JSON:\n', e)
 	})

  res.writeHead(200)
  res.end(`${JSON.stringify(json)}`)
})

