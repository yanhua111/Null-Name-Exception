import React from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput,Picker, Image } from "react-native";
import * as Facebook from "expo-facebook";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import fbicon from "../assets/facebook.png";
import backicon from "../assets/back.png";

export default class SignupScreen extends React.Component {

        state = {
            username: "",
            passward: "",
            phonenum: "",
            usermode: "courier",
        };

    handelUserName = (text) => {
        this.setState({username: text});
    }
    handlePassword = (text) => {
        this.setState({passward: text});
    }
    handelPhonenum = (text) => {
        this.setState({phonenum: text});
    }
    handelUsermode = (text) => {
        this.setState({usermode: text});
    }

    async userSignupComb (username, password, phonenum, usermode)  {
        let apptoken = await Notifications.getExpoPushTokenAsync();
        this.user_signup(username, password, phonenum, usermode, apptoken);
    }

    user_signup = (username, password, phonenum, usermode, apptoken) => {
        if(username == "" || password == "" || phonenum == ""){
            alert("Please make you you have enter all fields");
        } else{
        fetch("http://ec2-99-79-78-181.ca-central-1.compute.amazonaws.com:3000/users/signup", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                username: username,
                password: password,
                phonenum: phonenum,
                usermode: usermode,
                fbtoken: -1,
                apptoken: apptoken,
            }),
        }).then((response) => {
            response.json().then((result) => {
                if(result.errno == -1){
                    alert("Please choose a new username, this one is used by others");
                }else{
                    if(usermode == "courier"){
                    global.username = result.data.username;
                    global.phoneNum = phonenum;
                    global.role = "courier";
                    global.userid = result.data.userid;
                    this.props.navigation.navigate("OrderList");
                    } else {
                    global.role = "customer";
                    global.username = result.data.username;
                    global.phoneNum = phonenum;
                    global.userid = result.data.userid;
                    this.props.navigation.navigate("CustomerScreen");
                    }
                }
            }
        )}) 
        }
    }



    // fbsignupComb = () => {
    //     this.loginWithFb();
    //     this.props.navigation.navigate("phonemodeScreen");
    // }
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
    
           let username = (await response.json()).name;
           //this.user_fbsignup(id,token,apptoken);
           this.props.navigation.navigate("phonemodeScreen", {
            username: username,
            apptoken: apptoken,
            fbtoken: token,
        });
        }
      }catch ({ message }) {
            alert(`${message}`);
          }
    }
    
    
    // user_fbsignup = (username, fbtoken,apptoken) => {
    // fetch("http://ec2-99-79-78-181.ca-central-1.compute.amazonaws.com:3000/users/login", {
    //         method: "POST",
    //         headers: {
    //             Accept: "application/json",
    //             "Content-Type": "application/json",
    //         },
    //         credentials: "include",
    //         body: JSON.stringify({
    //             username: username,
    //             fbtoken: fbtoken,
    //             apptoken: apptoken,
    //         }),
    //         });
    // }
    


    render() {
        return (
            <View style = {styles.container}>
                <TouchableOpacity style={styles.backbtn}
                    onPress={() => { this.props.navigation.navigate("LoginScreen"); }} >
                    <Image source={backicon} style={styles.icon} />
                </TouchableOpacity>
                <Picker selectedValue = {this.state.usermode} onValueChange = {this.handelUsermode}>
                    <Picker.Item label = "Courier" value = "courier" />
                    <Picker.Item label = "Customer" value = "customer" />
                </Picker>
                <Text style={styles.mode}>I want to be a {this.state.usermode}</Text>

                <TextInput style = {styles.input}
                    underlineColorAndroid = "transparent"
                    placeholder = " User Name"
                    placeholderTextColor = "#9a73ef"
                    autoCapitalize = "none"
                    onChangeText = {this.handelUserName}/>
                
                <TextInput secureTextEntry={true} style = {styles.input}
                    underlineColorAndroid = "transparent"
                    placeholder = " Password"
                    placeholderTextColor = "#9a73ef"
                    autoCapitalize = "none"
                    onChangeText = {this.handlePassword}/>

                <TextInput style = {styles.input}
                    underlineColorAndroid = "transparent"
                    placeholder = " Phone Number"
                    placeholderTextColor = "#9a73ef"
                    autoCapitalize = "none"
                    onChangeText = {this.handelPhonenum}/>



                <TouchableOpacity
                    style = {styles.submitButton}
                    onPress = {
                    () => this.userSignupComb(this.state.username, this.state.password, this.state.phonenum, this.state.usermode)
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
        borderRadius: 20
     },
     submitButtonText:{
        color: 'white',
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
    },
    option:{
        color: 'grey',
        textAlign: 'center'
    },
    mode:{
        fontSize:20,
        textAlign: 'center',
        marginTop: -20
    },
    placebtn: {
        position: 'absolute',
        bottom: 30,
        left: 30,
      }
})
