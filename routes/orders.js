/* eslint-disable eqeqeq */
const express = require('express');
const router = express.Router();
const {
  accept,
  acceptHelper,
  getOrder,
  getCustomerOrder,
  getHistoryOrder,
  place,
  finish
} = require('../bin/controller/order');
const { SuccessModel, ErrorModel } = require('../bin/controller/resMod');
const { sortOrder, pathFinding } = require('../bin/complexLogic/complexLogic');

/* Place a order, send content and current position of the customer
 * Fails: User has not logged in
 */
router.post('/place', (req, res) => {
  if (req.session.username) {
    const result = place(
      req.session.userid,
      req.body.content,
      req.body.lat,
      req.body.lng,
      req.body.deslat,
      req.body.deslng,
      req.body.time,
      req.body.locFrom,
      req.body.locTo,
      req.body.fee,
      req.body.placeTime,
      req.body.customerPhone
    );
    result.then(data => {
      if (data) {
        res.json(
          new SuccessModel(
            {
              orderid: data.insertId
            },
            'Order Placed!'
          )
        );
      }
    });
  } else {
    res.json(new ErrorModel('Not logged in!'));
  }
});

/* Finish an order, should be requested when the courier arrived his/her destination, post the order id */
router.post('/finish', (req, res) => {
  const result = finish(req.body.orderid, req.body.finishTime);
  result.then(data => {
    if (data) {
      res.json(new SuccessModel('Order Finished!'));
    }
  });
});

/* Retrieve all the order(accepted and available), for the courier */
router.get('/list', function (req, res) {
  const result = getOrder(req.session.userid);
  let output;
  result.then(data => {
    if (req.query.curlat && req.query.curlng) {
      if (req.query.pathfinding) {
        output = pathFinding(data, req.query.curlat, req.query.curlng);
      } else {
        output = sortOrder(data, req.query.curlat, req.query.curlng);
      }
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
  const resHelper = acceptHelper(req.body.orderid);
  resHelper.then(data => {
    if (data.userid == req.session.userid) {
      res.json(new ErrorModel('You are Accepting you own order!!!'));
    } else if (data.courierid == req.session.userid) {
      res.json(new ErrorModel('You have accepted this order!'));
    } else if (data.courierid != -1) {
      res.json(
        new ErrorModel('This Order has been accepted by another courier!')
      );
    } else {
      const result = accept(req.body.orderid, req.session.userid, req.body.acceptTime, req.body.courierPhone);
      result.then(data => {
        // if (data.affectedRows === 1) {
        //   if (data.changedRows === 1) {
        res.json(new SuccessModel('Order Accepted!'));
        //   }
        // }
      });
    }
  });
});

/* Get the order that current user places or accepts
 * Fails: user has not logged in
 */
router.get('/list_customer', (req, res) => {
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
