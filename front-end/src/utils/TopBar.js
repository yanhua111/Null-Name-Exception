import React, { Component } from 'react';

import {
  View, Text, TouchableOpacity, Image
} from 'react-native';
import backicon from '../../assets/back.png';

export default class TopBar extends Component {
  render = (  ) => {
    return (
      <View style={{
        alignSelf: 'flex-start',
        justifyContent: 'center',
        // alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'white',
        width: '100%',
        height: 80,
        borderColor: 'grey',
        borderBottomWidth: 1,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: 'black',
        shadowOpacity: 1.0,
        elevation: 10,
      }}>
        <TouchableOpacity style={{
          position: 'absolute',
          left: 20,
          top: 40,
        }}
        onPress={this.props.onBackPress} >
        { this.props.showback && <Image source={backicon} style={ { width: 30, height: 30 }} />}
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
          marginTop: 40
        }}>{this.props.children}</Text>
      </View>
    );
  }
  static defaultProps = {
    showback: true
  };
}

