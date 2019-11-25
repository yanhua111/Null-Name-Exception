/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
import React, { Component } from 'react';

import { View, ActivityIndicator, Modal } from 'react-native';

export default class CustomLoading extends Component {
  render = () => {
    return (
      <View style={this.props.style}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.props.visible}
        >
          <View style={{ position: 'absolute', top: '50%', right: 0, left: 0 }}>
            <ActivityIndicator size="large" color="red" />
          </View>
        </Modal>
      </View>
    );
  };
}
