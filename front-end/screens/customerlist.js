/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  View,
  Button
} from 'react-native';
import '../global';
import { URL, PORT } from '../src/conf';
import TopBar from '../src/utils/TopBar';
import profilepic from '../assets/courier.png';
import despic from '../assets/destination.png';
import originpic from '../assets/origin.png';
import OrderView from '../src/utils/OrderView';
import dotpic from '../assets/dot.png';
import righticon from '../assets/arrow_right.png';
import cart from '../assets/cart_empty.png';

export default class CustomerList extends React.Component {
  state = {
    refreshing: false,
    myArray: [],
    location: {
      latitude: -1,
      longitude: -1
    }
  };

  componentDidMount () {
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
      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      fetch(`${URL}:${PORT}/order/list_customer`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
        .then(res => {
          res.json().then(result => {
            let j;
            for (j = 0; j < result.data.list.length; j++) {
              var joined = this.state.myArray.concat(result.data.list[j]);
              this.setState({ myArray: joined });
            }
          });
        }).catch(error => console.log(error));
    });
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

  _renderItem = ({ item }) => (

    <OrderView
      profilepic = {profilepic}
      originpic = {originpic}
      locFrom = {item.locFrom}
      dotpic = {dotpic}
      despic = {despic}
      locTo = {item.locTo}
      status = {item.status}
      righticon = {righticon}
      fee = {item.fee}
      id={item.id}
      detail={item.content}
      onPress={() => {
        this.props.navigation.navigate('OrderDetail', {
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

  render () {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <TopBar showback={false}
            onIconPress = {() => { this.props.navigation.navigate('HistoryOrder'); }}
            source = {cart}>My Order</TopBar>
        </View>
        <FlatList
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
    flexDirection: 'column'
  }
});
