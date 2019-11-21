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
  RefreshControl,
  TouchableOpacity
} from "react-native";
import "../global";
import { URL, PORT } from "../src/conf";
import TopBar from "../src/utils/TopBar";
import profilepic from "../assets/courier.png";
import despic from "../assets/destination.png";
import originpic from "../assets/origin.png";

export default class OrderList extends React.Component {
  state = {
    refreshing: false,
    myArray: []
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
    fetch(`${URL}:${PORT}/order/list`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
      .then(res => {
        res.json().then(result => {
          console.log(result);
          for (j = 0; j < result.data.list.length; j++) {
            var joined = this.state.myArray.concat(result.data.list[j]);
            this.setState({ myArray: joined });
          }
          console.log(this.state.myArray);
        });
      })
      .catch(error => console.log(error));
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
    console.log("on end reached");
    this.setState({ reachedEnd: true });
    console.log(this.state.reachedEnd);
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

  accept_order = (order_id,curlat,curlng) => { //这里需要current longtitude 和latitude
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
          orderid: order_id,//????????????
          curlat: curlat,
          curlng: curlng,
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
      .catch(error => console.log(error));
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
    <View style={styles.order}>
      <Image source={profilepic} style={styles.profilepic} />
      <View style={styles.locContainer}>
        <View style={styles.locLine}>
          <Image style={styles.smallpic} source={originpic} />
          <Text>
            {item.locFrom}
          </Text>
        </View>
        <View style={styles.locLine}>
          <Image style={styles.smallpic} source={despic} />
          <Text>
            {item.locTo}
          </Text>
        </View>
      </View>
      {item.status === 1 ? (
        <Text > placed</Text>
      ) :  (
        <Text > accepted</Text>
      )}
      {/* {item.status === 1 ? (
        <Text >content={item.content}| placed</Text>
      ) : item.status === 0 ? (
        <Text >content={item.content}| accepted</Text>
      ) : (
        <Text >content={item.content} | finished</Text>
      )} */}
      {/* <View >
        <Button
          title={`order ${item.id} accept above order`}
          onPress={() => this.accept_order(item.id)}
        ></Button>
      </View>
      <View >
        <Button
          title={"Finish this order"}
          onPress={() => this.finish_order(item.id, item.userid)}
        ></Button>
      </View> */}
    </View>
  );

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <TopBar showback={false}>My Order</TopBar>
        </View>
        <FlatList
          style={{marginTop: 100}}
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
    alignSelf:'center',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 5,
    borderColor: "grey",
    height: 100,
    flexDirection: "row",
    marginBottom: 20,
    elevation: 10,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: 'black',
    shadowOpacity: 1.0,
    borderBottomWidth:1,
  },
  locContainer: {
    flexDirection: 'column'
  },
  locLine: {
    flexDirection: 'row'
  },
  smallpic:{
    width: 20,
    height: 20
  },
  profilepic:{
    width: 50,
    height: 50,
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: "white",
    elevation: 10,
    borderColor: 'grey',
    marginRight: 10
  }
});
