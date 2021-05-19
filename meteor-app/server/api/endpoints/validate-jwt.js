const jwt = require('jsonwebtoken')

export const validateJWT = (authToken) => {
	try {
		return jwt.verify(authToken, Meteor.settings.private.jwt_secret)
	} catch(err) {
		console.log('validateJWT error: \n', err.message)
	}
}