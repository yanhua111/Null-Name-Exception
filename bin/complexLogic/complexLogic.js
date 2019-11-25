// var orderFormat = {id, userid, courierid, content, lat, lng, deslat, deslng, status, time};
// var startPos = {lat:0, lng: 0};

/*
 * Traveling salesman pathfinding
 */
const pathFinding = (getOrders, latitude, longitude) => {
  if (getOrders.length == 0) {
    return getOrders; // return empty array
  }
  const startPos = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };

  const allOrders = [];
  for (let i = 0; i < getOrders.length; i++) {
    if (getOrders[i].status == 0) {
      allOrders.push(getOrders[i]);
    }
  }
  if (allOrders.length == 0) {
    return allOrders; // return empty array
  }

  let desArray = []; let custArray = [];
  for (let i = 0; i < allOrders.length; i++) {
    let loc = { latitude: allOrders[i].deslat, longitude: allOrders[i].deslng };
    custArray.push(loc);
    loc = { latitude: allOrders[i].lat, longitude: allOrders[i].lng };
    desArray.push(loc);
  }
  // removes repeating locations
  desArray = desArray.filter((desArray, index, self) =>
    index === self.findIndex((t) => (
      t.latitude === desArray.latitude && t.longitude === desArray.longitude
    ))
  );
  custArray = custArray.filter((custArray, index, self) =>
    index === self.findIndex((t) => (
      t.latitude === custArray.latitude && t.longitude === custArray.longitude
    ))
  );
  // finds min weight path first for locations, then for destination
  desArray = permute(desArray);
  desArray = findBest(startPos, desArray);

  custArray = permute(custArray);
  custArray = findBest(desArray[desArray.length - 1], custArray);
  // adds courier starting location and merges into 1 array
  desArray.unshift(startPos);
  desArray = desArray.concat(custArray);

  return desArray;
};

const permute = (toVisit) => {
  const permArray = [];

  for (let i = 0; i < toVisit.length; i = i + 1) {
    const rest = permute(toVisit.slice(0, i).concat(toVisit.slice(i + 1)));

    if (!rest.length) {
      permArray.push([toVisit[i]]);
    } else {
      for (let j = 0; j < rest.length; j = j + 1) {
        permArray.push([toVisit[i]].concat(rest[j]));
      }
    }
  }
  return permArray;
};

const findBest = (startPos, toVisit) => {
  let minWeight = Number.MAX_SAFE_INTEGER;
  let minRoute = [];
  for (let i = 0; i < toVisit.length; i++) {
    const weight = getWeight(toVisit[i]) + getDist(startPos, toVisit[i][0]);
    if (weight < minWeight) {
      minWeight = weight;
      minRoute = [...toVisit[i]];
    }
  }
  return minRoute;
};
const getWeight = (toVisit) => {
  var weight = 0;
  for (let i = 0; i < toVisit.length - 1; i++) {
    weight += getDist(toVisit[i], toVisit[i + 1]);
  }
  return weight;
};

const getDist = (start, end) => Math.sqrt(Math.pow(start.latitude - end.latitude, 2) + Math.pow(start.longitude - end.longitude, 2));

/*
 * return an array of sorted orders id
 */
const sortOrder = (allOrders, latitude, longitude) => {
  try {
    if (allOrders.length == 0) {
      return allOrders; // return empty array
    }
    const startPos = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
  
    let available = []; const current = [];
    for (let i = 0; i < allOrders.length; i++) {
      if (allOrders[i].status == 1) {
        available.push(allOrders[i]);
      } else if (allOrders[i].status == 0) {
        current.push(allOrders[i]);
      }
    }
    let i = 0;
    while (i < available.length) {
      const today = new Date();
      const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
      const curTime = parseInt(time[0]) * 60 + parseInt(time[1]);
      const itimeArr = available[i].time.split(':');
      const itime = parseInt(itimeArr[0]) * 60 + parseInt(itimeArr[1]) - curTime;
      if (itime < -30) {
        available.split(i, 1);
        i--;
      }
      i++;
    }
    available = mergeSort(startPos, available);
    return current.concat(available);
  } catch (err) {
    return err;
  }
};

const mergeSort = (startPos, available) => {
  if (available.length <= 1) {
    return available;
  }
  const mid = Math.floor(available.length / 2);
  const left = available.slice(0, mid);
  const right = available.slice(mid);

  return merge(mergeSort(startPos, left), mergeSort(startPos, right), startPos);
};

const merge = (L, R, startPos) => {
  const result = []; 
  let i = 0; 
  let j = 0;
  const today = new Date();
  const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
  const curTime = parseInt(time[0]) * 60 + parseInt(time[1]);
  while (i < L.length && j < R.length) {
    const iloc = { latitude: L[i].deslat, longitude: L[i].deslng };
    const itimeArr = L[i].time.split(':');
    const itime = Math.abs(parseInt(itimeArr[0]) * 60 + parseInt(itimeArr[1]) - curTime);
    const iref = getDist(startPos, iloc) * 1000 + itime;
    const jloc = { latitude: R[j].deslat, longitude: R[j].deslng };
    const jtimeArr = R[j].time.split(':');
    const jtime = Math.abs(parseInt(jtimeArr[0]) * 60 + parseInt(jtimeArr[1]) - curTime);
    const jref = getDist(startPos, jloc) * 1000 + jtime;
    if (iref < jref) {
      result.push(L[i]);
      i++;
    } else {
      result.push(R[j]);
      j++;
    }
  }
  return result.concat(L.slice(i).concat(R.slice(j)));
};

module.exports = { pathFinding, sortOrder };