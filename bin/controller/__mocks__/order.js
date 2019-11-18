// __mocks__/order.js
 
//id, userid, courierId, content, lat, lng, deslat, deslng, status, time
var database = [
];
 

 
const accept = (orderId, courierId) => {
  for(var i = 0; i < database.length; i++){
    if(database[i].id == orderId){
      database[i].status = 0;
      database[i].courierid = courierId;
    }
}
  return 1;
}
 
const getOrder = (courierId) => {
  var res = [];
    for(var i = 0; i < database.length; i++){
      if(database[i].status == 1 || (database[i].courierid == courierId && database[i].status == 0)){
        res.push(database[i]);
    }
}
  return res;
}
 

const getUserOrder = (userId) => {
  var res = [];
     for(var i = 0; i < database.length; i++){
      if((database[i].userid == userId || (database[i].courierid == uderId) && database[i].status == 0)){
        res.push({id: database[i].id, content: database[i].content, locFrom: {lat: database[i].lat, lng: database[i].lng}, locTo: {deslat: database[i].deslat, deslng: database[i].deslng}, time: database[i].time});
    }
}

const place = (userId, content, lat, lng, deslat, deslng, time) => {
  database.push({id: database.length, userid: userId, courierId: -1, content: content, lat: lat, lng: lng, deslat: deslat, deslng: deslng, status: 0, time: time});
  return 1;
}

const finish = (orderId) => {
  for(var i = 0; i < database.length; i++){
    if(database[i].id == orderId){
      database[i].status = -1;
    }
  }
  return 1;
}
 
module.exports = {
  accept,
  getOrder,
  getUserOrder,
  place,
  finish
};
