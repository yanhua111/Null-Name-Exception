import React from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput, Picker } from "react-native";
import Expo from "expo";
import * as Facebook from "expo-facebook";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import "../global";
import { URL, PORT} from "../src/conf";

export default class phonemodeScreen extends React.Component {
    
    state = {
        phonenum: "",
        usermode: "courier",
    }
    handelPhonenum = (text) => {
        this.setState({phonenum: text});
    }
    handelUsermode = (text) => {
        this.setState({usermode: text});
        global.role = text;
    }


    facebook_signup = (username, fbid,fbtoken,phonenum,usermode, apptoken, password) => {
        console.log(username);
        console.log(fbid);
        console.log(fbtoken);
        console.log(phonenum);
        console.log(usermode);
        console.log(apptoken);
        console.log(password);
        if(phonenum === "" || phonenum.length !== 10){
            console.log("phone number");
            alert("Please enter phone number !");
        }else{
            console.log("enter");
        fetch(`${URL}:${PORT}/users/signup`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                username: username,
                fbid    : fbid,
                fbtoken:  fbtoken,
                phonenum: phonenum,
                usermode: usermode,
                apptoken: apptoken,
                password: password,
            }),
        }).then((response) => {
              response.json().then((result) => {
                if(result.errno == -1){
                    alert(result.message);
                }else{
                    console.log("result:",result);
                    global.userid = result.data.userid;
                    global.username = result.data.username;
                    global.phoneNum = phonenum;
                    global.role     = usermode;
                    if(usermode == "courier"){
                        this.props.navigation.navigate("OrderList");
                    } else {
                        this.props.navigation.navigate("CustomerScreen");
                    }
                }
            })
    }).catch((error) => console.log(error)); 
    
  }
}



    render() {
        const username = this.props.navigation.getParam("username", "EMPTY");
        const fbtoken  = this.props.navigation.getParam("fbtoken", "EMPTY");
        const apptoken = this.props.navigation.getParam("apptoken", "EMPTY");
        const fbid    = this.props.navigation.getParam("fbid", "EMPTY");
        return (
            <View style = {styles.container}>
                
                
                <Picker selectedValue = {this.state.usermode} onValueChange = {this.handelUsermode}>
                    <Picker.Item label = "Courier" value = "courier"/>
                    <Picker.Item label = "Customer" value = "customer" />
                </Picker>
                <Text style={styles.mode}>I want to be a {this.state.usermode}</Text>
                
                <TextInput style = {styles.input}
                keyboardType = 'numeric'
                underlineColorAndroid = "transparent"
                placeholder = "  phone number"
                placeholderTextColor = "#9a73ef"
                autoCapitalize = "none"
                onChangeText = {this.handelPhonenum}/>
                

                <TouchableOpacity
                    style = {styles.submitButton}
                    onPress = { // facebook_signup = (username, fbid,fbtoken,phonenum,usermode, apptoken, password)
                    () => this.facebook_signup(username,fbid,fbtoken,this.state.phonenum, this.state.usermode,apptoken,-1)
                    }>
                    <Text style = {styles.submitButtonText}>next </Text>
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
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
        marginTop: -1
     },
     mode:{
        fontSize:20,
        textAlign: 'center',
        marginTop: -20
    }
})
