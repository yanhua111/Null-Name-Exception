import React from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput, Picker } from "react-native";
import Expo from "expo";
import * as Facebook from "expo-facebook";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import "../global";
export default class phonemodeScreen extends React.Component {
    
    state = {
        phonenum: '',
        usermode: 'Courier',
    }
    handelPhonenum = (text) => {
        this.setState({phonenum: text});
    }
    handelUsermode = (text) => {
        this.setState({usermode: text});
        global.role = text;
    }


    user_info = (username, phonenum, usermode, fbtoken, apptoken) => {
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
    });
    }

    signupComb = (phonenum, usermode, username, fbtoken, apptoken) => {
        this.user_info(username, phonenum, usermode, fbtoken, apptoken);
        if(usermode == 'courier'){
            global.role = 'courier';
            this.props.navigation.navigate("OrderList");
        } else {
            global.role = 'customer';
            this.props.navigation.navigate("CustomerScreen");
        }
    }

    render() {
        const username = this.props.navigation.getParam('username', 'EMPTY');
        const fbtoken = this.props.navigation.getParam('fbtoken', 'EMPTY');
        const apptoken = this.props.navigation.getParam('apptoken', 'EMPTY');
        return (
            <View style = {styles.container}>
                
                
                <Picker selectedValue = {this.state.usermode} onValueChange = {this.handelUsermode}>
                    <Picker.Item label = "Courier" value = 'courier' />
                    <Picker.Item label = "Customer" value = "customer" />
                </Picker>
                <Text style={styles.mode}>I want to be a {this.state.usermode}</Text>
                
                <TextInput style = {styles.input}
                underlineColorAndroid = "transparent"
                placeholder = "  phone number"
                placeholderTextColor = "#9a73ef"
                autoCapitalize = "none"
                onChangeText = {this.handelUserName}/>
                

                <TouchableOpacity
                    style = {styles.submitButton}
                    onPress = {
                    () => this.signupComb(this.state.phonenum, this.state.usermode, username, fbtoken, apptoken)
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