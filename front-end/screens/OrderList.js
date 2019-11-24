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

import OrderView from "../src/utils/OrderView";

import OrderDetail from './OrderDetail';

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
  
  _renderItem = ({ item }) => (
    <OrderView
      locFrom={item.locFrom}
      locTo={item.locTo}
      status={item.status}
      fee={item.fee}
      onPress={() => {
        this.props.navigation.navigate("OrderDetail", {
          locFrom: item.locFrom,
          locTo: item.locTo,
          status: item.status,
          id: item.id,
          detail: item.content,
          time: item.time,
          userid: item.userid,
          courierPhone: item.courierPhone,
          customerPhone: item.customerPhone,
          fee: item.fee,
          placeTime: item.placeTime,
          acceptTime: item.acceptTime,
          finishTime: item.finishTime
        });
      }}
    />
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
  }
});
