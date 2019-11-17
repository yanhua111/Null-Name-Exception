// var router  = require('../routes/users');
// const request = require('supertest');
// const express = require('express');
const user = require('../bin/controller/user');
it('GetAppToken: now unknown user', () => {
    expect(user.getAppToken(0)).toBe(-1);
});
// jest.unmock('express');
// jest.unmock('../routes/users');


// var req = {
//     body: {username: "Mark", fbtoken: "AAA", apptoken: "111"},
//     session: {}
// };


// const initUsers = () => {
//     const app = express();
//     app.use(router());
//     return app;
//   }

// const res = {};
// const next = {};

// module.exports = class BookController {
//     static async getAll() {
//       return await Book.query()
//         .eager('reviews');
//     }
//   };

// var stub = sinon.stub(BookController, 'getAll');
// stub.resolves({response:"ok"});
// var bc = new BookController();
// bc.getAll.then(function(data){
//     expect(data.response).to.equal("ok");
//     done();
// },function(err){
//     done("should NEVER get here");
// });