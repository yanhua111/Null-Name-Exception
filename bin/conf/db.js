const env = 'prd'

let MYSQL_CONF;

if(env == 'prd') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: 'Skip_666',
    port:'3306',
    database: 'appdb'
  }
} 

if(env == 'dev') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'root',
    password: '123',
    port:'3306',
    database: 'myblog'
  }
}

const REDIS_CONF = {
  port: '6379',
  host: '127.0.0.1'
}

module.exports = {
    MYSQL_CONF,
    REDIS_CONF
}
