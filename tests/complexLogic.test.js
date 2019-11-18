const complexLogic = require("../bin/complexLogic/complexLogic");
jest.disableAutomock();

/*
 * pathFinding testing
*/
/*
 * pathFinding testing
*/
var pfTests = [
    [{lat:0, lng:0}, []],           //only courier location
    [0, []],          //invalid data1 
    [{lat:0, lng:0}, [{lat:2.5, lng:2.5, deslat: null, deslng: 1, status: 0}]],  //invalid data2
    [{lat:0, lng:0}, [{lat:2.5, deslat: 1, deslng: 1, status: 0}]],              //invalid data3
    [{lat:0, lng:0}, [{lat:2.5, lng:2.5, deslat: 1, deslng: 1, status: 0}]],   //1 order
    [{lat:0, lng:0}, [{lat:2.5, lng:2.5, deslat: 1, deslng: 1, status: 1}]],   //1 order, not accepted
    [{lat:0, lng:0}, [{lat:3, lng:3, deslat: 1, deslng: 1, status: 0}, 
                      {lat:4, lng:4, deslat: 2.5, deslng: 2.5, status: 0}]],    //2 orders
    [{lat:0, lng:0}, [{lat:4, lng:4, deslat: 2.5, deslng: 2.5, status: 0}, 
                      {lat:3, lng:3, deslat: 1, deslng: 1, status: 0}]],        //2 orders, reversed
    [{lat:0, lng:0}, [{lat:3, lng:3, deslat: 1, deslng: 1, status: 0},         //large test
                      {lat:4, lng:4, deslat: 2.5, deslng: 2.5, status: 0}, 
                      {lat:5.5, lng:-1, deslat: -3, deslng: 0, status: 0}, 
                      {lat:45.00005, lng:59.9995, deslat: 0.5, deslng: 5, status: 0}]],
    [{lat:10, lng:10}, [{lat:3, lng:3, deslat: 1, deslng: 1, status: 0},         //large test, different start pos
                        {lat:4, lng:4, deslat: 2.5, deslng: 2.5, status: 0}, 
                        {lat:5.5, lng:-1, deslat: -3, deslng: 0, status: 0}, 
                        {lat:45.00005, lng:59.9995, deslat: 0.5, deslng: 5, status: 0}]]                      
];                      
var pfExpected = [
    [],
    [],
    [],
    [],
    [{lat: 0, lng: 0}, {lat: 1, lng: 1}, {lat: 2.5, lng: 2.5}],
    [],
    [{lat: 0, lng: 0}, {lat: 1, lng: 1}, {lat: 2.5, lng: 2.5}, {lat: 3, lng: 3}, {lat: 4, lng: 4}],
    [{lat: 0, lng: 0}, {lat: 1, lng: 1}, {lat: 2.5, lng: 2.5}, {lat: 3, lng: 3}, {lat: 4, lng: 4}],
    [{lat: 0, lng: 0}, {lat: -3, lng: 0}, {lat: 1, lng: 1}, {lat: 2.5, lng: 2.5}, {lat: 0.5, lng: 5}, 
                       {lat: 4, lng: 4}, {lat: 3, lng: 3}, {lat: 5.5, lng: -1}, {lat: 45.00005, lng: 59.9995}],
    [{lat: 10, lng: 10}, {lat: 0.5, lng: 5}, {lat: 2.5, lng: 2.5}, {lat: 1, lng: 1}, {lat: -3, lng: 0}, 
                       {lat: 5.5, lng: -1}, {lat: 3, lng: 3}, {lat: 4, lng: 4}, {lat: 45.00005, lng: 59.9995}],
];

