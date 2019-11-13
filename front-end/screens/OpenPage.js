import React, { Component, useState } from "react";
import { StyleSheet, Animated, TouchableOpacity, Text, View, Image } from "react-native";
import * as Facebook from "expo-facebook";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import courier from "../assets/runningman.png";
import customer from "../assets/standperson.png";



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

  
  componentDidMount() {
    this.check_login();
  }

/*check if user have loged in before, if true we skip the facebook login screen
*/ 

check_login = () => {
    fetch("http://ec2-99-79-78-181.ca-central-1.compute.amazonaws.com:3000/users/check", {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            credentials: "include",
          }).then((response) => {
            response.json().then((result) => {
              if(result.errno == 1){
                alert(`Please Choose Your Role and Sign In with Facebook`);
             }else{
                if(result.data.usermode == "courier"){
                    this.props.navigation.navigate("CourierScreen");
                    }else if(result.data.usermode == "customer"){
                    this.props.navigation.navigate("CustomerScreen");
                    }
               
             }
            });
            
          } 
          ).catch((error) => console.log(error));
  }


  /**face book log in function, call face book API to log in 
   * send backend with token and user name/ID
   * 
   */
  async loginWithFb(){
    try {
    //face book login    
    const{type,token} = await Facebook.logInWithReadPermissionsAsync
    ("520578628732460", {permissions: ["public_profile"]});  
     // push notification token permission
    const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        return;
      }
      let apptoken = await Notifications.getExpoPushTokenAsync();

    //call function to return value
    if(type =="success"){
      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}`);

       let id = (await response.json()).id;
       this.user_signup(id,token,apptoken);
    }
  }catch ({ message }) {
        alert(`${message}`);
      }
  
   }


   user_signup = (username, fbtoken,apptoken) => {
    fetch("http://ec2-99-79-78-181.ca-central-1.compute.amazonaws.com:3000/users/login", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              username: username,
              fbtoken: fbtoken,
              apptoken: apptoken,
              usermode: global.role
            }),
          });
  }

  /*left means he/she wants to be courier, set 0 for courier*/
  pressLeft = () => {
    console.log("Pressed left");
    global.role = "courier";
    this.loginWithFb();
    this.props.navigation.navigate("CourierScreen");
    
    
  }

   /*left means he/she wants to be customer,set 1 for customer */
  pressRight = () => {
    console.log("Pressed right");
    global.role = "customer";
    this.loginWithFb();
    this.props.navigation.navigate("CustomerScreen");
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
    //fontFamily: "Times",
    color : "white",
    fontWeight: "bold"
  },
  lottie: {
    width: 100,
    height: 100
  }
});