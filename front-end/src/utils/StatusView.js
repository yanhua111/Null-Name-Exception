import React, { Component } from "react";

import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

export default class StatusView extends Component {
  render = () => {
    return (
      <View style={this.props.style}>
        <View
          style={[styles.common, this.props.status ? styles.available : styles.accepted]}
        >
          <Text
          style = {[styles.commontext, this.props.status ? styles.availabletxt : styles.acceptedtxt]}
          >{this.props.status ? "Available" : "accepted"}</Text>
        </View>
      </View>
    );
  };
}
const styles = StyleSheet.create({
  common: {
    flex: 1,
    width: 70,
    paddingHorizontal: 5,
    paddingVertical: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderColor: "#c7c7c7",
    height: 50,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 5
  },
  available: {
  //  color: 'blue',
  borderColor: "blue",
  },
  accepted: {
    // color: 'green',
    borderColor: "green",
  },
  commontext: {

  },
  availabletxt: {
    color: 'blue'
  },
  acceptedtxt: {
    color: 'green'
  }
});
