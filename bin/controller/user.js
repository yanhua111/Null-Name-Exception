const { exec } = require('../database/mysql')

/* Facebook login, save fbtoken and apptoken into database */
const login = (username, fbtoken, apptoken) => {
    const sql = `
        insert into users (username, fbtoken, apptoken) values('${username}', '${fbtoken}', '${apptoken}');
    `
    return exec(sql).then(result => {
        console.log(result)
        return {
            id: result.insertId,
            affectedRows: result.affectedRows
        }
    })
}

/* Get the app token given a known user id, used for courier to push notification to customer */
const getAppToken = (userId) => {
    const sql = `
        select apptoken from users where id='${userId}';
    `
    return exec(sql).then(rows => {
        return rows
    })
}

/* Delete a user from databse by userId and username */
const del = (userId, username) => {
    const sql = `
    delete from users where id='${userId}' and username ='${username}';
    `
    return exec(sql).then(result => {
        console.log(result)
        return {
            affectedRows: result.affectedRows
        }
    })
}



module.exports = {
    login,
    getAppToken,
    del
}