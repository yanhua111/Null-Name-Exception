var express = require('express');
var router = express.Router();
const { push } = require('../bin/controller/notification');
const { SuccessModel,ErrorModel } = require('../bin/controller/resMod');

// router.post('/token', (req, res) => {
//     saveToken(req.session.apptoken);
//     console.log(`Received push token, ${req.body.token}`);
//     res.send(`Received push token, ${req.body.token}`);
//   });


//   app.post('/message', (req, res) => {
//     handlePushTokens(req.body.message);
//     console.log(`Received message, ${req.body.message}`);
//     res.send(`Received message, ${req.body.message}`);
//   });

  router.post('/', (req,res) => {
      console.log(req.body)
      push(req.body.token, req.body.message);
      res.json(new SuccessModel("message sent"))
  })

  module.exports = router