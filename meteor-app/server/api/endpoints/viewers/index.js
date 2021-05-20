import { Meteor } from 'meteor/meteor'
import { WebApp } from 'meteor/webapp'
import parse from 'urlencoded-body-parser'
import { getJson } from '../parser'
import { validateJWT } from '../validate-jwt'


/**
 * Creates a viewer user under an account
 * auth via jwt required
 */ 
WebApp.connectHandlers.use('/viewers/create', async (req, res, next) => {
  const { headers } = req

	// validate JWT before doing anything
	const authToken = headers.authorization.split(" ")[1]
	if(!validateJWT(authToken)) {
		res.writeHead(401)
		res.end('Auth failed - Invalid token')
		return
	}

  // console.info('/viewers/create route - headers\n', headers)

	const json = await getJson(req).catch(e => {
    console.error('/viewers/create - err catch parsing JSON:\n', e)
 	})

	if(!json.username) {
		res.writeHead(400)
		res.end('invalid Request - Missing "username: string"')
		return
	}

	if(!json.email) {
		res.writeHead(400)
		res.end('invalid Request - Missing "email: string"')
		return
	}

	if(!json.password) {
		res.writeHead(400)
		res.end('invalid Request - Missing "password: string"')
		return
	}

	if(!json.profile) {
		res.writeHead(400)
		res.end('invalid Request - Missing "profile: Object"')
		return
	}

	if(!json.profile.first_name) {
		res.writeHead(400)
		res.end('invalid Request - Missing "profile.first_name: string"')
		return
	}

	if(!json.profile.last_name) {
		res.writeHead(400)
		res.end('invalid Request - Missing "profile.last_name: string"')
		return
	}

	// create new viewer user
	await Meteor.call("Create_Viewer_User", authToken, json, (error, result) => {
		if(error) {
			res.writeHead(403)
  		res.end(`${JSON.stringify(error.message)}`)
		}
		if(result) {
			res.writeHead(200)
  		res.end(`${JSON.stringify(result)}`)
		}
	})
})


