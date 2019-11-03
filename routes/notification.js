var express = require('express');
var router = express.Router();
const { push } = require('../bin/controller/notification');
const { SuccessModel } = require('../bin/controller/resMod');

/* pushes notification to the specified user token and with message in the request body */
router.post('/', (req, res) => {
  push(req.body.token, req.body.message);
  res.json(new SuccessModel("message sent"))
})

module.exports = router