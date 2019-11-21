import React from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput } from "react-native";
import Expo from "expo";
import * as Facebook from "expo-facebook";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
export default class phonemodeScreen extends React.Component {
    state = {
        phonenum: '',
        usermode: '',
    }
    handelPhonenum = (text) => {
        this.setState({phonenum: text});
    }
    handelUsermode = (text) => {
        this.setState({usermode: text});
    }


    user_info = (phonenum, usermode) => {
        fetch("http://ec2-99-79-78-181.ca-central-1.compute.amazonaws.com:3000/users/login", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                phonenum: phonenum,
                usermode: usermode,
            }),
    });
    }

    signupComb = (phonenum, usermode) => {
        this.user_info(phonenum, usermode);
        if(usermode == 'courier'){
            ///////////////set globel usermode
            this.props.navigation.navigate("CourierScreen");
        } else {
            this.props.navigation
            ///////////////set globel usermode
        }
    }

    render() {
        return (
            <View style = {style.container}>
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
                
                <Picker selectedValue = {this.state.usermode} onValueChange = {this.handelUsermode}>
                    <Picker.Item label = "Courier" value = 'courier' />
                    <Picker.Item label = "Customer" value = "customer" />
                </Picker>
                <Text style = {styles.text}>{this.state.usermode}</Text>

                <TouchableOpacity
                    style = {styles.submitButton}
                    onPress = {
                    () => this.signupComb(this.state.username, this.state.password, this.state.phonenum, this.state.username)
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