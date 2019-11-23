import React from "react";
import {
  StyleSheet,

  View,
  Alert,
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
import CustomButton from "../src/utils/CustomButton";

export default class OrderDetail extends React.Component {
  /* This function list_order is triggered by button of each order.
  Every small order is a button, when pressed, it will give us the 
  detailed information. This function help us to get all the information
  from back end database
  */

  accept_order = (order_id) => {
      fetch(`${URL}:${PORT}/order/accept`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          orderid: order_id,
          
        })
      });
      Alert.alert("successfully accepted");
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

  render() {
    const locFrom = this.props.navigation.getParam("locFrom", "");
    const locTo = this.props.navigation.getParam("locTo", "");
    var status = this.props.navigation.getParam("status", "");
    const id = this.props.navigation.getParam("id", "");
    const detail = this.props.navigation.getParam("detail", "");
    const time = this.props.navigation.getParam("locFrom", "");
    return (

      <View style={styles.container}>
        <TopBar
        onBackPress = {() => this.props.navigation.navigate("OrderList")}
        >
          Order Detail
        </TopBar>
        <OrderView
          profilepic={profilepic}
          originpic={originpic}
          locFrom={locFrom}
          dotpic={dotpic}
          despic={despic}
          locTo={locTo}
          status={status}
          righticon={righticon}
          id={id}
          detail={detail}
          time={time}
          rich = {true}
        />
        <CustomButton 
        content = "Accept"
        style={{backgroundColor: "red"}}
        onPress={() => this.accept_order(id)}
        />
        { !status && <CustomButton
        content = "Finish"
        style = {{backgroundColor: "#f55442"}}
        />}

        <CustomButton 
        content = "Cancel"
        style={{backgroundColor: "blue"}}
        whitefont = {true}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    flexDirection: 'column'
  }
});
