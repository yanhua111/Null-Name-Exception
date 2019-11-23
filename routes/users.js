var express = require('express');
var router = express.Router();
const {
  update,
  login,
  signup,
  signupHelper,
  getAppToken,
  del
} = require('../bin/controller/user');
const { SuccessModel, ErrorModel } = require('../bin/controller/resMod');

/* Signup, For users that do not choose to use facebook login... */
router.post('/signup', (req, res) => {
  const resHelper = signupHelper(req.body.username);
  resHelper.then(data => {
    if (data.length === 0) {
      if (req.body.fbtoken) {
        const result = login('', '', req.body.fbtoken);
        result.then(data => {
          if (data.length === 0) {
            const result = signup(
              req.body.username,
              'FACEBOOK USER',
              req.body.fbtoken,
              req.body.apptoken
            );
            result.then(data => {
              req.session.userid = data.id;
              req.session.username = req.body.username;
              req.session.phonenum = req.body.phonenum;
              req.session.usermode = req.body.usermode;
              res.json(new SuccessModel({ userid: data.id, username: req.body.username }, 'User Sign Up Succeed!'));
            });
          } else {
            req.session.userid = data[0].id;
            req.session.username = data[0].username;
            req.session.phonenum = req.body.phonenum;
            req.session.usermode = req.body.usermode;
            res.json(new SuccessModel({ userid: data[0].id, username: data[0].username }, 'User log in Succeed!'));
          }
        });
      } else {
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
          res.json(
            new SuccessModel({ userid: data.id }, 'User Sign Up Succeed!')
          );
        });
      }
    } else {
      // username exist
      if (req.body.fbtoken) {
        const result = login('', '', req.body.fbtoken);
        result.then(data => {
          if (data.length === 0) {
            const username = req.body.username + (Date.now()).toString();
            console.log(username);
            const result = signup(
              username,
              'FACEBOOK USER',
              req.body.fbtoken,
              req.body.apptoken
            );
            result.then(data => {
              req.session.userid = data.id;
              req.session.username = req.body.username;
              req.session.phonenum = req.body.phonenum;
              req.session.usermode = req.body.usermode;
              res.json(new SuccessModel({ userid: data.id, username: username }, 'User Sign Up Succeed!'));
            });
          } else {
            req.session.userid = data[0].id;
            req.session.username = data[0].username;
            req.session.phonenum = req.body.phonenum;
            req.session.usermode = req.body.usermode;
            res.json(new SuccessModel({ userid: data[0].id, username: data[0].username }, 'User log in Succeed!'));
          }
        });
      } else {
        res.json(new ErrorModel('Username Exist! Please try another one'));
      }
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
      res.json({ userid: data[0].id }, new SuccessModel('Log in Succeed!'));
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
          userid: req.session.userid,
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

/* Set up user's phonenum */
router.post('/update', (req, res) => {
  if (req.body.usermode) {
    req.session.usermode = req.body.usermode;
  }
  if (req.body.phonenum) {
    req.session.phonenum = req.body.phonenum;
  }
  if (req.body.username) {
    const result = signupHelper(req.body.username);
    result.then(data => {
      if (data.length !== 0) {
        if (data[0].id !== req.session.userid) {
          res.json(
            new ErrorModel('User already exist, please try another username!')
          );
        } else {
          req.session.username = req.body.username;
          res.json(new SuccessModel('Profile Updated Succeed!'));
        }
      } else {
        const updateres = update(req.body.username, req.session.userid);
        updateres.then(data => {
          console.log(data);
          if (data.affectedRows === 1) {
            req.session.username = req.body.username;
            res.json(new SuccessModel('User Updated Succeed!'));
          }
        });
      }
    });
  }
});

module.exports = router;
