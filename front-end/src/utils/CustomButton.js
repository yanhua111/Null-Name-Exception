/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
import React, { Component } from 'react';

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default class CustomButton extends Component {
  render = () => {
    return (
      <View style={styles.placeBtn}>
        <TouchableOpacity
          style={[styles.placeTxtContainer, this.props.style]}
          onPress={this.props.onPress}
        >
          <Text style={[styles.placeTxt, this.props.whitefont ? styles.whitefont : {}]}>{this.props.content}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  static defaultProps = {
    whitefont: false
  };
}
const styles = StyleSheet.create({
  placeBtn: {
    // flex: 1,
    marginVertical: 40,
    justifyContent: 'flex-end',
    flexDirection: 'column',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 0,
    height: 40,
    borderRadius: 5
  },
  placeTxtContainer: {
    // backgroundColor: "red",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center'
  },
  placeTxt: {
    //   justifyContent: 'flex-end',
    fontSize: 20,
    fontWeight: 'bold'
  },
  whitefont: {
    color: 'white'
  }
});
