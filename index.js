require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
const freeclimbSDK = require('@freeclimb/sdk')

const port = process.env.PORT || 3000
const accountId = process.env.ACCOUNT_ID
const apiKey = process.env.API_KEY
const fromNumber = process.env.FREECLIMB_NUMBER
const baseServer = new freeclimbSDK.ServerConfiguration(process.env.API_SERVER || "https://www.freeclimb.com/apiserver")
const freeclimbConfig = freeclimbSDK.createConfiguration({ baseServer, accountId, apiKey })
const apiInstance = new freeclimbSDK.DefaultApi(freeclimbConfig);

app.post('/incomingSms', (req, res) => {
  const { from: userPhoneNumber } = req.body
  const messageRequest = {
    _from: fromNumber, // Your FreeClimb Number 
    to: userPhoneNumber,
    text: 'Hello, World!'
  }
  apiInstance.sendAnSmsMessage(messageRequest)
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(500)
    })
})

// Specify this route with 'Status Callback URL' in App Config
app.post('/status', (req, res) => {
  // handle status changes
  res.status(200)
})

// Liveness probe endpoint
app.get("/live", (req, res) => {
  res.status(200).json({ status: "live" });
});

// Readiness probe endpoint
app.get("/ready", (req, res) => {
  res.status(200).json({ status: "ready" });
});

app.listen(port, () => {
  const localUrl = `http://127.0.0.1:${port}`
  console.log(`\nWelcome to FreeClimb!\n`);
  if (typeof accountId === "undefined" || typeof apiKey === "undefined" || typeof fromNumber === "undefined") {
    console.log("ERROR: ENVIRONMENT VARIABLES ARE NOT SET. PLEASE SET ALL ENVIRONMMENT VARIABLES AND RETRY.");
    console.log(
      "Refer to https://www.npmjs.com/package/dotenv for further instructions.\n"
    );
    process.exit()
  } else {
    const obfuscatedApiKey = apiKey.replace(/.(?=.{4,}$)/g, '*')
    console.log(`Your account id: ${accountId}`);
    console.log(`Your api key is: ${obfuscatedApiKey}\n`);
  }

  console.log(`Your web server is listening at: ${localUrl}`);
  console.log(
    `Your NEXT STEP is to use NGROK to proxy HTTP Traffic to this local web server.`
  );
  console.log(
    `  1. In NGROK, configure the dynamic url generate to proxy to ${localUrl}`
  );
  console.log(
    `  2. In the Dashboard or API, set your FreeClimb Application Voice Url to the dynamic NGROK endpoint generated.`
  );
  console.log(`\nListening on port: ${port}`);
});
