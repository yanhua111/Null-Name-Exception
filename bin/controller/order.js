const { exec } = require('../database/mysql');

/* Accept a order and update order status in database */
const accept = (orderId, courierId) => {
  const sql = `
        update orders set courierid='${courierId}', status=0 where id='${orderId}';
    `;
  return exec(sql).then(rows => {
    return rows[0] || {};
  });
};

/* Return the information of all avilable order */
const getOrder = (courierId) => {
  const sql = `
        select id, userid, courierid, content, lat, lng, deslat, deslng, status, time from orders where status = 1 or (courierid = '${courierId}' and status = 0);
    `;
  return exec(sql).then(rows => {
    return rows;
  });
};

/* Return the order accepted by the given courier id */
const getAcceptedOrder = (courierId) => {
  const sql = `
        select id, userid, courierid, content, lat, lng, deslat, deslng, status, time from orders where courierid = '${courierId}';
    `;
  return exec(sql).then(rows => {
    return rows;
  });
};

/* Place a order, and save all corresponding inforation into the database */
const place = (userId, content, lat, lng, deslat, deslng, time) => {
  const sql = `
    insert into orders (userid, courierid, content, lat, lng, deslat, deslng, status, time) values('${userId}', -1 ,'${content}',
     '${lat}', '${lng}', '${deslat}', '${deslng}', 1, '${time}');
    `;
  return exec(sql).then(result => {
    return result;
  });
};

/* Finish a order, mark the order 'Zombie' */
const finish = (orderId) => {
  const sql = `
        update orders set status=-1 where id='${orderId}';
    `;
  return exec(sql).then(rows => {
    return rows[0] || {};
  });
};

module.exports = {
  accept,
  getOrder,
  getAcceptedOrder,
  place,
  finish
};
