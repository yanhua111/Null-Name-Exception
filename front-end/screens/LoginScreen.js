import React from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput, Image } from "react-native";
import Expo from "expo";
import * as Facebook from "expo-facebook";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import "../global";

import logo from "../assets/logo.png";
import fbicon from "../assets/facebook.png";
import { URL, PORT} from "../src/conf";

export default class LoginScreen extends React.Component {
    componentDidMount() {
        this.check_login();
    }
    state = {
        username: '',
        password: '',
    }
    handelUserName = (text) => {
        this.setState({username: text});
    }
    handlePassword = (text) => {
        this.setState({password: text});
    }
   

    toSignUp = () => {
        console.log("please sign up");
        this.props.navigation.navigate("SignupScreen");
    }
 
    check_login = () => {
        fetch(`${URL}:${PORT}/users/check`, {
                method: "GET",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                credentials: "include",
              }).then( (response) => {
                response.json().then((result) => {
                  if(result.errno == -1){
                    alert(`Please Log in or Sign Up`);
                 }else{
                     console.log(result.message);
                     console.log("usermode:", result.data.usermode);
                    if(result.data.usermode == "courier"){
                        global.userid = result.data.userid;
                        global.role = "courier";
                        this.props.navigation.navigate("OrderList");
                        }else if(result.data.usermode == "customer"){
                        global.userid = result.data.userid;
                        global.role = "customer";
                        this.props.navigation.navigate("CustomerScreen");
                        }
                        console.log(result);
                        global.username = result.data.username;
                        global.phoneNum = result.data.phonenum; 
                 }
                 
                });
              } 
              ).catch((error) => console.log(error));
      }


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
        if(type =="success"){
          const response = await fetch(
            `https://graph.facebook.com/me?access_token=${token}`);
    
           let result = (await response.json());
           let username = result.name;
           let fbid = result.id;
           this.log_in(username,-1,fbid,token,apptoken,"facebook");//login_mode = facebook(try facebook login) password = -1
        }
      }catch ({ message }) {
            alert(`${message}`);
          }
       }

   
    
    log_in(username,password,fbid,fbtoken,apptoken,login_mode){
        if(username == '' || password == ''){
            alert('Please enter User Name and Password');
        }else{
        fetch(`${URL}:${PORT}/users/login`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                username: username,
                password: password,
                fbtoken : fbtoken, 
                fbid    : fbid,
            }),
            }).then((response) => {
                response.json().then((result) => {
                  if(result.errno == -1){
                      if(login_mode == "facebook"){
                          console.log("enter facebook signup");
                        this.props.navigation.navigate("phonemodeScreen", {
                            username: username,
                            apptoken: apptoken,
                            fbtoken: fbtoken,
                            fbid: fbid,
                          });
                      }else if(login_mode == "manual"){
                        alert(result.message);
                      } 
                 }else{
                    console.log("enter else")
                    console.log(result.data.username);
                    if(login_mode == "facebook"){
                        global.username = result.data.username;
                    }else{
                        global.username = username;
                    }
                    global.userid   = result.data.userid;
                    global.phoneNum = result.data.phonenum;
                    if(result.data.usermode == "courier"){
                        global.role = result.data.usermode;
                        this.props.navigation.navigate("OrderList");
                    }else if(result.data.usermode == "customer"){
                        global.role = result.data.usermode;
                        this.props.navigation.navigate("CustomerScreen");
                    }
                 }
                });
              } 
              ).catch((error) => console.log(error));
            }
    }


    render() {
        return (
            <View style = {styles.container}>
            <Image source={logo} style={styles.icon} />
                <TextInput style = {styles.input}
                    underlineColorAndroid = "transparent"
                    placeholder = "  User Name"
                    placeholderTextColor = "#9a73ef"
                    autoCapitalize = "none"
                    onChangeText = {this.handelUserName}/>
                
                <TextInput secureTextEntry={true} style = {styles.input}
                    underlineColorAndroid = "transparent"
                    placeholder = "  Password"
                    placeholderTextColor = "#9a73ef"
                    autoCapitalize = "none"
                    onChangeText = {this.handlePassword}/>

                <TouchableOpacity
                    style = {styles.submitButton}
                    onPress = {  
                    () => this.log_in(this.state.username, this.state.password,-1,-1,-1,"manual")//fbid,fbtoken,apptoken,login_mode
                    }>
                    <Text style = {styles.submitButtonText}> Log In </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style = {styles.submitButton}
                    onPress = {
                    () => this.toSignUp()
                    }>
                    <Text style = {styles.submitButtonText}> Sign Up </Text>
                </TouchableOpacity>
                <Text style = {styles.option}>or login with</Text>
                <TouchableOpacity
                    style = {styles.fbButtom}
                    onPress = {
                    () => this.loginWithFb()
                    }>
                    <Image source={fbicon} style={styles.fbicon}/>
                </TouchableOpacity>
            </View>
        )
    }
    }


const styles = StyleSheet.create({
    container: {
        paddingTop: 100
    },
    input: {
        margin: 15,
        height: 40,
        borderColor: '#7a42f4',
        borderWidth: 1
     },
     submitButton: {
        backgroundColor: '#7a42f4',
        padding: 10,
        margin: 15,
        height: 40,
        borderRadius: 20
     },
     submitButtonText:{
        color: 'white',
        textAlign: 'center',
     },
     icon: {
        width: 100,
        height: 100,
        left: 140,
        marginBottom: 50
    },
    option:{
        color: 'grey',
        textAlign: 'center'
    },
    fbicon: {
        width: 49,
        height: 50,
    },
    fbButtom: {
        marginTop: 10,
        marginLeft: 160,
        width: 90,
        height: 70,
    }
})