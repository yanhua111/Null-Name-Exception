const mysql = require('mysql');
const { MYSQL_CONF } = require('../conf/db');

CONF = MYSQL_CONF;
const con = mysql.createConnection(CONF)
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

  module.exports = {
      exec
  }