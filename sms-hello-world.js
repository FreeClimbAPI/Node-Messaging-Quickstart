require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
const freeclimbSDK = require('@freeclimb/sdk')

const port = process.env.PORT || 80
const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
const freeclimbConfig = freeclimbSDK.createConfiguration({accountId, apiKey})
const apiInstance = new freeclimbSDK.DefaultApi(freeclimbConfig);

app.post('/incomingSms', (req, res) => {
    const { from: userPhoneNumber } = req.body
    messageRequest = {
      _from: '', // Your FreeClimb Number 
      to: userPhoneNumber,
      text: 'Hello World!'
    }
  apiInstance.sendAnSmsMessage(messageRequest).catch(err => {console.log(err)})
})

// Specify this route with 'Status Callback URL' in App Config
app.post('/status', (req, res) => {
  // handle status changes
  res.status(200)
})

app.listen(port, () => {
  console.log(`Starting server on ${port}`)
})