var soTests = [
    [{lat:0, lng:0}, []],           //only courier location 
    [{lat:0, lng:0}, [{deslat: 0.001, deslng: 0.0011, time: '20:00:00', status: 0}]],   //1 accepted order
    [{lat:0, lng:0}, [{deslat: 0.001, deslng: 0.0011, time: '20:00:00', status: 1}]],   //1 unaccepted order
    [{lat:0, lng:0}, [{deslat: 0.001, deslng: 0.0011, time: '20:00:00', status: 1},     //2 identical orders
                      {deslat: 0.001, deslng: 0.0011, time: '20:00:00', status: 1}]],  
    [{lat:0, lng:0}, [{deslat: 0.001, deslng: 0.0011, time: '20:01:00', status: 1},     //2 different time orders
                      {deslat: 0.001, deslng: 0.0011, time: '20:00:00', status: 1}]],   
    [{lat:0, lng:0}, [{deslat: 0.001, deslng: 0.001, time: '20:00:00', status: 1},     //2 different places orders
                      {deslat: 0.001, deslng: 0.003, time: '20:00:00', status: 1}]],
    [{lat:0, lng:0}, [{deslat: 0.001, deslng: 0.0019, time: '20:00:00', status: 1},     //large test
                      {deslat: 0.001, deslng: 0.0011, time: '20:00:00', status: 1},
                      {deslat: 0.0019, deslng: 0.0019, time: '20:00:00', status: 1}]],  
    [{lat:0, lng:0}, [{deslat: 0.001, deslng: 0.0011, time: '20:02:00', status: 1},     //large test
                      {deslat: 0.001, deslng: 0.0011, time: '20:01:00', status: 1},
                      {deslat: 0.001, deslng: 0.0011, time: '20:00:00', status: 1}]],   
    [{lat:0, lng:0}, [{deslat: 0.001, deslng: 0.002, time: '20:01:00', status: 1},//2     //large tests, different status
                      {deslat: 0.001, deslng: 0.001, time: '20:00:00', status: 1},//1
                      {deslat: 0.003, deslng: 0.003, time: '20:00:00', status: 1},//3
                      {deslat: 0.0007, deslng: 0.0012, time: '20:40:00', status: 1},//4
                      {deslat: 0.0029, deslng: 0.0040, time: '21:00:00', status: 0},
                      {deslat: 0.0019, deslng: 0.0019, time: '20:00:00', status: 0},
                      {deslat: 0.0019, deslng: 0.0019, time: '20:00:00', status: 0}]], 

]

var soExpected = [
    [],           //only courier location 
    [{deslat: 0.001, deslng: 0.0011, time: '20:00:00', status: 0}],     //1 accepted order
    [{deslat: 0.001, deslng: 0.0011, time: '20:00:00', status: 1}],     //1 unaccepted order
    [{deslat: 0.001, deslng: 0.0011, time: '20:00:00', status: 1},      //2 identical orders
     {deslat: 0.001, deslng: 0.0011, time: '20:00:00', status: 1}],  
    [{deslat: 0.001, deslng: 0.0011, time: '20:00:00', status: 1},
     {deslat: 0.001, deslng: 0.0011, time: '20:01:00', status: 1}],     //2 different time orders
    [{deslat: 0.001, deslng: 0.001, time: '20:00:00', status: 1},     //2 different place orders
     {deslat: 0.001, deslng: 0.003, time: '20:00:00', status: 1}],
    [{deslat: 0.001, deslng: 0.0011, time: '20:00:00', status: 1},      //large test
     {deslat: 0.001, deslng: 0.0019, time: '20:00:00', status: 1},     
     {deslat: 0.0019, deslng: 0.0019, time: '20:00:00', status: 1}],   
     [{deslat: 0.001, deslng: 0.0011, time: '20:00:00', status: 1},      //large test
     {deslat: 0.001, deslng: 0.0011, time: '20:01:00', status: 1},     
     {deslat: 0.001, deslng: 0.0011, time: '20:02:00', status: 1}],      
    [{deslat: 0.0029, deslng: 0.0040, time: '21:00:00', status: 0},
     {deslat: 0.0019, deslng: 0.0019, time: '20:00:00', status: 0},
     {deslat: 0.0019, deslng: 0.0019, time: '20:00:00', status: 0},
     {deslat: 0.001, deslng: 0.001, time: '20:00:00', status: 1},
     {deslat: 0.001, deslng: 0.002, time: '20:01:00', status: 1},
     {deslat: 0.003, deslng: 0.003, time: '20:00:00', status: 1},
     {deslat: 0.0007, deslng: 0.0012, time: '20:40:00', status: 1}]]



describe('pathFinding', () => {
    for (let i = 0; i < pfTests.length; i++) {
        it('asserts deep equality ' + i, () => {
            expect(complexLogic.pathFinding(pfTests[i][1], pfTests[i][0].lat, pfTests[i][0].lng)).toEqual(pfExpected[i]);
        });
    }
});



/*
 * sortOrders testing
*/
describe('sortOrders', () => {
    for (let i = 0; i < soTests.length; i++) {
        it('asserts equality ' + i, () => {
            expect(complexLogic.sortOrder(soTests[i][1], soTests[i][0].lat, soTests[i][0].lng)).toEqual(soExpected[i]);
        });
    }
});

