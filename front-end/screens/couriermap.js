import React from "react";
import { StyleSheet, Image, Text, View, Alert, TextInput, TouchableOpacity } from "react-native";
import MapView, { AnimatedRegion, Marker, ProviderPropType } from "react-native-maps";
import SocketIOClient from "socket.io-client";
import "../global";
import { URL, PORT, WebSocketPORT } from '../src/conf'


import customer from "../assets/customer.png";
import backicon from "../assets/back.png";
import locateicon from "../assets/locate.png";
// import locateUsericon from "../assets/locate_user.png";


/* A random latitude and longitude, required for declaring animated Marker
* interval- set the interval for repeated retrieving the user's location
*/
const LATITUDE = 49.267941;
const LONGITUDE = -123.247360;
let interval;

export default class CourierMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      apptoken: "",
      user_text: "",
      region: {
        latitude: 49.267941,
        longitude: -123.247360,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.00200
      },
      text: "",
      coordinate: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: 0,
        longitudeDelta: 0
      }),
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
    this.socket.emit("join", JSON.stringify({ orderid: global.id_ls }));
    this.socket.on("customerLocOut", (data) => {
      let loc = JSON.parse(data.location);
      if (loc.orderid != -1 && loc.orderid == global.id_ls) {
        let location = {
          latitude: loc.lat,
          longitude: loc.lng
        };
        //update position on map
        // this.setPosition(location);
        this.animate(location);
      }

    });
  }


  /* When component mounts, set up interval to get user location repeatedly */
  componentDidMount() {
    interval = setInterval(() => {
      this.getUserlocHandler();
    }, 1000);
    if (global.id_ls != -1) {
      this.socket.emit("join", JSON.stringify({ orderid: global.id_ls }));
    }
  }

  /* Clear the interval when component unmount */
  componentWillUnmount() {
    clearInterval(interval);
  }
  componentWillMount() {
    this.fetchCurOrder();
  }

  fetchCurOrder = () => {
    fetch(`${URL}:${PORT}/order/list_user`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((res) => {
      res.json().then(result => {
        // console.log(result.data.list[0].id)
        global.id_ls = result.data.list[0].id
        this.forceUpdate();
      })

    }
    ).catch((error) => console.log(error));
  }

  /* Get the current user locatio, by calling navigator.geolocation.getCurrentPosition */
  getUserlocHandler = () => {
    console.log("emiiting id: ", global.id_ls);
    navigator.geolocation.getCurrentPosition((position) => {
      this.socket.emit("courierLocIn", JSON.stringify({ lat: position.coords.latitude, lng: position.coords.longitude, orderid: global.id_ls }));
    }, (err) => console.log(err));
  }

  /* locate user position and move to current location */
  locate = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        region: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.00922,
          longitudeDelta: 0.00200
        }
      })
    }, (err) => Alert.alert("PLease enable location"));
  }

  /* update the postion on map */
  // setPosition = (position) => {
  //   this.setState({
  //     position: {
  //       latitude: position.latitude,
  //       longitude: position.longitude,
  //       latitudeDelta: 0.00922,
  //       longitudeDelta: 0.00200
  //     }
  //   });
  // }

  /* Triggered when the region on map changes, update region state to current region */
  onRegionChange(region) {
    this.setState({ region });
  }

  /* Move Marker with animation */
  moveMarker() {
    this.marker._component.animateMarkerToCoordinate({
      latitude: 60.267941,
      longitude: -123.247360
    }, 500);
  }

  /* Animation */
  animate(location) {
    const { coordinate } = this.state;
    const newCoordinate = {
      latitude: location.latitude,  //+ Math.random(),
      longitude: location.longitude  //+ Math.random()
    };

    coordinate.timing(newCoordinate).start();
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={this.props.provider}
          region={this.state.region}
          showsUserLocation={true}
          followsUserLocation={true}
          onRegionChangeComplete={region => this.onRegionChange(region)}
          style={{ flex: 1 }} >
          {
            (global.id_ls != -1) && <Marker.Animated
              ref={(marker) => {
                this.marker = marker;
              }}
              coordinate={this.state.coordinate}
            >
              <Image source={customer} style={{ width: 50, height: 50 }} />
            </Marker.Animated>
          }
        </MapView>
        <TouchableOpacity style={styles.backbtn}
          onPress={() => { this.props.navigation.navigate("CourierScreen"); }} >
          <Image source={backicon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={{ position: "absolute", bottom: 60, right: 20, borderColor: 'black' }}
          onPress={() => this.locate()} >
          <Image source={locateicon} style={{ width: 30, height: 30 }} />
        </TouchableOpacity>
        {/* <TouchableOpacity style={{ position: "absolute", bottom: 60, right: 20, borderColor: 'black' }}
          onPress={() => this.locate()} >
          <Image source={locateicon} style={{ width: 30, height: 30 }} />
        </TouchableOpacity> */}
      </View>
    );
  }


}

CourierMap.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 0,
    margin: 0
  },
  btn: {
    borderWidth: 1,
    borderRadius: 3,
    margin: 10,
    padding: 10,
    borderColor: "black",
    backgroundColor: "yellow",
    borderStyle: "dotted"
  },
  icon: {
    width: 30,
    height: 30
  },
  backbtn: {
    position: 'absolute',
    top: 30,
    left: 10,
  }
});