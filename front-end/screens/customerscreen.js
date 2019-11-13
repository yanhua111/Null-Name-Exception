import React from "react";
import {
  StyleSheet, Text, Image, View,
  TouchableOpacity, TimePickerAndroid, Alert, ToastAndroid
} from "react-native";
import MapView, { AnimatedRegion, Marker, ProviderPropType } from "react-native-maps";
import SocketIOClient from "socket.io-client";
import { URL, PORT, WebSocketPORT } from '../src/conf'

import runicon from "../assets/run.png";
import locateicon from "../assets/locate.png";
import backicon from "../assets/back.png";
import placeOrdericon from "../assets/plus.png"
// import locateUsericon from "../assets/locate_user.png";

/* A random latitude and longitude, required for declaring animated Marker*/
const LATITUDE = 49.267941;
const LONGITUDE = -123.247360;

export default class CustomerScreen extends React.Component {

  constructor(props) {
    super(props);

    /* Movable view initilization and operation, might be used later */
    // const movablePosition = new Animated.ValueXY();
    // const panResponder = PanResponder.create({
    //   onStartShouldSetPanResponder: () => true,
    //   onPanResponderMove: (event, gesture) => {
    //     movablePosition.setValue({ x: gesture.dx, y: gesture.dy });
    //   }
    // });

    this.state = {
      user_text: "",
      // panResponder,
      // movablePosition,
      showOderInfo: false,
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
      position: {
        latitude: 49.267941,
        longitude: -123.247360,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.0200
      },
      orderTime: {
        hour: -1,
        minute: -1
      },
    };
    /* Connect to server socket 
    * join socket io room by order id
    * listen to event 'locationOut', and update Marker position
    */
    this.socket = SocketIOClient(`${URL}:${WebSocketPORT}`);
    this.socket.on("locationOut", (data) => {
      let location = {
        latitude: JSON.parse(data.location).lat,
        longitude: JSON.parse(data.location).lng
      };
      //update position on map
      this.setPosition(location);
      this.animate(location);
    });
  }

  /* update the postion on map */
  setPosition = (position) => {
    this.setState({
      position: {
        latitude: position.latitude,
        longitude: position.longitude,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.00200
      }
    });
  }

  /* locate courier's position and move to current location */
  locate = (position) => {
    this.setState({
      region: position
    })
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

  /* place order handler */
  get_order_info = () => {
    if (this.state.user_text === "") {
      Alert.alert('Invalid order', 'Please enter order content!');
      return;
    }
    if (this.state.orderTime.hour === -1) {
      Alert.alert('Invalid order', 'Please enter a time!');
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position.coords.latitude)
      console.log(position.coords.longitude)
      this.place_order(position.coords.latitude, position.coords.longitude, `${this.state.orderTime.hour}:${this.state.orderTime.minute}:00`);
    }, (err) => console.log(err));
  }

  /* place a order */
  place_order = (lat, lng, time) => {
    fetch(`${URL}:${PORT}/order/place`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        content: this.state.user_text,
        lat: lat,
        lng: lng,
        time: time
      }),
    }).then(() => {
      this.setState({ showOderInfo: false });
      ToastAndroid.showWithGravityAndOffset(
        'Order Placed!',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    })
  }

  /* show place order form */
  toggleModal = () => {
    this.setState({ showOderInfo: !this.state.showOderInfo });
  };

  /* Make sure modal is closed */
  componentWillUnmount() {
    this.setState({ showOderInfo: false });
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
          provider={this.props.provider}
          region={this.state.region}
          onRegionChangeComplete={this.onRegionChange.bind(this)}
          style={{ flex: 1 }} >
          <Marker.Animated
            ref={(marker) => {
              this.marker = marker;
            }}
            coordinate={this.state.coordinate}
            image={runicon}
          />
        </MapView>
        {/* TODO: Movavle view, try put it under the map.... */}
        {/* <Animated.View
            style={[styles.circle, this.state.movablePosition.getLayout()]}
            {...handles}
         /> */}

        <TouchableOpacity style={styles.backbtn}
          onPress={() => { this.props.navigation.navigate("DashboardScreen"); }} >
          <Image source={backicon} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.placebtn}
          onPress={() => { this.props.navigation.navigate("OrderScreen"); }} >
          <Image source={placeOrdericon} style={styles.largeicon} />
        </TouchableOpacity>

        <TouchableOpacity style={{ position: "absolute", bottom: 40, right: 20, borderColor: 'black' }}
          onPress={() => this.locate(this.state.position)} >
          <Image source={locateicon} style={styles.icon} />
        </TouchableOpacity>
      </View>
    );
  }


}


CustomerScreen.propTypes = {
  provider: ProviderPropType,
};

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
    // width: 30,
    // height: 30,
    // borderRadius: 15,
    // backgroundColor: '#e6e6e6',
  },
  largeicon: {
    width: 50,
    height: 50
  },
  placebtn: {
    position: 'absolute',
    bottom: 30,
    left: 30,
  },
  // calloutSearch: {
  //   borderColor: "transparent",
  //   marginLeft: 10,
  //   width: "90%",
  //   marginRight: 10,
  //   height: 40,
  //   borderWidth: 0.0
  // },
});