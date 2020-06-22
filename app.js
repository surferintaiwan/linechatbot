const express = require("express")
const line = require("@line/bot-sdk")
const app = express()
const port = process.env.PORT || 3000

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

// create LINE SDK config from env variables
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
}

// create LINE SDK client
const client = new line.Client(config)

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post("/callback", line.middleware(config), (req, res) => {
    console.log(1111111111111, req.body.events)
    Promise.all(req.body.events.map(handleEvent))
        .then((result) => {
            console.log(result)
            res.json(result)
        })
        .catch((err) => {
            console.error(err)
            res.status(500).end()
        })
})

// event handler
function handleEvent(event) {
    console.log(22222222222, event)
    const message = event.message.text
    if (event.type !== "message" || event.message.type !== "text") {
        // ignore non-text-message event
        return Promise.resolve(null)
    }
    switch (message) {
        case "國五路況查詢":
            return client.replyMessage(event.replyToken, {
                type: "text",
                text: "一路順暢沒塞車，抵達時間約40分鐘",
            })
        case "浪點浪況查詢":
            return client.replyMessage(event.replyToken, {
                type: "text",
                text: "請問要查甚麼地方?",
            })
        default:
            // create a echoing text message
            const echoMessage =
                "因為不知道你再說甚麼，所以只能學你說話~~~~~" + message
            const echo = { type: "text", text: echoMessage }
            // use reply API
            return client.replyMessage(event.replyToken, echo)
    }
}

app.listen(port, () => {
    console.log(`listening on ${port}`)
})

module.exports = app
