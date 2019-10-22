const { exec } = require('../database/mysql')

const accept = (orderId, courierId) => {
    const sql=`
        update orders set courierid='${courierId}', status=0 where id='${orderId}';
    `
    return exec(sql).then(rows=>{
        return rows[0] || {}
    })
}

const getOrder = (courierId) => {
    const sql=`
        select id, userid, courierid, content, lat, lng from orders where status = 1 or (courierid = '${courierId}' and status = 0);
    `
    return exec(sql).then(rows=>{
        return rows;
    })
}

const place = (userId, content, lat, lng) => {
    const sql=`
    insert into orders (userid, courierid, content, lat, lng, status) values('${userId}', -1 ,'${content}',
     '${lat}', '${lng}', 1);
    `
    return exec(sql).then(result=>{
        return result
    })
}

const finish = (orderId) => {
    const sql=`
        update orders set status=-1 where id='${orderId}';
    `
    return exec(sql).then(rows=>{
        return rows[0] || {}
    })
}


module.exports = {
    accept,
    getOrder,
    place,
    finish
}