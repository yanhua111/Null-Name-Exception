import React, { Component } from "react";

import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Linking, Platform} from "react-native";
import StatusView from "./StatusView";
import despic from "../../assets/destination.png";
import originpic from "../../assets/origin.png";
import dotpic from "../../assets/dot.png";
import righticon from "../../assets/arrow_right.png";
import phone from "../../assets/phone.png";

export default class OrderView extends Component {
  dialCall = (number) => {
    let phoneNumber = '';
    if (Platform.OS === 'android') { phoneNumber = `tel:${number}`; }
    else {phoneNumber = `telprompt:${number}`; }
    Linking.openURL(phoneNumber);
  }

  render = () => {
    return (
      <View
        style={[styles.order, this.props.rich ? styles.rich : styles.simple]}
      >
        <View style={[styles.locContainer, this.props.richlocContainer ? styles.rich : styles.simplelocContainer]}>
          {this.props.rich && 
            <Text style={{ color: "grey" }}>
              <Text>Order number  </Text>
              <Text style={{ color: "black", marginHorizontal: 20 }}>
                {this.props.id}{"\n"}
              </Text>
              <Text>
                Placed at   </Text>
              <Text style={{ color: "black", marginHorizontal: 20 }}>
                12.40{"\n"} 
              </Text>
              <Text>Preferred Delivery Time:  </Text>
              <Text style={{ color: "black", marginHorizontal: 20 }}>
                {this.props.time}
              </Text>
            </Text>
          }
          <View style={styles.locLine}>
            <Image style={styles.smallpic} source={originpic} />
            <Text>{this.props.locFrom}</Text>
          </View>
          <Image style={styles.dotpic} source={dotpic} />
          <View style={styles.locLine}>
            <Image style={styles.smallpic} source={despic} />
            <Text>{this.props.locTo}</Text>
          </View>

          {this.props.rich && <View style = {styles.orderdetail}>
            <Text style = {{fontWeight: 'bold'}}>Order Details:</Text>
            <Text>{this.props.detail}</Text>
          </View>}
        </View>

        <View style={styles.optionContainer}>
          <StatusView style={styles.statusview} status={this.props.status} />
          {!this.props.rich && (
            <TouchableOpacity
            onPress={this.props.onPress}>
              <Image
                style={styles.largepic}
                source={righticon}
              ></Image>
            </TouchableOpacity>
          )}
          {this.props.rich &&(
            <TouchableOpacity
            style={{
            height: 50,
            width: 50,
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 5,
            marginTop: 180
            }}
            onPress={()=>{this.dialCall(parseInt(this.props.phonenum),10)}}>
              <Image
                style={{height:50,width:50}}
                source={phone}
              />
          </TouchableOpacity>
          )}
        </View>

      </View>
    );
  };
  static defaultProps = {
    rich: false
  };
}

const styles = StyleSheet.create({
  order: {
    alignSelf: "center",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    borderColor: "grey",
    flexDirection: "row",
    marginBottom: 20,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "black",
    shadowOpacity: 1.0,
    borderBottomWidth: 1,
    justifyContent: "flex-start"
  },
  rich: {
    width: "100%",
    height: 300,
  },
  simple: {
    width: "90%",
    height: 200,
    elevation: 10
  },
  locContainer: {
    flexDirection: "column",
    justifyContent: "space-around"
  },
  richlocContainer: {
    marginTop: 20,
  },
  simplelocContainer: {
    marginTop: 20
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
  orderdetail: {
    borderTopColor: 'grey',
    width: 250,
    flexShrink: 1
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
