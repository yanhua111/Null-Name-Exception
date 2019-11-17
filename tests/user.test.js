const user = require('../bin/controller/user');

//string, string, string

const users = [
    {username: "Mark", fbtoken: "AAA", apptoken: "111"},
    {username: "Cleo", fbtoken: "BBB", apptoken: "222"},
    {username: "Caesar", fbtoken: "CCC", apptoken: "333"}, 
];

it('Login: new login', () => {
    expect(user.login(users[0].username, users[0].fbtoken, users[0].apptoken)).toStrictEqual({id: 0, affectedRows: 1});
});
it('getAppToken: known user', () => {
    expect(user.getAppToken(0)).toStrictEqual({apptoken: "111"});
});
it('Del: delete known user', () => {
    expect(user.del(0, users[0].username)).toStrictEqual({affectedRows: 1});
});
it('GetAppToken: now unknown user', () => {
    expect(user.getAppToken(0)).toBe(-1);
});
it('Del: delete unknown user', () => {
    expect(user.del(0, users[0].username)).toStrictEqual({affectedRows: 0});
});
