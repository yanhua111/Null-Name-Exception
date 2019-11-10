const Order = require('../controller/order');
//  return an array of sorted orders id
const sort = (startTime, endTime, locRange) => {
  var allOrders = Order.getAvailableOrder(); // getAvailableOrder() returns all available orders' time (toShow[0]), store location(1), and id(2)
  var toShow = [];
  //    add all orders meet the preferences
  for (var i = 0; i < allOrders.length; i++) {
    if (allOrders[i][0] < endTime && allOrders[i][0] > startTime && locRange >= allOrders[i][1]) {
      toShow.push(allOrders[i]);
    }
  }
  //    sorting the array
  var a, b, min;
  for (a = 0; a < toShow.length - 1; a++) {
    min = a;
    for (b = a + 1; b < toShow.length; b++) {
      var curRef = (toShow[b][0] - startTime) * toShow[b][1];
      var minRef = (toShow[min][0] - startTime) * toShow[min][1];
      if (curRef < minRef) {
        min = b;
      }
      var temp = toShow[min];
      toShow[min] = toShow[a];
      toShow[a] = temp;
    }
  }
  for (var c = 0; c < toShow.length; c++) {
    toShow[c] = toShow[c][2]; //  store order id only
  }
  return toShow;
};
module.exports = sort;