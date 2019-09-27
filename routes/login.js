var express = require('express');
var router = express.Router();
const { exec } = require('../bin/controller/mysql');

//connect to mysql


    const sql=`
        select username, userid from users where username='posangzi';
    `

router.get('/', (req,res)=>{
   exec(sql).then(rows=>{
     console.log(rows)
     res.json(rows)}
     ).catch(error=>console.log(error))
  res.send("Hello get")
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