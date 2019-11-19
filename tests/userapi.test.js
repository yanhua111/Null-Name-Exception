const app = require('../app');
const request = require('supertest');
const agent = request.agent(app);

describe('Post Endpoint', () => {
  it('should create a new post', async () => {
    agent
      .get('/')
      .expect()
      .end((res) => {
        expect(res.body).toBe('Hello Server!');
      })
  });

  it('Get Token', async () => {
    agent
      .post('users/get_token')
      .send({
        userid: 22
      })
      .end((res) => {
        expect(res.body.errno).toBe(0);
      })

  });

  it('Check for Login', async () => {
    agent
      .post('users/check')
      .send({
        userid: 22,
      })
      .end((res) => {
        expect(res.body.errno).toBe(0);
      })
  });


  it('Login', async () => {
    agent
      .post('users/login')
      .send({
        username: 'James',
        fbtoken: 'ABC',
        apptoken: 'ABC'
      })
      .end((res) => {
        expect(res.body.errno).toBe(0);
      })
  });


  it('Not specified mode', async () => {
    agent
      .post('users/switch')
      .send({
        usermode: ''
      })
      .end((res) => {
        expect(res.body.errno).toBe(-1);
      })
  });

  it('Switch mode', async () => {
    agent
      .post('users/switch')
      .send({
        usermode: 'courier'
      })
      .end((res) => {
        expect(res.body.errno).toBe(0);
      })
  });

  it('check for login', async () => {
    agent
      .get('users/check')
      .end((res) => {
        expect(res.body.errno).toBe(0);
        expect((request.session.username != null)).toBe(true);
      })
  });

  it('Set up user phone number', async () => {
    agent
      .post('users/setinfo')
      .send({
        username: 'James'
      })
      .end((res) => {
        expect(res.body.errno).toBe(0);
      })
  });

  it('Delete user', async () => {
    agent
      .post('users/setinfo')
      .send({
        userid: 22,
        username: 'James'
      })
      .end((res) => {
        expect(res.body.errno).toBe(0);
      })
  });

})