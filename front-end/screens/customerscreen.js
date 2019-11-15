import React from "react";
import {
  StyleSheet, Text, Image, View,
  TouchableOpacity, TimePickerAndroid, Alert, ToastAndroid
} from "react-native";
import MapView, { AnimatedRegion, Marker } from "react-native-maps";
import io from "socket.io-client";
import { URL, PORT, WebSocketPORT } from '../src/conf'
import "../global";

import courier from "../assets/courier.png";
import locateicon from "../assets/locate.png";
import backicon from "../assets/back.png";
import placeOrdericon from "../assets/plus.png"

/* A random latitude and longitude, required for declaring animated Marker*/
const LATITUDE = 49.267941;
const LONGITUDE = -123.247360;
const initRegion = {
  latitude: 49.267941,
  longitude: -123.247360,
  latitudeDelta: 0.00922,
  longitudeDelta: 0.0200
};

export default class CustomerScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      user_text: "",
      region: {
        latitude: 49.267941,
        longitude: -123.247360,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.0200
      },
      coordinate: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: 0,
        longitudeDelta: 0
      }),
      orderTime: {
        hour: -1,
        minute: -1
      },
    };
    /* Connect to server socket 
    * join socket io room by order id
    * listen to event 'locationOut', and update Marker position
    */
    // this.socket = SocketIOClient(`${URL}:${WebSocketPORT}`);
    this.socket = io(`${URL}:${WebSocketPORT}`);
    // this.socket.emit("join", JSON.stringify({ orderid: global.id_ls }));
    this.socket.on("courierLocOut", (data) => {
      let loc = JSON.parse(data.location);
      if (loc.orderid != -1 && loc.orderid == global.id_ls) {
        let location = {
          latitude: loc.lat,
          longitude: loc.lng
        };

        this.animate(location);
      }
      });
}

/* locate courier's position and move to current location */
locate = () => {
  navigator.geolocation.getCurrentPosition((position) => {
    let location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    this.animateRegion(location);
  }, (err) => Alert.alert("PLease enable location"));
  // this.setState({
  //   region: position
  // })
}

/* Get the current user locatio, by calling navigator.geolocation.getCurrentPosition */
getUserlocHandler = () => {
  navigator.geolocation.getCurrentPosition((position) => {
    this.socket.emit("customerLocIn", JSON.stringify({ lat: position.coords.latitude, lng: position.coords.longitude, orderid: global.id_ls }));
  }, (err) => console.log(err));
}

/* Triggered when the region on map changes, update region state to current region */
onRegionChange(region) {
  this.setState({ region });
}

/* Animation */
animate(location) {
  const { coordinate } = this.state;
  const newCoordinate = {
    latitude: location.latitude,
    longitude: location.longitude
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

/* When component mounts, set up interval to get user location repeatedly */
componentDidMount() {
  interval = setInterval(() => {
    this.getUserlocHandler();
  }, 1000);

  if (global.id_ls != -1) {
    this.socket.emit("join", JSON.stringify({ orderid: global.id_ls }));
  }
  this.locate();
}

/* Fetch order and check if user is in an order when entered */
componentWillMount() {
  this.fetchCurOrder();
}

/* Clear the interval when component unmount */
componentWillUnmount() {
  clearInterval(interval);
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
      global.id_ls = result.data.list[0].id
      this.forceUpdate();
    })

  }
  ).catch((error) => console.log(error));
}


/* Time picker */
async pickTime() {
  try {
    const { action, hour, minute } = await TimePickerAndroid.open({
      hour: 14,
      minute: 0,
      is24Hour: false, // Will display '2 PM'
    });
    if (action !== TimePickerAndroid.dismissedAction) {
      this.setState({
        orderTime: {
          hour: hour,
          minute: minute
        }
      })
    }
  } catch ({ code, message }) {
    console.warn('Cannot open time picker', message);
  }
}

render() {
  // let handles = this.state.panResponder.panHandlers;
  return (
    <View style={styles.container}>
      <MapView
        ref={(map) => {
          this.map = map;
        }}
        initialRegion={initRegion}
        showsUserLocation={true}
        style={{ flex: 1 }} >
        {
          (global.id_ls != -1) && <Marker.Animated
            ref={(marker) => {
              this.marker = marker;
            }}
            coordinate={this.state.coordinate}
          >
            <Image source={courier} style={{ width: 50, height: 50 }} />
          </Marker.Animated>
        }
      </MapView>

      <TouchableOpacity style={styles.backbtn}
        onPress={() => { this.props.navigation.navigate("DashboardScreen"); }} >
        <Image source={backicon} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.placebtn}
        onPress={() => { this.props.navigation.navigate("OrderScreen"); }} >
        <Image source={placeOrdericon} style={styles.largeicon} />
      </TouchableOpacity>

      <TouchableOpacity style={{ position: "absolute", bottom: 40, right: 20, borderColor: 'black' }}
        onPress={() => this.locate()} >
        <Image source={locateicon} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 0,
  },
  icon: {
    width: 30,
    height: 30
  },
  backbtn: {
    position: 'absolute',
    top: 30,
    left: 10,
  },
  largeicon: {
    width: 50,
    height: 50
  },
  placebtn: {
    position: 'absolute',
    bottom: 30,
    left: 30,
  }
});