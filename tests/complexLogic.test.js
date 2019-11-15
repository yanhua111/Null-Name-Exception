const complexLogic = require("../bin/complexLogic/complexLogic");

/*
 * pathFinding testing
*/
var pfTests = [
    [{lat:0, lng:0}, []],           //only courier location 
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
    [{lat: 0, lng: 0}, {lat: 1, lng: 1}, {lat: 2.5, lng: 2.5}],
    [],
    [{lat: 0, lng: 0}, {lat: 1, lng: 1}, {lat: 2.5, lng: 2.5}, {lat: 3, lng: 3}, {lat: 4, lng: 4}],
    [{lat: 0, lng: 0}, {lat: 1, lng: 1}, {lat: 2.5, lng: 2.5}, {lat: 3, lng: 3}, {lat: 4, lng: 4}],
    [{lat: 0, lng: 0}, {lat: -3, lng: 0}, {lat: 1, lng: 1}, {lat: 2.5, lng: 2.5}, {lat: 0.5, lng: 5}, 
                       {lat: 4, lng: 4}, {lat: 3, lng: 3}, {lat: 5.5, lng: -1}, {lat: 45.00005, lng: 59.9995}],
    [{lat: 10, lng: 10}, {lat: 0.5, lng: 5}, {lat: 2.5, lng: 2.5}, {lat: 1, lng: 1}, {lat: -3, lng: 0}, 
                       {lat: 5.5, lng: -1}, {lat: 3, lng: 3}, {lat: 4, lng: 4}, {lat: 45.00005, lng: 59.9995}],
];

describe('pathFinding', () => {
    for (let i = 0; i < pfTests.length; i++) {
        it('asserts deep equality', () => {
            expect(complexLogic.pathFinding(pfTests[i][1], pfTests[i][0].lat, pfTests[i][0].lng)).toEqual(pfExpected[i]);
        });
    }
});


/*
 * sortOrders testing
*/

