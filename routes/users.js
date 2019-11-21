var express = require('express');
const https = require('https');
var router = express.Router();
const {
  login,
  signup,
  signupHelper,
  getAppToken,
  del
} = require('../bin/controller/user');
const { SuccessModel, ErrorModel } = require('../bin/controller/resMod');

/* TODO: delet this; testing */
router.get('/test', (req, res) => {
  https.get('https://graph.facebook.com/me/picture?access_token=EAAHZAdqgZBRiwBAKNmdTcvwQZAEQfU0RUKEUPzIYQvMyfgffAzJh8dZAitdUT4ZBZBtAf6CiOV6CztCWzPylwWPZAW1CfiluatwXIgwabZCZCd3sH20klj6Xrz39PuHcyW9BJpNZC3aJIOpqr55aAEUwVaa1Ry2jrGOGGHm3oVC5y0ztvrI1s8dKJRsvqULS7WFVbXZAuEfopPvZC9noXzwvKW1W9ommZB0szjo4ZD', res => {
    // res.setEncoding('utf8');
    let body = '';
    res.on('data', data => {
      body += data;
    });
    res.on('end', () => {
      // body = JSON.parse(body);
      console.log(body);
    });
  });
  res.json('Hello!');
});

/* Signup, For users that do not choose to use facebook login... */
router.post('/signup', (req, res) => {
  const resHelper = signupHelper(req.body.username);
  resHelper.then(data => {
    if (data.length === 0) {
      const result = signup(
        req.body.username,
        req.body.password,
        req.body.fbtoken,
        req.body.apptoken
      );
      result.then(data => {
        req.session.userid = data.id;
        req.session.username = req.body.username;
        req.session.phonenum = req.body.phonenum;
        req.session.usermode = req.body.usermode;
        res.json(new SuccessModel('User log in Succeed!'));
      });
    } else {
      res.json(new ErrorModel('Username Exist! Please try another one'));
    }
  });
});

/* Log in */
router.post('/login', (req, res) => {
  const result = login(req.body.username, req.body.password);
  result.then(data => {
    if (data.length === 0) {
      res.json(new ErrorModel('Invalid Username and Password Combination!'));
    } else {
      req.session.userid = data[0].id;
      req.session.username = req.body.username;
      res.json(new SuccessModel('Log in Succeed!'));
    }
  });
});

/* Log Out the current user */
router.get('/logout', (req, res) => {
  if (!req.session.username) {
    res.json(new ErrorModel('User Not Even Logged in!!!'));
  } else {
    req.session.username = null;
    res.json(new SuccessModel('User has logged out'));
  }
});

/* Delete a user */
router.post('/delete', (req, res) => {
  const result = del(req.body.userId, req.body.username);
  result.then(data => {
    if (data.affectedRows === 1) {
      res.json(new SuccessModel('User deleted!'));
    }
  });
});

/* Check for login */
router.get('/check', (req, res) => {
  if (req.session.username) {
    res.json(
      new SuccessModel(
        {
          username: req.session.username,
          usermode: req.session.usermode,
          phonenum: req.session.phonenum
        },
        'User have logged in!'
      )
    );
  } else {
    res.json(new ErrorModel('Not logged in!'));
  }
});

/* Get the app token given userid */
router.post('/get_token', (req, res) => {
  const result = getAppToken(req.body.userid);
  result.then(result => {
    res.json(
      new SuccessModel({
        apptoken: result[0].apptoken
      })
    );
  });
});

/* switch the default usermode when enter the app */
router.post('/switch', (req, res) => {
  if (!req.body.usermode) {
    res.json(new ErrorModel('Please send the mode you want to switch to'));
  } else {
    req.session.usermode = req.body.usermode;
    res.json(new SuccessModel('Update Successully!'));
  }
});

/* Set up user's phonenum */
router.post('/setinfo', (req, res) => {
  if (req.session.username) {
    req.session.phonenum = req.body.phonenum;
    res.json(new SuccessModel('Phone number Updated!'));
  } else if (!req.session.username) {
    res.json(new ErrorModel('User has not log in yet!'));
  }
});

module.exports = router;
