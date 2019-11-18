var database = [
];
 
//const {login, getAppToken, del} = jest.genMockFromModule('../user');

/* Facebook login, save fbtoken and apptoken into database */
const login = (username, fbtoken, apptoken) => {
    database.push({id: database.length, username: username, fbtoken: fbtoken, apptoken: apptoken});
    return {
        id: database[database.length-1].id,
        affectedRows: 1
      };
};

/* Get the app token given a known user id, used for courier to push notification to customer */
const getAppToken = (userId) => {
    for(var i = 0; i < database.length; i++){
        if(database[i].id == userId){
          return {apptoken: database[i].apptoken};  //should be entire user class
        }
    }
    return -1;
};

/* Delete a user from databse by userId and username */
const del = (userId, username) => {
    let x = -1;
    for(let i = 0; i < database.length; i++){
        if(database[i].id == userId && database[i].username == username){
          x = i;
        }
    }
    if (x == -1) {
        return {affectedRows: 0};
    }
    database.splice(x,1);
    return {affectedRows: 1};
};

module.exports = {
  login,
  getAppToken,
  del
};
