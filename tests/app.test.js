//import React from 'react';
//jest.unmock('React');

//jest.mock('user', () => require.requireActual('../bin/controller/__mocks__/user').default);

// describe('pathFinding', () => {
//     it('asserts deep equality', () => {
//         expect(        
//             fetch(`${URL}:${PORT}/order/list`, {
//             method: "GET",
//             headers: {
//               Accept: "application/json",
//               "Content-Type": "application/json",
//             },
//             credentials: "include",
//           }).then((res) => {
//               res.json().then(result =>{
//                 console.log(result);
//               })
//           } 
//           ).catch((error) => console.log(error))).toBe(0);
//     })

// });
    
const fetch = require("node-fetch");
test('the data is peanut butter', () => {
    return fetch(`http://ec2-99-79-78-181.ca-central-1.compute.amazonaws.com:3000/order/list`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      }).then(data => {
          data.json().then(result =>{
            expect(result).toBe('peanut butter');
            console.log(result);
          })
      
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