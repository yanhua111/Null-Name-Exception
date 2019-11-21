import React from "react"; 
import {StyleSheet,View,Image,Text,TouchableOpacity,ImageBackground,Button,TextInput,Platform,
  PixelRatio} from 'react-native'; 
import "../global";
import Modal from "react-native-modal";
import { URL, PORT} from "../src/conf";

import self from "../assets/self.png";
import userMode from "../assets/usermode.png";
import phone from "../assets/phone.png";

export default class Setting extends React.Component { 

    state = { 
        isModalVisible: false,
        isModalVisible1: false,
        user_text:"",
    }; 


    Switch_role = (mode) => {
      console.log(1);
      console.log(this.state.role);
        fetch(`${URL}:${PORT}/users/switch`, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                 usermode: mode, 
                 }),
              }); 
              global.role = mode;
              this.toggleModal();
              if(global.role === "courier"){
                this.props.navigation.navigate("OrderList");
              }else{
                this.props.navigation.navigate("CustomerScreen");
              }
      }

      set_phone = () => {
        console.log(1);
        console.log(this.state.role);
          fetch(`${URL}:${PORT}/users/setinfo`, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify({
                   phonenum: this.state.user_text, 
                   }),
                }); 
                global.phoneNum = this.state.user_text;
                this.toggleModal1();
        }

      toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
      };

      toggleModal1 = () => {
        this.setState({ isModalVisible1: !this.state.isModalVisible1 });
      };

   
    render() { 
      // Defined on step 4   <View style={{flexDirection:'row', flexWrap:'wrap'}}>
      return(
        <View style = {styles.container}>
          {/**this is the view for top bar */}
          <View style  = {styles.topbar}>
           <Text style = {styles.title}>Personal Profile</Text> 
            </View>
            {/**here is the view for text*/}
          
        <View style = {styles.infoStyle}>
        <Image style = {styles.icon}
         source = {self}
        />   
      <Text style = {styles.text}>name : </Text>
      <Text style = {styles.text2}>{global.username} </Text>   
      </View>
      
      <View style = {styles.infoStyle1}>
      <Image style = {styles.icon}
         source = {userMode}
        />   
      <Text style = {styles.text}>mode : </Text>
      <Text style = {styles.text2}>{global.role} </Text> 
      </View>

      <View style = {styles.infoStyle2}>
      <Image style = {styles.icon}
         source = {phone}
        />   
      <Text style = {styles.text}>Phone No : </Text>
      <Text style = {styles.text2}>{global.phoneNum}</Text>
      </View>
       
     
      <View style={styles.touchBtn1}>
            <TouchableOpacity 
             onPress={this.toggleModal}>
            <Text style={styles.text_opacity}>Change Role</Text>
            </TouchableOpacity>
          </View>
    

      <View style={styles.touchBtn2}>
            <TouchableOpacity 
              onPress={this.toggleModal1}>
            <Text style={styles.textbtn}>Press to enter phone number</Text>
            </TouchableOpacity>
           </View>
     
    {/**all the modals goes here */}
     {/**First Modal */}
           <View style = {styles.container}>
          <Modal isVisible={this.state.isModalVisible}>
      {/**Title */}    
      <View style = {styles.container1}>
          <View>
            <Text style = {styles.text1}>Please choose your role</Text>
            </View>
      </View>
    {/**Courier Button */}
      <View style = {styles.container1}>
            <View style={styles.touchBtn3}>
            <TouchableOpacity 
              onPress={() => {this.Switch_role("courier");}}>
            <Text style={styles.textbtn}>  Courier  </Text>
            </TouchableOpacity>
           </View>
      </View>    
  {/**Customer Button */}
      <View style = {styles.container1}>
           <View style={styles.touchBtn3}>
            <TouchableOpacity 
              onPress={() => {this.Switch_role("customer");}}>
            <Text style={styles.textbtn}>Customer</Text>
            </TouchableOpacity>
           </View>
      </View> 
  {/**Quit button */}
      <View style = {styles.container1}>
           <View style={styles.touchBtn3}>
            <TouchableOpacity 
              onPress={this.toggleModal}>
            <Text style={styles.textbtn}>Quit</Text>
            </TouchableOpacity>
           </View>
      </View> 
        </Modal>

         {/**Second Modal */}
        <Modal isVisible={this.state.isModalVisible1}>
          <View>
            <Text style = {styles.text1}>Enter Your Phone Number</Text>
            <TextInput
              placeholder="Enter phone number here : eg 123456789"
              placeholderTextColor = "grey"
              color = "black" 
              underlineColorAndroid={"transparent"}
              onChangeText={(user_text) => this.setState({user_text})}
              style={{ marginVertical: 20,backgroundColor:"white",padding: 20, fontWeight: "bold",fontSize:14}} />
          </View>
          
          <View style = {styles.container2}>
           <View style={styles.touchBtn3}>
            <TouchableOpacity 
              onPress={this.set_phone}>
            <Text style={styles.textbtn1}>confirm</Text>
            </TouchableOpacity>
           </View>
          </View> 
          
          <View style = {styles.container2}>
           <View style={styles.touchBtn3}>
            <TouchableOpacity 
              onPress={this.toggleModal1}>
            <Text style={styles.textbtn1}>Quit</Text>
            </TouchableOpacity>
           </View>
          </View> 
        </Modal>

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
          justifyContent: "space-around",
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
          bottom: -340,
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