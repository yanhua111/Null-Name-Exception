import React from "react"; 
import {StyleSheet,View,Image,Text,TouchableOpacity,ImageBackground,Button,TextInput} from 'react-native'; 
import "../global";
import "../assets/runningman.png";
import "../assets/pine.png";
import Modal from "react-native-modal";


export default class Setting extends React.Component { 

    state = { 
        occupation: 'Software Engineer', 
        isModalVisible: false,
        isModalVisible1: false,
        user_text:"",
    }; 


    Switch_role = (mode) => {
      console.log(1);
      console.log(this.state.role);
        fetch("http://ec2-99-79-78-181.ca-central-1.compute.amazonaws.com:3000/users/switch", {
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
      }

      set_phone = () => {
        console.log(1);
        console.log(this.state.role);
          fetch("http://ec2-99-79-78-181.ca-central-1.compute.amazonaws.com:3000//users/setinfo", {
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
      // Defined on step 4 
      return(
        <View style = {styles.container}>
          <Text style = {styles.text}>Personal Profile</Text>
      <Text style = {styles.text}>name : {global.username}</Text>
      <Text style = {styles.text}>mode : {global.role}</Text>
      <Text style = {styles.text}>Phone No : {global.phoneNum}</Text>
          <View style = {styles.btn}>
              <Button 
                onPress={this.toggleModal}
                title="choose role">
           </Button> 
          </View>
          <View style = {styles.btn1}>
              <Button 
                onPress={this.toggleModal1}
                title="Press to enter/change phone number">
           </Button> 
          </View>

          <Modal isVisible={this.state.isModalVisible}>
          <View style = {styles.container}>
            <Text style = {styles.text1}>Please choose your role</Text>
            <View style = {styles.Button}>
            <Button title="Courier" onPress={() => {this.Switch_role("courier");}} />
            </View>
            <View style = {styles.Button}>
            <Button title="Customer" onPress={() => {this.Switch_role("customer");}} />
            </View>
            <View style = {styles.Button}>
            <Button title="quit" onPress={this.toggleModal} />
            </View>
          </View>
        </Modal>

        <Modal isVisible={this.state.isModalVisible1}>
          <View style = {styles.container1}>
            <Text style = {styles.text1}>Enter Your Phone Number</Text>
            <TextInput
              placeholder="Phone number : eg 123456789"
              placeholderTextColor = "#FFFFFF"
              color = "#FFFFFF" 
              underlineColorAndroid={"transparent"}
              onChangeText={(user_text) => this.setState({user_text})}
              style={{ marginVertical: 20 }} />
              <View style = {styles.Button1}>
            <Button title="confirm" onPress={this.set_phone} />
            </View>
            <View style = {styles.Button1}>
            <Button title="quit" onPress={this.toggleModal1} />
            </View>
          </View>
        </Modal>

          </View>
      );
    } 
  } 


  const styles = StyleSheet.create({ 
    container: { 
     flex: 1, 
      height: null, 
      width: null, 
     // position:"absolute",
      flexDirection: 'column',
    }, 
    container1: { 
      flex: 1, 
       height: null, 
       width: null, 
       position:"absolute",
       flexDirection: 'column',
     }, 
    info: { 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        bottom: 0, 
        left: 0, 
        position: 'absolute', 
        right: 0, 
      }, 
      personal: { 
        padding: 30, 
      }, 
      name: { 
        color: '#fff', 
        fontFamily: 'Helvetica', 
        fontSize: 30, 
        fontWeight: 'bold', 
      }, 
      occupation: { 
        color: '#d6ec1b', 
        marginTop: 50, 
      }, 
      selected: { 
        tintColor: '#d6ec1b', 
      }, 
      icon: { 
        tintColor: '#504f9f', 
        height: 30, 
        width: 30, 
      }, 
      counter: { 
        color: '#fff', 
        fontSize: 15, 
        marginTop: 5, 
      }, 
      stats: { 
        flexDirection: 'row', 
      }, 
      stat: { 
        alignItems: 'center', 
        backgroundColor: '#7675b7', 
        borderColor: '#6e6db1', 
        borderLeftWidth: 1, 
        flex: 1, 
        padding: 10, 
      }, 
      Button:{
          borderWidth:1,  
          borderRadius:30, 
          margin: 20,
          padding: 10, 
          borderColor:"black",  
          backgroundColor:"yellow",  
          borderStyle: "dotted"
      },
      Button1:{
        borderWidth:1,  
        borderRadius:30, 
        margin: 20,
        padding: 10, 
        borderColor:"black",  
        backgroundColor:"yellow",  
        borderStyle: "dotted"
    },
      btn:{
        borderWidth:1,  
        borderRadius:30, 
        margin: 100,
        padding: 10, 
        borderColor:"black",  
        backgroundColor:"yellow",  
        borderStyle: "dotted",
        position: 'absolute',
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 90,
        left:25
    },
    btn1:{
      borderWidth:1,  
      borderRadius:30, 
      margin: 10,
      padding: 10, 
      borderColor:"black",  
      backgroundColor:"yellow",  
      borderStyle: "dotted",
      position: 'absolute',
      alignSelf: 'flex-end',
      position: 'absolute',
      bottom: 90,
      left:10
  },
      text:{
        shadowOffset:{width: 10, height: 10},
        shadowColor: "black",
        shadowOpacity:1.0,
        padding:20,
        borderWidth:1,  
        borderRadius:3, 
        backgroundColor: "#E0FFFF",
        borderStyle: "dotted",
        fontSize: 20,
        fontWeight: "bold",
        bottom: -100
      },
      text1:{
        shadowOffset:{width:5, height: 5},
        shadowColor: "black",
        shadowOpacity:1.0,
        padding:20,
        borderWidth:1,  
        borderRadius:3, 
        backgroundColor: "#E0FFFF",
        borderStyle: "dotted",
        fontSize: 20,
        fontWeight: "bold",
      },
  }); 