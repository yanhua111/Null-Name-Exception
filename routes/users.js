var express = require('express');
var router = express.Router();
const { login, signup, del} = require('../bin/controller/user')
const { SuccessModel,ErrorModel } = require('../bin/controller/resMod');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* login */
router.post('/login', (req, res, next)=>{
  const result = login(req.body.username, req.body.password)
   result.then(data=>{
      if(data.username){
        // console.log(data.username)
        req.session.username = data.username
        req.session.realname = data.realname
        res.json({
          errno: 0,
          message: 'Login successully!'
        })
        return
    } else {
      res.json({
        errno: -1,
        message: 'User does not exit!!!!'
      })
    }
    }).catch(error=>{
      res.json({
        message: 'Login failed'
      })
      console.log(error);
    })
    
})

/* signup */
router.post('/signup', (req, res, next) => {
  console.log(req.body);
  const result = signup(req.body.username, req.body.password, req.body.realname, req.body.phonenum);
  result.then(data=>{
    if(data){
      res.json(
        new SuccessModel({
          userId: data.id,
          affectedRows: data.affectedRows
        },"User Created!")
        )
    }
    else{
      res.json(new ErrorModel("Unexpected Error!"))
    }
  }).catch(err=>{
    console.log(err)
  })
})

/* delete */
router.post('/delete', (req, res, next) => {
  const result = del(req.body.userId, req.body.username);
  result.then(data=>{
    console.log(data);
  if(data.affectedRows == 1) {
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

/* login check */
router.get('/check', (req,res)=>{
  if(req.session.username) {
    res.json(
      new SuccessModel("User have logged in!")
    )
  } else {
    res.json(
      new ErrorModel("Not logged in!")
    )
  }
})

module.exports = router;
