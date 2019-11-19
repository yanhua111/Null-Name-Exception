/* eslint-disable no-undef */
const app = require('../app');
const request = require('supertest');
describe('Post Endpoint', () => {
  const agent = request.agent(app);

  it('should create a new post', async () => {
    agent
      .get('/')
      .end((res) => {
        expect(res.body).toBe('Hello Server!');
      });
  });

  it('Place order', async () => {
    agent
    .post('order/place')
      .send({
        userid: 22,
        content: 'burger',
        lat: 49.261612,
        lng: -123.249413,
        deslat: 49.263,
        deslng: -123.248,
        time: '16:00:00',
        locFrom: "Woodward Library",
        locTo: "Kaiser building"
      })
      .end((res) => {
        expect(res.body.errno).toBe(0);
      });
  });

  it('Accept order', async () => {
    agent
      .post('order/accept')
      .send({
        orderid: 1,
        userid: 22
      })
      .end((res) => {
        expect(res.body.errno).toBe(0);
      });
  });


  it('Get all orders', async () => {
    agent
      .get('order/list')
      .end((res) => {
        expect(res.body.errno).toBe(0);
      });
  });


  it('Get current user order', async () => {
    agent
      .get('order/list_user')
      .end((res) => {
        expect(res.body.errno).toBe(0);
      });
  });

  it('Finish order', async () => {
    agent
      .post('order/finish')
      .send({
        orderid: 1
      })
      .end((res) => {
        expect(res.body.errno).toBe(0);
      });
  });

})