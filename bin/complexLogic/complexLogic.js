//var adjKey = ["Starbucks", "Village", "Triple O's", "Shopper's", "Tim Horton's"];
var adjMatrix = [
  [0, 1100, 300, 2000, 1400],
  [1100, 0, 1200, 3000, 2300],
  [300, 1200, 0, 2200, 1500],
  [2000, 3000, 2200, 0, 2900],
  [1400, 2300, 1500, 2900, 0]
];
var adjLoc = [
  {x:45, y:64}, 
  {x:45, y:64}, 
  {x:45, y:64}, 
  {x:45, y:64},
  {x:45, y:64}
];
/*
startPos: starting position of courier
twoVisit: 2D array of locations to visit
custLoc: 2D array of customer loactions, with respect to toVisit orders, ie. toVisit[1] contains orders of custLoc[1]
returns the shortest possible path to pickup deliveries and get to customer
*/
const solve = (startPos, twoVisit) => {
  //adds all non repeating points to new 1D array
  var toVisit = new Array();
  for (var i = 0; i < twoVisit.length; i++) {
    for (var j = 0; j < twoVisit[i].length; j++) {
      if (!toVisit.includes(twoVisit[i][j])) {
        toVisit.push(twoVisit[i][j]);
      }
    }
  } 
  toVisit = permute(startPos, toVisit, 0, Number.MAX_SAFE_INTEGER); 

  return toVisit;
}

const permute = (startPos, toVisit, l, minWeight) => { 
  if (l == toVisit.length - 1) {
    //gets the starting distance and the distance of points to visit in order
    var weight = getWeight(toVisit) + getDist(startPos, toVisit[0]);
    if (weight < minWeight) {
      minWeight = weight;    
      var minRoute = [...toVisit];
    }
  } 
  else { 
    for (var i = l; i < toVisit.length; i++) {
      if (l !== i) {
        let temp = toVisit[l];
        toVisit[l] = toVisit[i];
        toVisit[i] = temp;        
      } 
      minRoute = permute(startPos, toVisit, l+1, minWeight); 
      if (l !== i) {
        let temp = toVisit[l];
        toVisit[l] = toVisit[i];
        toVisit[i] = temp;        
      } 
    } 
  } 
  return minRoute;
}

const getWeight = (toVisit) => {
  var weight = 0;
  for (var i = 0; i < toVisit.length - 1; i++) {
    //console.log(toVisit[i]);
    //console.log(toVisit[i+1]);    
    weight += adjMatrix[toVisit[i]][toVisit[i+1]];
  }
  return weight;
}

const getDist = (point, index) => Math.sqrt(Math.pow(point.x - adjLoc[index].x, 2) + Math.pow(point.y - adjLoc[index].y, 2));

module.exports = {"solve": solve, "permute": permute, "getWeight": getWeight};
