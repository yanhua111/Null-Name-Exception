const { exec } = require("../database/mysql");

const update = (username, userId) => {
  const sql = `
        update users set username='${username}' where id = ${userId};
  `;
  return exec(sql).then(result => {
    return {
      affectedRows: result.affectedRows
    };
  });
};

/* Sign up */
const signup = (username, password, fbtoken, apptoken) => {
  const sql = `
        insert into users (username, fbtoken, apptoken, password) values('${username}', '${fbtoken}', '${apptoken}', '${password}' );
  `;
  return exec(sql).then(result => {
    return {
      id: result.insertId
    };
  });
};

/* Helper for signup, check whether username has been registered */
const signupHelper = username => {
  const sql = `
        select id from users where username = '${username}';
  `;
  return exec(sql).then(result => {
    return result;
  });
};

/* Log in */
const login = (username, password, fbtoken) => {
  let sql;
  if (fbtoken === -1) {
    sql = `
    select id from users where username = '${username}' and password = '${password}';
`;
  } else {
    sql = `
    select id, username from users where fbtoken = '${fbtoken}';
`;
  }

  return exec(sql).then(result => {
    return result;
  });
};

/* Get the app token given a known user id, used for courier to push notification to customer */
const getAppToken = userId => {
  const sql = `
        select apptoken from users where id='${userId}';
    `;
  return exec(sql).then(rows => {
    return rows;
  });
};

/* Delete a user from databse by userId and username */
const del = (userId, username) => {
  const sql = `
    delete from users where id='${userId}' and username ='${username}';
    `;
  return exec(sql).then(result => {
    return {
      affectedRows: result.affectedRows
    };
  });
};

module.exports = {
  update,
  login,
  signup,
  signupHelper,
  getAppToken,
  del
};
