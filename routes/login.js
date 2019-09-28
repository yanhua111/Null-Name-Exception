var express = require('express');
var router = express.Router();
const { login } = require('../bin/controller/login')
//connect to mysql


    // const sql=`
    //     select username, userid from users where username='posangzi';
    // `


router.get('/', (req, res, next)=>{
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
    
    // console.log(username)
    //  res.json({
    //    session: req.session.username
    //  })
})


router.post('/', (req,res)=>{
  // exec(sql).then(rows=>{
  //   console.log(rows)
  //   res.json(rows)}
  //   )
  res.send("Hello post")
  console.log(req.body)
})

module.exports = router;