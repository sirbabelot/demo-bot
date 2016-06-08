"use strict";
const express = require('express');
const app = express();
const request = require('superagent');
const fbAccessToken = process.env.FB_ACCESS_TOKEN;


app.get("/", (req, res) => {
  res.send('dreams');
});

app.get("/webhook/", (req, res) => {
  if (req.query["hub.mode"]==="subscribe" && req.query["hub.verify_token"]==="I_AM_A_BIG_MILKSHAKE") {
    res.send(req.query["hub.challenge"])
  }
});

app.post('/webhook/', (req, res) => {
  //all messages since the last time fb posted
  let messaging_events = req.body.entry[0].messaging;

  messaging_events.forEach( event => {
    let sender = event.sender.id;
    if (event.message && event.message.text) {
      let text = event.message.text;
      console.log(text);
      console.log(event.message);
      sendMessage(sender, 'hihihihihihi!!!');
    }
  });
  res.sendStatus(200)
});

function sendMessage(sender, text) {
    request.post('https://graph.facebook.com/v2.6/me/messages')
      .query({access_token: fbAccessToken})
      .send({
            recipient: {id: sender},
            message: { text },
      })
      .end(callback);

   function callback (error, response) {
      if (error) {
          console.log('Error sending messages: ', error)
      } else if (response.body.error) {
          console.log('Error: ', response.body.error)
      }
  }
}


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
