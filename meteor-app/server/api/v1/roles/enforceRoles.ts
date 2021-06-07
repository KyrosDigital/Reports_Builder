import { Meteor } from "meteor/meteor"
import { Roles } from 'meteor/alanning:roles'
/*********************************************************************************
@description This function will be used primarily to handle error responses from
asynchronous code execution. To maximize reusability and cover the largest possible
group of use cases I have created this Error handler with flexibility in mind. The
handler has three arguments that determine its behavior (two of which are optional)
@param { String } message A short descriptive String describing the Error in plain
English
@param { Object || String || null } error This is an optional parameter which can be
an Object or a String. Typically it will be an Object passed as the error argument of
a callback from asynchronous code execution. HIGHLY RECCOMEND INCLUDING THIS WHENEVER
POSSIBLE
@param { Object } metaData This is the most beautiful part of this function. Metadata
is a completely felxible Object that you can fill up with context specific debugging
information; no limits on the size or depth. This will allow handleError to be adapted
to any error handling situation
@return { Error } An Error Object contained a curated String built from the message,
error param, and metaData
*********************************************************************************/
export const handleError = (message, error, metaData = {}) => {
	let curatedErrorString = `${message}\n\n`
	// We print the 'error' response from whatever callback or function or Promise. Typically this will be an Object
	if (error && typeof error === 'string') {
		// In case a function ever throws a String error we handle it here.
		curatedErrorString += `Error_String_Passed_To_Handler: ${error}\n\n`
	} else if (error && typeof error === 'object') {
		// If it is an Object than we will print the stack and the error Object itself which often have different information
		if (error instanceof Error) {
			curatedErrorString += `Stack_For_Error_Passed_To_Handler${error.stack.slice(5)}\n\n`
		}
		curatedErrorString += `Error_Object_Passed_To_Handler: ${JSON.stringify(error, undefined, 2)}\n\n`
	}
	// Add the logged in userId to metadata every time as this will be needed for most server debugging scenarions; additionally the time and date
	try {
		metaData.loggedInUserId = Meteor.userId()
	} catch (error) {
		metaData.loggedInUserId = `userId unavailable(possibly the calling code should utilize Meteor.bindEnvironment() to wrap a callback)`
	}
	metaData.timeStamp = new Date()
	// Add the method specific debugging information to the curated Error String that will be printed to the console
	curatedErrorString += `Metadata: ${JSON.stringify(metaData, undefined, 2)}\n\n`
	curatedErrorString += `Method_Stack:`
	return new Error(curatedErrorString)
}
export const Handle_Error = (reason, message) => {
  throw new Meteor.Error(reason, message);
}
export const enforceRole = function(userId, role) {
  if(userId && Roles.userIsInRole(userId, role)) {
		return
  } else throw new Meteor.Error('No Permission', 'user is not in editor role');
}