import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Platform,
  TextInput,
  TouchableOpacity,
  TimePickerAndroid,
  Alert,
  ToastAndroid,
  Modal,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import locIcon from "../assets/region.png";
import { URL, PORT } from "../src/conf";
import timeIcon from "../assets/time.png";
import contentIcon from "../assets/content.png";
import TopBar from "../src/utils/TopBar";
import Cell from "../src/utils/Cell";
let ordertime;
let content;
let money;

export default class PlaceOrderScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user_text: "Please enter any additional information here ...",
      position: {
        latitude: 49.267941,
        longitude: -123.24736,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.02
      },
      orderTime: {
        hour: "00",
        minute: "00"
      },
      fee: "",
      showloader: false
    };
  }
 

  componentWillUnmount() {
    this.setState({
      showloader: false,
    });
  }
  
  componentDidMount() {
    this.setTimeContent();
  }
  setTimeContent = () => {
    this.setState({
      orderTime: ordertime,
      user_text: content,
      user_reward: money
    })
    // console.log(content)
    // console.log(this.state.user_text)
  }

  /* Update position set by user */
  setPosition = position => {
    this.setState({
      position: {
        latitude: position.latitude,
        longitude: position.longitude,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.002
      }
    });
  };

  /* place order handler */
  get_order_info = (fromLat, fromLng, toLat, toLng, locFrom, locTo, placeTime, fee) => {
    if (this.state.user_text === "") {
      Alert.alert("Invalid Order", "Please enter order Details!");
      return;
    }
    if (this.state.orderTime.hour === 0) {
      Alert.alert("Invalid Order", "Please enter a time!");
      return;
    }
    if (fromLat == 0 || toLat == 0) {
      Alert.alert("Invalid Order", "Please enter a valid place");
      return;
    }
    this.place_order(
      fromLat,
      fromLng,
      toLat,
      toLng,
      `${this.state.orderTime.hour}:${this.state.orderTime.minute}:00`,
      locFrom,
      locTo,
      placeTime,
      fee
    );
    console.log("placeTime:", placeTime);
  };

  /* place a order */
  place_order = (lat, lng, deslat, deslng, time, locFrom, locTo, placeTime, fee) => {
    this.setState({
      showloader: true
    });
    fetch(`${URL}:${PORT}/order/place`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        content: this.state.user_text,
        lat: lat,
        lng: lng,
        deslat: deslat,
        deslng: deslng,
        time: time,
        locFrom: locFrom,
        locTo: locTo,
        placeTime: placeTime,
        fee: fee,
        customerPhone: global.phoneNum
      })
    }).then(res => {
      res.json().then(result => {
        setTimeout(() => {
          this.setState({
            showloader: false
          });
          if (result.errno == 0) {
            // ToastAndroid.showWithGravityAndOffset(
            //   "Order Placed!",
            //   ToastAndroid.LONG,
            //   ToastAndroid.BOTTOM,
            //   25,
            //   50
            // );
            this.props.navigation.navigate("CustomerScreen");
          } else {
            Alert.alert("Failed to Place order", "Please try again");
          }
        }, 500);
      });
    });
  };

  /* Time picker */
  async pickTime() {
    //console.log(this.state.user_text)
    if(Platform.OS === 'android') {
      try {
        const { action, hour, minute } = await TimePickerAndroid.open({
          hour: parseFloat(this.state.orderTime.hour),
          minute: parseFloat(this.state.orderTime.minute),
          is24Hour: true, // Will display '14 PM'
          mode: "spinner"
        });
        if (action !== TimePickerAndroid.dismissedAction) {
          let setHour, setMin;
          if (hour <= 9) {
            setHour = `0${hour}`;
          } else {
            setHour = hour;
          }
          if (minute <= 9) {
            setMin = `0${minute}`;
          } else {
            setMin = minute;
          }
          // console.log(setHour);
          // console.log(setMin);
          this.setState({
            orderTime: {
              hour: setHour,
              minute: setMin
            }
          });
        }
      } catch ({ code, message }) {
        console.warn("Cannot open time picker", message);
      }
    } else {
      this.setState({
        orderTime: {
          hour: '12',
          minute: '00'
        }
      });
    }
    
  }
  
  getPlaceTime = () => {
    var today = new Date();
    var time = today.getFullYear()+"/"
              +(today.getMonth()+1)+"/"
              +today.getDate()+" "
              +today.getHours()+":"
              +today.getMinutes()
    return time;
  }

  //numeric only text input
  set_update = ()=>{
  }

  render() {
    const locFrom = this.props.navigation.getParam(
      "locFrom",
      "Please enter A Location"
    );
    const locTo = this.props.navigation.getParam(
      "locTo",
      "Please enter B Location"
    );

    const fromLat = this.props.navigation.getParam("fromLat", 0);
    const fromLng = this.props.navigation.getParam("fromLng", 0);
    const toLat = this.props.navigation.getParam("toLat", 0);
    const toLng = this.props.navigation.getParam("toLng", 0);
    content = this.props.navigation.getParam(
      "content",
      this.state.user_text
    );
    ordertime = this.props.navigation.getParam(
      "orderTime",
      this.state.orderTime
    );
    // money = this.props.navigation.getParam(
    //   "money",
    //   this.state.user_reward
    // );
    
    return (
      <View style={styles.container}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.showloader}
        >
          <View style={{ position: "absolute", top: "50%", right: 0, left: 0 }}>
            <ActivityIndicator size="large" color="red" />
          </View>
        </Modal>

        <TopBar
          // showback={false}
          onBackPress={() => {
            this.props.navigation.navigate("CustomerScreen");
          }}
        >
          Order Information
        </TopBar>
        <ScrollView>
        <Cell
          source={locIcon}
          title="From:"
          placeholder={locFrom}
          showarrow={true} //default: show right arrow
          onPress={() => {
            this.props.navigation.navigate("AddressScreen", {
              selection: "from",
              locFrom: locFrom,
              locTo: locTo,
              fromLat: fromLat,
              fromLng: fromLng,
              toLat: toLat,
              toLng: toLng,
              content: this.state.user_text,
              orderTime: this.state.orderTime,
              fee: this.state.fee
            });
          }}
        />

        {/* <Cell
          source={locIcon}
          title="From:"
          placeholder={locFrom}
          showarrow={true} //default: show right arrow
          onPress={} //Put the function you want to call here 
        /> */}

        <Cell
          source={locIcon}
          title="To:"
          placeholder={locTo}
          onPress={() => {
            this.props.navigation.navigate("AddressScreen", {
              selection: "to",
              locFrom: locFrom,
              locTo: locTo,
              fromLat: fromLat,
              fromLng: fromLng,
              toLat: toLat,
              toLng: toLng,
              content: this.state.user_text,
              orderTime: this.state.orderTime,
              fee: this.state.fee
            });
          }}
        />
        
        <View style={styles.locTo1}>
          <Image source={contentIcon} style={styles.icon} />
          <Text style={styles.shorttext}> Delivery Cost: </Text>
          <Text style={styles.longtext}>  $ </Text>
          <TextInput
            keyboardType={"decimal-pad"}
            placeholder="Your princess is in another castle"
            underlineColorAndroid={"transparent"}
            onChangeText={fee => this.setState({ fee })}
            style={{ flex:1,textAlign:"center",alignContent:"center" }}
          />
        </View>

        <View style={styles.locTo}>
          <Image source={timeIcon} style={styles.icon} />
          <Text onPress={() => this.pickTime()} style={styles.shorttext}>
            {" "}
             Pick a time:{" "}
          </Text>
          <TouchableOpacity
            style={styles.address}
            onPress={() => this.pickTime()}
          >
            <Text
              style={styles.placeholderText}
            >{`${this.state.orderTime.hour}:${this.state.orderTime.minute}`}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.txtInputContainer}>
          <View style={styles.titleContainer}>
            <Image source={contentIcon} style={styles.icon} />
            <Text style={styles.shorttext}> Order Details: </Text>
          </View>
          <TextInput
            placeholder="Please enter any additional information here"
            underlineColorAndroid={"transparent"}
            onChangeText={user_text => this.setState({ user_text })}
            style={{ marginVertical: 20 }}
          />
        </View>
        </ScrollView>
        <View style={styles.placeBtn}>
          <TouchableOpacity
            style={styles.placeTxtContainer}
            onPress={() => 
              this.get_order_info(
                fromLat,
                fromLng,
                toLat,
                toLng,
                locFrom,
                locTo,
                this.getPlaceTime(),
                this.state.fee
              )
            }
          >
            <Text style={styles.placeTxt}>PLACE!</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // justifyContent: "center",
    flexDirection: "column",
    padding: 0
  },
  locFrom: {
    marginTop: 20,
    width: "100%",
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: "flex-start",
    // borderBottomWidth: 1,
    borderColor: "#c7c7c7",
    height: 50,
    flexDirection: "row",
    marginBottom: 20
  },
  locTo: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "grey",
    height: 48,
    flexDirection: "row",
    //marginBottom: 20
  },
  locTo1: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "grey",
    height: 48,
    flexDirection: "row",
    alignContent:"space-between",
    //marginBottom: 20
  },
  txtInputContainer: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "grey",
    height: 200,
    flexDirection: "column"
  },
  titleContainer: {
    justifyContent: "flex-start",
    flexDirection: "row"
  },
  address: {
    borderRadius: 10,
    width: "80%",
    height: 200,
    marginVertical: 4
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginVertical: 10
  },
  shorttext: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
    marginVertical: 2.5
  },
  longtext: {
    fontSize: 15,
    //fontWeight: "bold",
    color: "black",
    marginVertical: 2.5,
  },
  placeholderText: {
    color: "grey",
    marginHorizontal: 10
  },
  placeOrder: {
    marginVertical: 20
  },
  icon: {
    width: 30,
    height: 30
  },
  placeBtn: {
    flex: 1,
    justifyContent: "flex-end",
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 60,
    height: 40,
    borderRadius: 5
  },
  placeTxtContainer: {
    backgroundColor: "red",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center"
  },
  placeTxt: {
    //   justifyContent: 'flex-end',
    fontSize: 20,
    fontWeight: "bold"
  }
});
