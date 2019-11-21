import React from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput } from "react-native";
import Expo from "expo";
import * as Facebook from "expo-facebook";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import "../global";
export default class LoginScreen extends React.Component {
    componentDidMount() {
        this.check_login();
    }
    state = {
        username: '',
        passward: '',
    }
    handelUserName = (text) => {
        this.setState({username: text});
    }
    handlePassword = (text) => {
        this.setState({passward: text});
    }

    login = (username, password, usermode) => {
        //How to verigy passwod and navigate to courier/customer screen
    }
    toSignUp = () => {
        this.props.navigation.navigate("SignupScreen");
    }
 
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
                  if(result.errno == -1){
                    alert(`Please Log in or Sign Up`);
                 }else{
                    if(result.data.usermode == "courier"){
                        this.props.navigation.navigate("OrderList");
                        }else if(result.data.usermode == "customer"){
                        this.props.navigation.navigate("CustomerScreen");
                        }
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
    
        //call function to return value
        if(type =="success"){
          const response = await fetch(
            `https://graph.facebook.com/me?access_token=${token}`);
    
           let id = (await response.json()).id;
           this.user_fbsignup(id,token,apptoken);
        }
      }catch ({ message }) {
            alert(`${message}`);
          }
      
       }
    
    
    user_fbsignup = (username, fbtoken,apptoken) => {
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



    render() {
        return (
            <View style = {styles.container}>
                <TextInput style = {styles.input}
                    underlineColorAndroid = "transparent"
                    placeholder = "User Name"
                    placeholderTextColor = "#9a73ef"
                    autoCapitalize = "none"
                    onChangeText = {this.handelUserName}/>
                
                <TextInput style = {styles.input}
                    underlineColorAndroid = "transparent"
                    placeholder = "Password"
                    placeholderTextColor = "#9a73ef"
                    autoCapitalize = "none"
                    onChangeText = {this.handlePassword}/>
                



                <TouchableOpacity
                    style = {styles.submitButton}
                    onPress = {
                    () => this.login(this.state.username, this.state.password, this.state.username)
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

                <TouchableOpacity
                    style = {styles.fbloginButton}
                    onPress = {
                    () => this.loginWithFb()
                    }>
                    <Text style = {styles.submitButtonText}> Login With Facebook </Text>
                </TouchableOpacity>
            </View>
        )
    }
    }


const styles = StyleSheet.create({
    container: {
        paddingTop: 23
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
     },
     submitButtonText:{
        color: 'white'
     }
})