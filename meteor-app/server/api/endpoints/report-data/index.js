import { Meteor } from 'meteor/meteor'
import { WebApp } from 'meteor/webapp'
import parse from 'urlencoded-body-parser'
import { getJson } from '../parser'

WebApp.connectHandlers.use('/report-data', async (req, res, next) => {
  const { headers } = req

  console.info('/report-data route - headers\n', headers)

	const json = await getJson(req).catch(e => {
    console.error('/report-data - err catch parsing JSON:\n', e)
 })

  res.writeHead(200)
  res.end(`${JSON.stringify(json)}`)
})

WebApp.connectHandlers.use('/report-data/create', async (req, res, next) => {
  const { headers } = req

  console.info('/report-data/create route - headers\n', headers)

	const json = await getJson(req).catch(e => {
    console.error('/report-data/create - err catch parsing JSON:\n', e)
 })

  res.writeHead(200)
  res.end(`${JSON.stringify(json)}`)
})