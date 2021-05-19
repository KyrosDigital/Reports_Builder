import { Meteor } from 'meteor/meteor'
import { WebApp } from 'meteor/webapp'
import parse from 'urlencoded-body-parser'
import { getJson } from '../parser'
import { Report_Data } from '/imports/api/collections'

// IMPORTANT: your paths must be ordered by longest at top of this file. 

WebApp.connectHandlers.use('/report-data/create', async (req, res, next) => {
  const { headers } = req

  console.info('/report-data/create route - headers\n', headers)

	const json = await getJson(req).catch(e => {
    console.error('/report-data/create - err catch parsing JSON:\n', e)
	})

	// validate auth token
	// fetch accountId
	await Meteor.call("Insert_Report_Data", json, (error) => {
		if(error) console.error('/report-data/create - err inserting data to db:\n', error)
	})

  res.writeHead(200)
  res.end(`${JSON.stringify(json)}`)
})

WebApp.connectHandlers.use('/report-data', async (req, res, next) => {
  const { headers } = req

  console.info('/report-data route - headers\n', headers)

	const json = await getJson(req).catch(e => {
    console.error('/report-data - err catch parsing JSON:\n', e)
 })

  res.writeHead(200)
  res.end(`${JSON.stringify(json)}`)
})