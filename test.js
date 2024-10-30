const https = require("https")

const data = JSON.stringify({
  "test": "haaaaaaa"
})

const options = {
  hostname: "eob3c73352dre6i.m.pipedream.net",
  port: 443,
  path: "/",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length,
  },
}

const req = https.request(options)
req.write(data)
req.end()