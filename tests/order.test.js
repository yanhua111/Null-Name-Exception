const order = require('../bin/controller/order');

const orders = [
    {userId: 1, content: 'burger', lat:0, lng:0, deslat: 1, deslng: 1, time: '09:00:00'},
    {userId: 2, content: 'burger', lat:1, lng:1, deslat: 2, deslng: 2, time: '19:00:00'},
    {userId: 3, content: 'burger', lat:2, lng:2, deslat: 3, deslng: 3, time: '14:30:00'}, 
];
it('Place: Place an order', () => {
    expect(order.place(orders[0].userId, orders[0].content, orders[0].lat, orders[0].lng, orders[0].deslat, orders[0].deslng, orders[0].time)).toBe(1);
});
it('Accept: courier 0 accept order 0', () => {
    expect(order.accept(0, 0)).toBe(1);
});
it('getOrder: courier 0 accepted order', () => {
    expect(order.getOrder(0)).toStrictEqual([{id: 0, userid: 1, courierId: 0, content: 'burger', lat: 0, lng: 0, deslat: 1, deslng: 1, status: 0, time: '09:00:00'}]);
});
it('getUserOrder: user 1 order', () => {
    expect(order.getUserOrder(1)).toStrictEqual([{id: 0, content: 'burger', locFrom: {lat: 0, lng: 0}, locTo: {deslat: 1, deslng: 1}, time: '09:00:00'}]);
});
it('finish: finish an order', () => {
    expect(order.finish(1)).toBe(1);
});

