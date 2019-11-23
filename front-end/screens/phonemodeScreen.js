import React from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput, Picker } from "react-native";
import Expo from "expo";
import * as Facebook from "expo-facebook";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import "../global";
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


    user_info = (username, phonenum, usermode, fbtoken, apptoken) => {
        console.log("username:",username);
        console.log("phonenumber",phonenum);
        if(phonenum === ""){
            alert("Please enter phone number !");
        }else{
        fetch("http://ec2-99-79-78-181.ca-central-1.compute.amazonaws.com:3000/users/signup", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                username: username,
                phonenum: phonenum,
                usermode: usermode,
                fbtoken:  fbtoken,//navigation.getParam('fbtoken'),
                apptoken: apptoken,
            }),
    }).then((response) => {
        console.log("response",response);
              response.json().then((result)=>{
              console.log("user signup function")
              console.log("result",result);
              global.userid = result.data.userid;
              global.username = result.data.username;
              console.log("username",global.username);
            })
    });
    global.phoneNum = phonenum;
    if(usermode == "courier"){
        global.role = "courier";
        this.props.navigation.navigate("OrderList");
    } else {
        global.role = "customer";
        this.props.navigation.navigate("CustomerScreen");
    }
    }
}



    render() {
        const username = this.props.navigation.getParam("username", "EMPTY");
        const fbtoken = this.props.navigation.getParam("fbtoken", "EMPTY");
        const apptoken = this.props.navigation.getParam("apptoken", "EMPTY");
        return (
            <View style = {styles.container}>
                
                
                <Picker selectedValue = {this.state.usermode} onValueChange = {this.handelUsermode}>
                    <Picker.Item label = "Courier" value = "courier"/>
                    <Picker.Item label = "Customer" value = "customer" />
                </Picker>
                <Text style={styles.mode}>I want to be a {this.state.usermode}</Text>
                
                <TextInput style = {styles.input}
                underlineColorAndroid = "transparent"
                placeholder = "  phone number"
                placeholderTextColor = "#9a73ef"
                autoCapitalize = "none"
                onChangeText = {this.handelPhonenum}/>
                

                <TouchableOpacity
                    style = {styles.submitButton}
                    onPress = {
                    () => this.user_info(username,this.state.phonenum, this.state.usermode, fbtoken, apptoken)
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