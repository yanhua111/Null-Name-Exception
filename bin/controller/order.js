const { exec } = require('../database/mysql');

/* Accept a order and update order status in database */
const accept = (orderId, courierId, acceptTime, courierPhone) => {
  const sql = `
        update orders set courierid='${courierId}', status=0, acceptTime='${acceptTime}', courierPhone='${courierPhone}' where id=${orderId};
    `;
  return exec(sql).then(rows => {
    return rows;
  });
};

const acceptHelper = (orderid) => {
  const sql = `
  select userid, courierid, status from orders where id = ${orderid}
    `;
  return exec(sql).then(rows => {
    return rows[0];
  });
};

/* Return the information of all avilable order */
const getOrder = (courierId) => {
  const result = fetchOrder(courierId, 'courier', 1, 0);
  return result;
};

/* General getOrder function
* param == -1 means we don't want it
*/
const fetchOrder = (userId, usermode, status, short) => {
  let sql = '';
  if (short === 1) {
    sql += 'select id, content, locFrom, locTo, time, status, fee, placeTime from orders where ';
  } else {
    sql += 'select id, userid, courierid, content, lat, lng, deslat, deslng, status, time, locFrom, locTo, fee, placeTime, acceptTime, finishTime, customerPhone, courierPhone from orders where ';
  }
  // Check all order that courier accept or can acccept
  if (status === 1) {
    sql += `status = 1 or (courierid = '${userId}' and status = 0); `;
  }
  // check all orders the user placed(except for finished orders)
  else if (status === 0) {
    sql += `userid = '${userId}' and (status = 0 or status = 1); `;
  } else if (status === -1) {
    sql += 'status = -1 ';
    if (usermode === 'customer') {
      sql += `and userid = '${userId}'; `;
    } else if (usermode === 'courier') {
      sql += `and courierid = '${userId}'; `;
    }
  }
  return exec(sql).then(rows => {
    return rows;
  });
};

/* Get All order placed by the current user(For Customer) */
const getCustomerOrder = (userId) => {
  const result = fetchOrder(userId, 'customer', 0, 1);
  return result;
};

/* Get finished order(Can be used by customer or courier) */
const getHistoryOrder = (userId, usermode) => {
  const result = fetchOrder(userId, usermode, -1, 0);
  return result;
};

/* Place a order, and save all corresponding inforation into the database */
const place = (userId, content, lat, lng, deslat, deslng, time, locFrom, locTo, fee, placeTime, customerPhone) => {
  const sql = `
    insert into orders (userid, courierid, content, lat, lng, deslat, deslng, status, time, locFrom, locTo, fee, placeTime, customerPhone) values('${userId}', -1 ,'${content}',
     '${lat}', '${lng}', '${deslat}', '${deslng}', 1, '${time}', '${locFrom}', '${locTo}', '${fee}', '${placeTime}', '${customerPhone}');
    `;
  return exec(sql).then(result => {
    return result;
  });
};

/* Finish a order, mark the order 'Zombie' */
const finish = (orderId, finishTime) => {
  const sql = `
        update orders set status=-1, finishTime='${finishTime}' where id='${orderId}';
    `;
  return exec(sql).then(rows => {
    return rows[0] || {};
  });
};

module.exports = {
  accept,
  acceptHelper,
  getOrder,
  getCustomerOrder,
  getHistoryOrder,
  place,
  finish
};
