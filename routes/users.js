var express = require('express');
var router = express.Router();
const { login, getAppToken, del } = require('../bin/controller/user')
const { SuccessModel, ErrorModel } = require('../bin/controller/resMod');


/* Facebook login, post username, fbtoken and apptoken */
router.post('/login', (req, res, next)=>{
  let result = login(req.body.username, req.body.fbtoken, req.body.apptoken)
   result.then(data=>{
      if(data.id){
        req.session.userid = data.id
        req.session.username = req.body.username
        req.session.usermode = req.body.usermode
        res.json({
          errno: 0,
          message: 'Login successully!'
        })
        return
    } else {
      res.json({
        errno: -1,
        message: 'Unexpected Error, please try again!'
      })
    }
    }).catch(error=>{
      res.json({
        message: 'Login failed'
      })
      console.log(error);
    })
})

/* Delete a user */
router.post('/delete', (req, res, next) => {
  let result = del(req.body.userId, req.body.username);
  result.then(data=>{
  if(data.affectedRows === 1) {
    res.json(
      new SuccessModel("User deleted!")
    )
  } else {
    res.json(
      new ErrorModel("Delete Failed!")
    )
  }
  })
})

/* Check for login */
router.get('/check', (req,res)=>{
  if(req.session.username) {
    console.log(req.session.userid)
    res.json(
      new SuccessModel({
        username: req.session.username,
        usermode: req.session.usermode
      },"User have logged in!")
    )
  } else {
    res.json(
      new ErrorModel("Not logged in!")
    )
  }
})

/* Get the app token given userid */
router.post('/get_token', (req,res)=>{
  let result = getAppToken(req.body.userid);
  result.then(result => {
    res.json(new SuccessModel({
      apptoken: result[0].apptoken}))
  })
})

/* switch the default usermode when enter the app */
router.post('/switch',(req, res)=>{
  if(!req.body.usermode) {
    res.json(new ErrorModel("Please send the mode you want to switch to"))
    return
  } 
  if(req.body.usermode) {
    req.session.usermode = req.body.usermode
    res.json(new SuccessModel("Update Successully!"))
  }
})

module.exports = router;