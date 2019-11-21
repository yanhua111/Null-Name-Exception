import React, { Component } from "react";

import { View, Text, StyleSheet, TextInput } from "react-native";

export default class CustomInput extends Component {
  render = () => {
    return (
      <View style={styles.textInputContainer}>
        <Text style={styles.text}>
            {this.props.title}
        </Text>
        <TextInput
          style={styles.textInput}
          onChangeText = {this.props.onChangeText}
          value = {this.props.value}
        />
      </View>
    );
  };
}
const styles = StyleSheet.create({
    textInputContainer: {
        borderColor: 'grey',
        borderRadius: 5,
        width: '80%',
        backgroundColor: '#dfe6e0',
        marginVertical: 10,
        paddingHorizontal: 5,
        alignSelf: 'center',
        color: 'black',
        flexShrink: 1
      },
      text: {
          color: 'grey',
          marginTop: 10,
          marginHorizontal: 10
      },
      textInput: {
        marginHorizontal: 10,
        height: 38,
        color: 'black',
        fontSize: 16
      },
});
