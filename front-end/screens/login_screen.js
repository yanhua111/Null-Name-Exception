import React from 'react';
import { StyleSheet, Text, View,Button } from 'react-native';
import Expo from "expo";
import * as Facebook from 'expo-facebook';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';




//import { Container, Content, Header, Form, Input, Item, Label } from 'native-base'

export default class LoginScreen extends React.Component {

    componentDidMount() {
        this.check_login();
      }

    check_login = () => {
        fetch('http://ec2-99-79-78-181.ca-central-1.compute.amazonaws.com:3000/users/check', {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
              }).then((response) => {
                // console.log("response:",response.json());
                response.json().then(result=> {
                  //console.log("result:",result);
                  if(result.errno == 0){
                    //switch to dashboard
                    this.props.navigation.navigate('DashboardScreen');
                 }else{
                    alert(`Please Sign In With Facebook`);
                 }
                })
                
              } 
              ).catch(error => console.log(error))
      }

  async loginWithFb(){
    try {
    //face book login    
    const{type,token} = await Facebook.logInWithReadPermissionsAsync
    ('520578628732460', {permissions: ['public_profile']})  
     // push notification token permission
    const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        return;
      }
      let apptoken = await Notifications.getExpoPushTokenAsync();

    //call function to return value
    if(type == 'success'){
      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}`);

       let id = (await response.json()).id;
       if(typeof id=== 'string' );
      //  console.log("type: ",typeof id);
      //  console.log("face book token: ",token);
      //  console.log("face book name: ",await id);
      //  console.log("type:",type);
       this.user_signup(id,token,apptoken);
    }
  }catch ({ message }) {
        alert(`${message}`);
      }
  
   }

  user_signup = (username, fbtoken,apptoken) => {
    fetch('http://ec2-99-79-78-181.ca-central-1.compute.amazonaws.com:3000/users/login', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              username: username,
              fbtoken: fbtoken,
              apptoken: apptoken
            }),
          })
  }



  Jump_Dash = ()=>{
    this.props.navigation.navigate('DashboardScreen');
  }

  render() {
    return (
      <View style={styles.container}>
      
         <Button
                onPress={this.loginWithFb.bind(this)}
                title='Sign in with Facebook'>
           </Button>
          
           <Button
                onPress={() => { this.props.navigation.navigate('DashboardScreen') }}
                title='Jump to Dashboard'>
           
           </Button>

           </View>
    );
  }


}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 10
  },
});