import React, { Component, useState } from "react";
import { StyleSheet, Animated, TouchableOpacity, Text, View, Image } from "react-native";

import courier from "./assets/runningman.png";
import customer from "./assets/standperson.png";


const FadeInView = (props) => {
  const [fadeAnim] = useState(new Animated.Value(0));  // Initial value for opacity: 0


  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(
            fadeAnim,
            {
              toValue: 0.7,
              isInteraction: false,
              duration: 1000,
            }),
        Animated.timing(
          fadeAnim,
          {
            toValue: 0,
            isInteraction: false,
            duration: 1000,
          })
      ]),
      {
        iterations: 9999
      }
    ).start();
  }, []);


  return (
    <Animated.View                 // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim,         // Bind opacity to animated value
      }}
    >
      {props.children}
    </Animated.View>
  );
};

export default class OpenPage extends Component {

  pressLeft = () => {
    console.log("Pressed left");
  }

  pressRight = () => {
    console.log("Pressed right");
  }



  render() {
    return (
      <View style={{flex: 1, flexDirection: "row", alignSelf: "stretch" }}>
        <TouchableOpacity style={{flex:1, flexDirection: "column", backgroundColor: "powderblue", justifyContent:"center", alignItems: "center"}} onPress={() => this.pressLeft()} >
            
            <Image source={customer} style= {styles.pic2} />
            <Text style = {styles.text}> I want to order! </Text>
            <FadeInView style={styles.myButton2} />
        </TouchableOpacity>

        <TouchableOpacity style={{flex:1, flexDirection: "column", backgroundColor: "skyblue", justifyContent:"center", alignItems: "center"}} onPress={() => this.pressRight()} > 
            
            <Image source={courier} style={styles.pic} />
            <Text style = {styles.text}> Let me be the courier! </Text>
            <FadeInView style={styles.myButton} />
        </TouchableOpacity>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  myButton:{
    position: "absolute",
    bottom: 200,
    right: "40%",
    flex :1,
    alignSelf: "center",
    padding: 5,
    height: 30,
    width: 30, 
    borderRadius:60,  
    backgroundColor:"white",

  },
  myButton2:{
    position: "absolute",
    bottom: 200,
    right: "40%",
    flex :1,
    alignSelf: "center",
    padding: 5,
    height: 30,
    width: 30,  
    borderRadius:60, 
    backgroundColor:"white",
  },
  pic: {
    width: 200,
    height: 200
  },
  pic2: {
    width: 100,
    height: 200
  },
  text:{
    textAlign: "center",
    marginTop: 50,
    fontSize: 20,
    fontFamily: "Roboto",
    color : "white",
    fontWeight: "bold"
  }
});