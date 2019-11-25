/* eslint-disable camelcase */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import React from 'react';
import { StyleSheet, Image, Text, View, Alert, TouchableOpacity } from 'react-native';
import MapView, { AnimatedRegion, Marker } from 'react-native-maps';
// import { MapView } from 'expo';
import SocketIOClient from 'socket.io-client';
import '../global';
import { URL, PORT, WebSocketPORT, APIKEY } from '../src/conf';
import MapViewDirections from 'react-native-maps-directions';

import locateicon from '../assets/locate.png';
// import locateUsericon from "../assets/locate_user.png";

/* A random latitude and longitude, required for declaring animated Marker
* interval- set the interval for repeated retrieving the user's location
*/
const LATITUDE = 49.267941; // a random number for the initial region
const LONGITUDE = -123.247360; // a random number as well....
const initRegion = {
  latitude: 49.267941,
  longitude: -123.247360,
  latitudeDelta: 0.00922,
  longitudeDelta: 0.0200
};
var interval;

export default class CourierMap extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      apptoken: '',
      user_text: '',
      text: '',
      coordinate: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: 0,
        longitudeDelta: 0
      })
      // position: {
      //   latitude: 49.267941,
      //   longitude: -123.247360,
      //   latitudeDelta: 0.00922,
      //   longitudeDelta: 0.0200
      // }
    };

    /* Connect to server socket
    * join socket io room by order id
    * listen to event 'locationOut', and update Marker position
    */
    //  if(global.id_ls != -1) {
    this.socket = SocketIOClient(`${URL}:${WebSocketPORT}`);
    // this.socket.emit("join", JSON.stringify({ orderid: global.id_ls }));
    // this.socket.on("customerLocOut", (data) => {
    //   let loc = JSON.parse(data.location);
    //   if (loc.orderid != -1 && loc.orderid == global.id_ls) {
    //     let location = {
    //       latitude: loc.lat,
    //       longitude: loc.lng
    //     };
    //     //update position on map
    //     // this.setPosition(location);
    //     this.animate(location);
    //   }

    // });
  }

  pos = {
    lat: 0,
    lng: 0,
    objArray: [],
    distance: 0,
    duration: 0
  }

  /* When component mounts, set up interval to get user location repeatedly */
  componentDidMount () {
    interval = setInterval(() => {
      this.getUserlocHandler();
      this.pathFinding_order();
      // this.fetchCurOrder();
      this.setState(() => {
        return { unseen: 'does not display' };
      });
    }, 1000);
    if (global.id_ls != -1) {
      this.socket.emit('join', JSON.stringify({ orderid: global.id_ls }));
    }
    this.locate();
  }

  /* Clear the interval when component unmount */
  componentWillUnmount () {
    clearInterval(interval);
  }

  componentWillMount () {
    this.fetchCurOrder();
  }

  fetchCurOrder = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      fetch(`${URL}:${PORT}/order/list?curlat=${location.latitude}&curlng=${location.longitude}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }).then((res) => {
        res.json().then(result => {
        // console.log("Evan console: ", result.data.list[0].id)
          if (result.data.list[0].status == 0) {
            global.id_ls = result.data.list[0].id;
            this.forceUpdate();
          }
        });
      }
      ).catch((error) => console.log(error));
    });
  }

  /* Get the current user locatio, by calling navigator.geolocation.getCurrentPosition */
  getUserlocHandler = () => {
    // console.log("emiiting id: ", global.id_ls);
    navigator.geolocation.getCurrentPosition((position) => {
      // if (Math.abs(this.pos.lat - position.coords.latitude) > 0.00005 || Math.abs(this.pos.lng - position.coords.longitude) > 0.00005) {
      this.pos.lat = position.coords.latitude;
      this.pos.lng = position.coords.longitude;
      // }
      this.socket.emit('courierLocIn', JSON.stringify({ lat: position.coords.latitude, lng: position.coords.longitude, orderid: global.id_ls }));
    }, (err) => console.log(err));
  }

  pathFinding_order = () => {
    fetch(`${URL}:${PORT}/order/list?pathfinding=1&curlat=${this.pos.lat}&curlng=${this.pos.lng}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }).then((res) => {
      res.json().then(result => {
        this.pos.objArray = result.data.list;
        console.log('Evan console:', this.pos.objArray);
      });
    }
    ).catch((error) => console.log('Error: ' + error));
  }

  /* locate user position and move to current location */
  locate = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      this.animateRegion(location);
    }, () => Alert.alert('PLease enable location'));
  }

  /* Triggered when the region on map changes, update region state to current region */
  onRegionChange (region) {
    this.setState({ region });
  }

  /* Animation for marker */
  animate (location) {
    const { coordinate } = this.state;
    const newCoordinate = {
      latitude: location.latitude, // + Math.random(),
      longitude: location.longitude // + Math.random()
    };

    coordinate.timing(newCoordinate).start();
  }

  /* Animation for Map region */
  animateRegion = (location) => {
    const region = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.00922,
      longitudeDelta: 0.0200
    };

    this.map.animateToRegion(region, 500);
  }

  render () {
    return (
      <View style={styles.container}>
        <MapView
          ref={(map) => {
            this.map = map;
          }}
          initialRegion={initRegion}
          showsUserLocation={true}
          style={{ flex: 1 }} >
          {/* {
            (global.id_ls != -1) && <Marker.Animated
              ref={(marker) => {
                this.marker = marker;
              }}
              coordinate={this.state.coordinate}
              title='Cust'
              description='350'
            >
              <Image source={customer} style={{ width: 50, height: 50 }} />

            </Marker.Animated>
          } */}
          {(this.pos.objArray.length >= 2 && this.pos.lat != 0) && (
            <MapViewDirections
              origin={this.pos.objArray[0]}
              waypoints={ (this.pos.objArray.length > 2) ? this.pos.objArray.slice(1, -1) : null}
              destination={this.pos.objArray[this.pos.objArray.length - 1]}
              apikey={APIKEY}
              strokeWidth={3}
              strokeColor='#FF0000'
              optimizeWaypoints={false}
              mode='WALKING'
              onStart={(params) => {
              // console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
              }}
              onReady={result => {
                if (result.distance != undefined && result.duration != undefined) {
                  this.pos.distance = parseFloat(result.distance.toFixed(2));
                  this.pos.duration = parseFloat(result.duration.toFixed(1));
                }
              }}
              onError={(errorMessage) => {
              }}
            />
          )}
          {(this.pos.objArray.length > 2) && (
            this.pos.objArray.slice(1).map(marker => (
              <Marker
                // key={marker.latitude+marker.longitude}
                coordinate={marker || { latitude: 0, longitude: 0 }}
                title={this.pos.objArray.indexOf(marker).toString()}
                // description={marker.lng}
              />
            )))}

        </MapView>
        <View style = {styles.container1} >
          <Text style = {styles.text}>Distance: {this.pos.distance} km    Time: {this.pos.duration} m</Text>
        </View>

        <TouchableOpacity style={{ position: 'absolute', bottom: 60, right: 20, borderColor: 'black' }}
          onPress={() => this.locate()} >
          <Image source={locateicon} style={{ width: 30, height: 30 }} />
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 0,
    margin: 0,
    flexDirection: 'column'
  },
  container1: {
    flex: 0.05,
    backgroundColor: 'black',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  btn: {
    borderWidth: 1,
    borderRadius: 3,
    margin: 10,
    padding: 10,
    borderColor: 'black',
    backgroundColor: 'yellow',
    borderStyle: 'dotted'
  },
  icon: {
    width: 30,
    height: 30
  },
  backbtn: {
    position: 'absolute',
    top: 30,
    left: 10
  },
  text: {
    padding: 0,
    fontSize: 20,
    color: 'white',
    textAlign: 'center'
  }
});
