var express = require('express');
var router = express.Router();
const mysql = require('mysql');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Expresssss' });
// });
let MYSQL_CONF = {
  host: 'localhost',
  user: 'root',
  password: '123',
  port:'3306',
  database: 'myblog'
}

const con = mysql.createConnection(MYSQL_CONF)
con.connect()

function exec(sql){
  const promise = new Promise((resolve, reject) =>{
      con.query(sql, (err, result)=>{
          if(err){
              console.error(err)
              return
          }
          resolve(result)
      })
  })
  return promise
}

let username = 'posangzi'
let password = '123'
    const sql=`
        select username, realname from users where username='posangzi' and password='123';
    `

router.get('/', (req,res)=>{
  // exec(sql).then(rows=>{
  //   console.log(rows)
  //   res.json(rows)}
  //   ).catch(error=>console.log(error))
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
