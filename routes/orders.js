const express = require('express');
const router = express.Router();
const { accept, getOrder, place, finish } = require('../bin/controller/order');
const { SuccessModel, ErrorModel } = require('../bin/controller/resMod');

/* Place a order, send content and current position of the customer */
router.post('/place', (req, res) => {
  if (req.session.username) {
    const result = place(req.session.userid, req.body.content,
      req.body.lat, req.body.lng, req.body.deslat, req.body.deslng, req.body.time);
    result.then(data => {
      if (data) {
        res.json(
          new SuccessModel('Order Placed!')
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
  result.then(data => {
    res.json(new SuccessModel({ list: data }));
  });
});

/* Accept an order, pass in the order id selected by courier */
router.post('/accept', function (req, res) {
  const result = accept(req.body.orderid, req.session.userid);
  result.then(data => {
    if (data) {
      res.json(
        new SuccessModel('Order Accepted!')
      );
    } else {
      res.json(new ErrorModel('Unexpected Error!'));
    }
  });
});

module.exports = router;
