const express = require('express');
const router = express.Router();
const { accept, getOrder, getUserOrder, place, finish } = require('../bin/controller/order');
const { SuccessModel, ErrorModel } = require('../bin/controller/resMod');
const { sortOrder, pathFinding } = require('../bin/complexLogic/complexLogic');

/* Place a order, send content and current position of the customer */
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
      } else {
        res.json(new ErrorModel('Unexpected Error!'));
      }
    }).catch(err => {
      res.json(new ErrorModel(err));
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
    } else {
      res.json(new ErrorModel('Failed to finish'));
    }
  });
});

/* Retrieve all the order */
router.get('/list', function (req, res) {
  const result = getOrder(req.session.userid);
  // let output;
  result.then(data => {
    // if (req.query.curlat && req.query.curlng) {
    //   output = sortOrder(data, req.query.curlat, req.query.curlng);
    //   res.json(new SuccessModel({ list: output }));
    // } else {
    //   res.json(new SuccessModel({ list: data }));
    // }
    res.json(new SuccessModel({ list: data }));
  }).catch(() => {
    res.json(new ErrorModel('Failed to fetch list!'));
  });
});

/* Accept an order, pass in the order id selected by courier */
router.post('/accept', (req, res) => {
  const result = accept(req.body.orderid, req.session.userid);
  const orderRes = getOrder(req.session.userid);
  result.then(data => {
    orderRes.then(order => {
      if (data) {
        res.json(
          new SuccessModel({ list: pathFinding(order, req.body.curlat, req.body.curlng) }, 'Order Accepted!')
        );
      } else {
        res.json(new ErrorModel('Unexpected Error!'));
      }
    });
  }).catch(err => {
    console.log(err);
    res.json(new ErrorModel('Failed to accept!'));
  });
});

/* Get the order that current user places or accepts */
router.get('/list_user', (req, res) => {
  const result = getUserOrder(req.session.userid);
  result.then(data => {
    res.json(new SuccessModel({ list: data }));
  }).catch(() => {
    res.json(new ErrorModel('Failed to fetch list!'));
  });
});

module.exports = router;
