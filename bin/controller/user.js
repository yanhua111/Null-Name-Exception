const { exec } = require('../database/mysql')

// const login = (token) => {
//     const sql=`
//         select username, id from users where token='${token}';
//     `
//     return exec(sql).then(rows=>{
//         return rows[0] || {}
//     })
// }

const login = (username, fbtoken, apptoken) => {
    const sql=`
        insert into users (username, fbtoken, apptoken) values('${username}', '${fbtoken}', '${apptoken}');
    `
    return exec(sql).then(result=>{
        console.log(result)
        return {
            id: result.insertId,
            affectedRows: result.affectedRows
        }
    })
}

const getAppToken = (userId) => {
    const sql=`
        select apptoken from users where id='${userId}';
    `
    return exec(sql).then(rows=> {
        return rows
    })
}

// const signup = (username, password, realname, phonenum) => {
//     const sql=`
//     insert into users (username, password, realname, phonenum) values('${username}','${password}','${realname}', '${phonenum}');
//     `
//     return exec(sql).then(result=>{
//         return {id: result.insertId,
//                 affectedRows: result.affectedRows}
//     })
// }

const del = (userId, username) => {
    const sql = `
    delete from users where id='${userId}' and username ='${username}';
    `
    return exec(sql).then(result=>{
        console.log(result)
        return {
            affectedRows: result.affectedRows}
    })
}


module.exports = {
    login,
    getAppToken,
    // signup,
    del
}