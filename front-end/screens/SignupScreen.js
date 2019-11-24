import React from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput,Picker, Image,ScrollView } from "react-native";
import * as Facebook from "expo-facebook";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import fbicon from "../assets/facebook.png";
import backicon from "../assets/back.png";
import { URL, PORT} from "../src/conf";
import TopBar from "../src/utils/TopBar";

export default class SignupScreen extends React.Component {

        state = {
            username: "",
            password: "",
            phonenum: "",
            usermode: "courier",
        };

    handelUserName = (text) => {
        this.setState({username: text});
    }
    handlePassword = (text) => {
        this.setState({password: text});
    }
    handelPhonenum = (text) => {
        this.setState({phonenum: text});
    }
    handelUsermode = (text) => {
        this.setState({usermode: text});
    }

    async userSignupComb (username, password, phonenum, usermode)  {
        let apptoken = await Notifications.getExpoPushTokenAsync();
        this.user_signup(username, -1,-1,phonenum,usermode, apptoken, password);
    }
    //facebook_signup = (username, fbid,fbtoken,phonenum,usermode, apptoken, password)
    user_signup = (username, fbid,fbtoken,phonenum,usermode, apptoken, password) => {
            console.log(username);
            console.log(password);
            console.log(phonenum);
            console.log(apptoken);
        if(username == "" || password == "" || phonenum == "" || phonenum.length !== 10){
            alert("Please make you you have enter all fields");
        } else{
        fetch(`${URL}:${PORT}/users/signup`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                username: username,
                fbid    : -1,
                fbtoken : -1, 
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

    
    render() {
        return (
            <View style = {styles.container}>
              <TopBar onBackPress={() => {this.props.navigation.navigate("LoginScreen")}}/>
              <ScrollView>
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
                    keyboardType = 'numeric'
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
            </ScrollView>
            </View>

        )
    }
}



const styles = StyleSheet.create({
    container: {
        paddingTop: 0
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
