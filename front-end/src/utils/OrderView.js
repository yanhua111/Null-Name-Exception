import React, { Component } from "react";

import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import StatusView from "./StatusView";

export default class OrderView extends Component {
  render = () => {
    return (
      <View style={styles.order}>
        <Image source={this.props.profilepic} style={styles.profilepic} />
        <View style={styles.locContainer}>
          <View style={styles.locLine}>
            <Image style={styles.smallpic} source={this.props.originpic} />
            <Text style={styles.text}>{this.props.locFrom}</Text>
          </View>
          <Image style={styles.dotpic} source={this.props.dotpic} />
          <View style={styles.locLine}>
            <Image style={styles.smallpic} source={this.props.despic} />
            <Text style={styles.text}>{this.props.locTo}</Text>
          </View>
        </View>
        <View style={styles.optionContainer}>
          <StatusView style={styles.statusview} status={this.props.status} />
          <TouchableOpacity>
            <Image
              style={styles.largepic}
              source={this.props.righticon}
            ></Image>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
}
const styles = StyleSheet.create({
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
  statusview: {},
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
