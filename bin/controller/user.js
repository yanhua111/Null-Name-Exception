const { exec } = require('../database/mysql')

const login = (username, password) => {
    const sql=`
        select username, realname from users where username='${username}' and password='${password}';
    `
    return exec(sql).then(rows=>{
        return rows[0] || {}
    })
}

const signup = (username, password, realname, phonenum) => {
    const sql=`
    insert into users (username, password, realname, phonenum) values('${username}','${password}','${realname}', '${phonenum}');
    `
    return exec(sql).then(result=>{
        return {id: result.insertId,
                affectedRows: result.affectedRows}
    })
}

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
    signup,
    del
}