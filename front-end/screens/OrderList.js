import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  Text,
  View,
  Button,
  Alert,
  Image,
  TouchableOpacity
} from "react-native";
import "../global";
import { URL, PORT } from "../src/conf";
import TopBar from "../src/utils/TopBar";
import profilepic from "../assets/courier.png";
import despic from "../assets/destination.png";
import originpic from "../assets/origin.png";
import OrderView from "../src/utils/OrderView";
import dotpic from "../assets/dot.png";
import righticon from "../assets/arrow_right.png";

export default class OrderList extends React.Component {
  state = {
    refreshing: false,
    myArray: [],
    location: {
      latitude: -1,
      longitude: -1
    }
  };

  componentDidMount() {
    this.list_order();
  }

  return_order = () => {
    return this.myArray;
  };


  /* This function list_order is triggered by button of each order.
  Every small order is a button, when pressed, it will give us the 
  detailed information. This function help us to get all the information
  from back end database
  */
  list_order = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      let location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      fetch(`${URL}:${PORT}/order/list?curlat=${location.latitude}&curlng=${location.longitude}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        credentials: "include"
      })
        .then(res => {
          res.json().then(result => {
            for (j = 0; j < result.data.list.length; j++) {
              var joined = this.state.myArray.concat(result.data.list[j]);
              this.setState({ myArray: joined });
            }
          });
        })
        .catch(error => console.log("List order error", error));
    })
  };

  onClearArray = () => {
    this.setState({ myArray: [] });
  };

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.onClearArray();
    this.list_order();
    this.setState({ refreshing: false });
  };

  _onEndReached = () => {
    // this.state.reachedEnd =  true;
    this.setState({ reachedEnd: true });
    // this.forceUpdate();
  };

  renderButtons = () => {
    const buttons = [];
    for (let i = 0; i < global.ls_length; i++) {
      buttons.push(
        <Button
          onPress={() => {
            this.list_order(i);
          }}
          title={`order ${i}`}
          key={i}
        ></Button>
      );
    }
    return buttons;
  };

  accept_order = order_id => {
    if (this.state.myArray[order_id].status == 1) {
      Alert.alert("This order is already accepted");
    } else {
      fetch(`${URL}:${PORT}/order/accept`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          orderid: order_id //????????????
        })
      });
      Alert.alert("successfully accepted");
    }
  };

  get_user_token = userid => {
    return fetch(`${URL}:${PORT}/users/get_token`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        //userid: global.user_id_ls,
        userid: userid
      })
    })
      .then(res => {
        res.json().then(result => {
          global.apptoken = result.data.apptoken;
          this.forceUpdate();
        });
      })
      .catch(error => console.log("Get User token error: ", error));
  };

  finish_order = (order_id, userid) => {
    this.get_user_token(userid).then(
      fetch(`${URL}:${PORT}/order/finish`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          orderid: order_id
        })
      }).then(res => {
        fetch(`${URL}:${PORT}/push`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            token: global.apptoken,
            message: "finished"
          })
        });
      })
    );
  };

  _renderItem = ({ item }) => (
    <OrderView
      profilepic={profilepic}
      originpic={originpic}
      locFrom={item.locFrom}
      dotpic={dotpic}
      despic={despic}
      locTo={item.locTo}
      status={item.status}
      righticon={righticon}
      id={item.id}
      detail={item.content}
    />

    // {/* <View >
    //   <Button
    //     title={`order ${item.id} accept above order`}
    //     onPress={() => this.accept_order(item.id)}
    //   ></Button>
    // </View>
    // <View >
    //   <Button
    //     title={"Finish this order"}
    //     onPress={() => this.finish_order(item.id, item.userid)}
    //   ></Button>
    // </View> */}
    // </View>
  );

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <TopBar showback={false}>My Order</TopBar>
        </View>
        <FlatList
          // style={{ marginTop: 100 }}
          data={this.state.myArray}
          extraData={this.state}
          onRefresh={() => this.onRefresh()}
          refreshing={this.state.refreshing}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    flexDirection: "column"
  },
  order: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    borderColor: "grey",
    height: 200,
    flexDirection: "row",
    marginBottom: 20,
    elevation: 10,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "black",
    shadowOpacity: 1.0,
    borderBottomWidth: 1,
    justifyContent: "flex-start"
  },
  locContainer: {
    flexDirection: "column",
    marginTop: 20,
    justifyContent: "space-around"
  },
  locLine: {
    flexDirection: "row",
    width: 200,
    marginVertical: 2,
    flexShrink: 1
  },
  dotpic: {
    width: 20,
    height: 30
  },
  smallpic: {
    width: 20,
    height: 20,
    marginRight: 2
  },
  largepic: {
    width: 50,
    height: 50,
    marginTop: 100
  },
  optionContainer: {
    flex: 1,
    height: 30,
    alignItems: "flex-end",
    flexDirection: "column"
  },
  profilepic: {
    width: 50,
    height: 50,
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: "grey",
    marginRight: 10
  }
});
