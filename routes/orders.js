const express = require('express');
const router = express.Router();
const { accept, getOrder, getCustomerOrder, getHistoryOrder, place, finish } = require('../bin/controller/order');
const { SuccessModel, ErrorModel } = require('../bin/controller/resMod');
const { sortOrder, pathFinding } = require('../bin/complexLogic/complexLogic');

/* Place a order, send content and current position of the customer
* Fails: User has not logged in
*/
router.post('/place', (req, res) => {
  if (req.session.username) {
    const result = place(req.session.userid, req.body.content,
      req.body.lat, req.body.lng, req.body.deslat, req.body.deslng, req.body.time, req.body.locFrom, req.body.locTo);
    result.then(data => {
      if (data) {
        res.json(
          new SuccessModel({
            orderid: data.insertId
          }, 'Order Placed!')
        );
      }
    });
  } else {
    res.json(
      new ErrorModel('Not logged in!')
    );
  }
});

/* Finish an order, should be requested when the courier arrived his/her destination, post the order id */
router.post('/finish', (req, res) => {
  const result = finish(req.body.orderid);
  result.then(data => {
    if (data) {
      res.json(
        new SuccessModel('Order Finished!')
      );
    }
  });
});

/* Retrieve all the order(accepted and available), for the courier */
router.get('/list', function (req, res) {
  const result = getOrder(req.session.userid);
  let output;
  result.then(data => {
    if (req.query.curlat && req.query.curlng) {
      output = sortOrder(data, req.query.curlat, req.query.curlng);
      res.json(new SuccessModel({ list: output }));
    } else {
      res.json(new SuccessModel({ list: data }));
    }
  });
});

/* Accept an order, pass in the order id selected by courier,
* Failed cases(errno -1): 1. Pass a non-existence order id.
* 2. Pass a order id that correspond to an accepted order.
* 3. Fail when there is no order available for the courier to accept
*/
router.post('/accept', (req, res) => {
  const result = accept(req.body.orderid, req.session.userid);
  const orderRes = getOrder(req.session.userid);
  result.then(data => {
    if (data.affectedRows === 1) {
      if (data.changedRows === 1) {
        orderRes.then(order => {
          if (order.length !== 0) {
            res.json(
              new SuccessModel({ list: pathFinding(order, req.body.curlat, req.body.curlng) }, 'Order Accepted!')
            );
          } else {
            res.json(new ErrorModel('No Order Available!'));
          }
        });
      } else {
        res.json(new ErrorModel('Order has been accepted!'));
      }
    } else if (data.affectedRows === 0) {
      res.json(new ErrorModel('Order Does Not Exist!'));
    }
  });
});

/* Get the order that current user places or accepts
* Fails: user has not logged in
*/
router.get('/list_user', (req, res) => {
  if (!req.session.username) {
    res.json(new ErrorModel('User has not log in yet!'));
  } else {
    const result = getCustomerOrder(req.session.userid);
    result.then(data => {
      res.json(new SuccessModel({ list: data }));
    });
  }
});

/* Get history order of the current user
* Fails(errno -1): 1. usermode is not set
* 2. user has not log in yet(or has log out)
*/
router.get('/order_history', (req, res) => {
  if (!req.session.usermode) {
    res.json(new ErrorModel('Usermode is NULL! Please Select uermode First!'));
  } else if (!req.session.username) {
    res.json(new ErrorModel('User has not log in yet!'));
  } else {
    const result = getHistoryOrder(req.session.userid, req.session.usermode);
    result.then(data => {
      res.json(new SuccessModel({ list: data }));
    });
  }
});

module.exports = router;
