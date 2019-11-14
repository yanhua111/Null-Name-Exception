import React, { Component } from 'react';

import {
  View, Text, TouchableOpacity, Image
} from 'react-native';
import backicon from '../../assets/back.png';

export default class TopBar extends Component {
  render = (  ) => {
    return (
      <View style={{
        position: 'absolute',
        backgroundColor: 'white',
        marginBottom: 20,
        width: '100%',
        height: 80,
        borderColor: 'grey',
        borderBottomWidth: 1,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: 'black',
        shadowOpacity: 1.0,
        elevation: 10,
        alignItems: 'center'
      }}>
        <TouchableOpacity style={{
          position: 'absolute',
          top: 40,
          left: 10
        }}
        onPress={this.props.onBackPress} >
          <Image source={backicon} style={ { width: 30, height: 30 }} />
        </TouchableOpacity>
        <TouchableOpacity style={{
          position: 'absolute',
          top: 40,
          right: 20
        }}
        onPress={this.props.onIconPress} >
          <Image source={this.props.source} style={{ width: 30, height: 30 }} />
        </TouchableOpacity>
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: 'black',
          marginVertical: 40
        }}>{this.props.children}</Text>
      </View>
    );
  }
}
