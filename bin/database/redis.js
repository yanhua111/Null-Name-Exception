const redis = require('redis');
const { REDIS_CONF } = require('../conf/db')

const client = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)

client.on("error", err => {
    console.log("Error " + err);
});


module.exports = client