import React, { Component } from "react";

import { View, Text, TouchableOpacity, Image } from "react-native";
import righticon from "../../assets/arrow_right.png";

export default class Cell extends Component {
  render = () => {
    return (
      <View
        style={{
          width: "100%",
            paddingHorizontal: 10,
        //   paddingVertical: 10,
          justifyContent: "flex-start",
          alignItems: "center",
          borderBottomWidth: 1,
          borderColor: "#c7c7c7",
          height: 50,
          flexDirection: "row"
        }}
      >
        <TouchableOpacity
          style={{
            width: "100%",
            flexDirection: "row"
          }}
          onPress={this.props.onPress}
        >
          <Image
            source={this.props.source}
            style={{
              width: 30,
              height: 30
            }}
          />
          <View
            style={{
              justifyContent: "center"
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                color: "black"
              }}
            >
              {" "}
              {this.props.title}{" "}
            </Text>
          </View>

          <View style={{
              justifyContent: 'center',
              flexShrink: 1,
          }}>
          <Text
            style={{
              color: "grey",
              marginHorizontal: 10,
              
            }}
          >
            {this.props.placeholder}
          </Text>
          </View>

          <View
            style={{
              flex: 1,
              alignItems: "flex-end"
            }}
          >
            {this.props.showarrow && (
              <Image
                source={righticon}
                style={{
                  width: 30,
                  height: 30
                }}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  static defaultProps = {
    showarrow: true
  };
}
