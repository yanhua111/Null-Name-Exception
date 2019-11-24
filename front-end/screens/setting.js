import React from "react"; 
import {StyleSheet,View,Image,Text,TouchableOpacity,ToastAndroid,ImageBackground,Button,TextInput,Platform,
  PixelRatio,Alert} from 'react-native'; 
import "../global";
import Modal from "react-native-modal";
import { URL, PORT} from "../src/conf";

import self from "../assets/self.png";
import userMode from "../assets/usermode.png";
import phone from "../assets/phone.png";
import TopBar from "../src/utils/TopBar";
import Cell from "../src/utils/Cell";
import choco from "../assets/choco.png";


export default class Setting extends React.Component { 
  
  componentDidMount() {
    if(global.change_screen == 1){
      this.check_navigate();
      
    }
  }

    
    check_navigate = () => {
      
      if(global.role == "courier"){
        global.change_screen = 0;
        this.props.navigation.navigate("OrderList");
      }else{
        global.change_screen = 0;
      this.props.navigation.navigate("CustomerScreen");
      }
    }

    logout = () => {
      console.log("here");
      fetch(`${URL}:${PORT}/users/logout`, {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              credentials: "include",
            }).then((response) => {
              response.json().then((result) => {
                if (result.errno == 0) {
                  this.props.navigation.navigate("LoginScreen");
                  if(Platform.OS === "ios"){
                    console.log(result.message);
                  }else{
                      ToastAndroid.showWithGravityAndOffset(
                      result.message,
                      ToastAndroid.LONG,
                      ToastAndroid.BOTTOM,
                      25,
                      50
                    );
                  }  
                }
              })
            }).catch((error) => console.log(error));      
    }

    render() { 
      const Phone = this.props.navigation.getParam('Phone', global.phoneNum);
      const Name = this.props.navigation.getParam('Name', global.username);
      const UserMode = this.props.navigation.getParam('UserMode', global.role);
      const Change = this.props.navigation.getParam('UserMode', global.change_screen);
      return(
        <View style = {styles.container}>
          <TopBar
          showback = {false}>
          Personal Profile
          </TopBar>
            {/**here is the view for text*/}
        <Cell
          source={self}
          title="Name:"
          placeholder={global.username}
          showarrow={false} 
        />
        <Cell
          source={userMode}
          title="User Mode:"
          placeholder={global.role}
          showarrow={false} 
        />
        <Cell
          source={phone}
          title="Phone Number:"
          placeholder={global.phoneNum}
          showarrow={false} 
        />
        <Cell
          source={choco}
          title="User ID:"
          placeholder={global.userid}
          showarrow={false} 
        />
       
     
      <View style={styles.touchBtn1}>
            <TouchableOpacity 
             onPress={ ()=> this.props.navigation.navigate("ChangeSetting",
             {
               Name : Name,
               UserMode: UserMode,
               Phone: Phone,
               Change: Change,
             }
            )
              }>
            <Text style={styles.text_opacity}>Edit Setting</Text>
            </TouchableOpacity>
      </View>

      <View style={styles.touchBtn1}>
            <TouchableOpacity 
             onPress={ ()=> Alert.alert(
              "Do you really want to log out?",
              "you can log in later",
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {text: 'Log Out', onPress: () => this.logout()},
              ],
              {cancelable: false},
            )}>
            <Text style={styles.text_opacity}>Log Out</Text>
            </TouchableOpacity>
      </View>

    </View> 
      );
    } 
  } 


  const styles = StyleSheet.create({ 
    container: { 
      flex:0.1 , 
      flexDirection: 'column',
      height: null, 
      width: null, 
      justifyContent: 'space-between',
      alignItems: 'center',
    }, 
    container1: { 
      flex:0.1 , 
      flexDirection: 'column',
      height: 10, 
      width: null, 
      justifyContent: 'flex-start',
      alignItems: 'center',
      bottom:10,
     }, 
     container2: { 
      flex:0.1 , 
      flexDirection: 'column',
      height: null, 
      width: null, 
      justifyContent: 'center',
      alignItems: 'center',
      bottom: -100,
      paddingHorizontal: 30,
      paddingVertical: 10,
    }, 
      icon: { 
        height: 30, 
        width: 30, 
      }, 
      text:{
        flex: 0,
        padding:20,
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "left",
      },
      text_opacity:{
        flex: 0,
        padding:10,
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "left",
      },
      text1:{
        flex: 0,
        padding:10,
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        color:"orange",
        backgroundColor:"white",  
        bottom:90,
      },
      text2:{
        flex: 0,
        padding:0,
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "left",
        color:"orange",
      },
      textbtn:{
        flex: 0,
        padding:20,
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        bottom:28,
      },
      textbtn1:{
        flex: 0,
        //padding:20,
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        bottom:28,
        paddingHorizontal: 10,
        paddingVertical: 20,
        height:10,
        width:90,
      },
      image: {
        flex:1,
        width: 40,
        height: 40,
        position: 'absolute',
        bottom: -100,
      },
      title:{
        flex: 0.5,
        padding:5,
        color: "black",
        alignItems: "center",
        fontSize: 30,
        justifyContent: 'center',
        width: 800,
        height: 50,
        textAlign: "center",
        bottom:-10,
        fontWeight: "bold",
        position: 'absolute',
      },
      topbar:{
          position: 'absolute',
          backgroundColor: 'white',
          marginBottom: 20,
          width: '100%',
          height: 85,
          borderColor: 'white',
          borderBottomWidth: 1,
          elevation: 10,
          alignItems: 'center',
          backgroundColor: "white",
          shadowOffset: { width: 1, height: 1 },
          shadowColor: 'black',
          shadowOpacity: 1.0,
      },
      infoStyle:{
          flex:1, 
          flexDirection: 'row',
          height: null, 
          width: "100%", 
          justifyContent: "flex-start",
          alignItems: "center",
          bottom: -100,
          position: "absolute",
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderColor: 'grey',
      },
      infoStyle1:{
          flex:1, 
          flexDirection: 'row',
          height: null, 
          width: "100%", 
          justifyContent: "flex-start",
          alignItems: "center",
          bottom: -180,
          position: "absolute",
          paddingHorizontal:20,
          paddingVertical: 4,
          borderBottomWidth: 1,
          borderColor: 'grey',
        },
        infoStyle2:{
          flex:1, 
          flexDirection: 'row',
          height: null, 
          width: "100%", 
          justifyContent: "flex-start",
          alignItems: "center",
          bottom: -250,
          position: "absolute",
          paddingHorizontal:20,
          paddingVertical: 0,
          borderBottomWidth: 1,
          borderColor: 'grey',
          },

        touchBtn1:{
          backgroundColor: '#F65353',
          borderRadius: 5,
          paddingHorizontal: 74,
          paddingVertical: 10,
          alignItems: 'center',
          marginBottom: 10,
          bottom: -200,
          height: 60,
          width:"82%",
          },    
        touchBtn2:{
            backgroundColor: '#F65353',
            borderRadius: 5,
            paddingHorizontal:0,
            paddingVertical: 33,
            justifyContent: "center",
            alignItems: 'flex-start',
            marginBottom: 10,
            bottom: -360,
            },  
         touchBtn3:{
            flex:1,
            flexDirection: 'column',
            backgroundColor: '#F65353',
            borderRadius: 5,
            paddingVertical: 34,
            justifyContent: "center",
            alignItems: 'center',
            marginBottom: 10,
            bottom: 50,
            height:50,
            width:200,
            },  
          modal:{
            backgroundColor:"white",
          },
  }); 