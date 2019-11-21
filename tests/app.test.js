jest.disableAutomock();
jest.mock('../bin/controller/user'); 
jest.mock('express');   
const fetch = require("node-fetch");

//Orders
test('Sorted list of available orders', () => {
    return fetch(`http://ec2-99-79-78-181.ca-central-1.compute.amazonaws.com:3000/order/list`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      }).then(data => {
          data.json().then(result =>{
            expect(result).toEqual({"data": {"list": [{"content": "Order", "courierid": -1, "deslat": 49.261269, "deslng": -123.248932, 
                                             "id": 69, "lat": 49.261612, "lng": -123.249413, "locFrom": "Embrace Orthopaedics Inc.", 
                                             "locTo": "undefined", "status": 1, "time": "17:31:00", "userid": 44}, {"content": "Dont accept this！！！", 
                                             "courierid": -1, "deslat": 49.262161, "deslng": -123.249252, "id": 70, "lat": 49.261612, "lng": -123.249413, 
                                             "locFrom": "Engineering Student Centre", "locTo": "undefined", "status": 1, "time": "18:00:00", "userid": 44}]}, 
                                             "errno": 0});
          }).catch((error) => console.log(error));
      
    });
  });

  test('Accept an order and returns pathfinding logic', () => {
    return fetch(`${URL}:${PORT}/order/accept`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
         orderid: order_id, 
         }),
      }).then(data => {
          data.json().then(result =>{
            expect(result).toEqual({"data": {}});
          }).catch((error) => console.log(error));
      
    });
  });

  test('Known user login', () => {
    return fetch(`${URL}:${PORT}/users/get_token`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          //userid: global.user_id_ls,
          userid: userid
          }),
      }).then(data => {
          data.json().then(result =>{
            expect(result).toEqual({"data": {
                errno: 0,
                message: 'Login successully!'
              }});
          }).catch((error) => console.log(error));
      
    });
  });
        
// check_login = () => {
//     fetch("http://ec2-99-79-78-181.ca-central-1.compute.amazonaws.com:3000/users/check", {
//             method: "GET",
//             headers: {
//               Accept: "application/json",
//               "Content-Type": "application/json",
//             },
//             credentials: "include",
//           }).then((response) => {}
// }