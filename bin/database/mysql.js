const mysql = require('mysql');
const { MYSQL_CONF } = require('../conf/db');

const con = mysql.createConnection(MYSQL_CONF);
con.connect();

/* Promise for executing mysql command */
function exec (sql) {
  const promise = new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      resolve(result);
    });
  });
  return promise;
}

module.exports = {
  exec
};
