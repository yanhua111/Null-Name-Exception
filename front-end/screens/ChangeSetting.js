import React from "react"; 
import {StyleSheet,View,Image,Text,TouchableOpacity,ImageBackground,Button,TextInput,Platform,
  PixelRatio,Picker} from 'react-native'; 
import "../global";
import { URL, PORT} from "../src/conf";

import TopBar from "../src/utils/TopBar";
import Cell from "../src/utils/Cell";
import self from "../assets/self.png";
import userMode from "../assets/usermode.png";
import phone from "../assets/phone.png";
import CustomInput from "../src/utils/CustomInput";



export default class ChangeSetting extends React.Component { 

  componentDidMount() {
    mode = global.role;
  }

  
      state = { 
        user_text_name:global.username,
        user_text_phone: global.phoneNum,
        user_mode: global.role,
      }; 



        set_update = ()=>{
          if(this.state.user_text_phone.length !== 10){
            alert("Please enter valid phone number!");
          }else{
          fetch(`${URL}:${PORT}/users/update`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
             username:this.state.user_text_name,
             usermode: this.state.user_mode,
             phonenum: this.state.user_text_phone, 
             }),
          }).then((response) => {
            console.log(response);
            response.json().then((result)=> {
              console.log(result);
              if(result.errno == -1){
                alert("User name already exist please choose a new one")
              }else{
                global.username = this.state.user_text_name;
                global.role = this.state.user_mode;
                global.phoneNum = this.state.user_text_phone;
                global.change_screen = (this.state.user_mode == mode)?0:1,
                this.props.navigation.navigate("Setting",
                {
                  Name : this.state.user_text_name,
                  UserMode: this.state.user_mode,
                  Phone: this.state.user_text_phone,
                  Change: (this.state.user_mode == mode)?0:1,
                }
                )
              }
            })
          }); 
        }
        }


    render() { 
        return(
            <View style = {styles.container}>
            <TopBar
            showback = {false}>
            Change Setting
            </TopBar>
            <View style = {styles.container1}>
            <CustomInput title  = "name" value = {this.state.user_text_name} 
            onChangeText = {(user_text_name) => this.setState({user_text_name})}></CustomInput>
            </View>
            {/* <View style = {styles.container1}>
            <CustomInput title  = "user mode" value = {this.state.user_text_mode} 
            onChangeText = {(user_text_mode) => this.setState({user_text_mode})}></CustomInput>
            </View> */}
            <View style = {styles.container1}>
            <CustomInput title  = "phone number" value = {this.state.user_text_phone} 
            onChangeText = {(user_text_phone) => this.setState({user_text_phone})}></CustomInput>
            </View>

           
        <Text style = {styles.text}>Usermode : {this.state.user_mode}</Text>
        <View style = {Platform.OS === "ios" ? styles.container2 : styles.container3}>
            <Picker
                selectedValue={this.state.user_mode}
                style={{height: Platform.OS === "ios" ? 0 : 150, width: 300}}
                onValueChange={(itemValue, itemIndex) =>
                this.setState({user_mode: itemValue})
            }>
            <Picker.Item label=" " value= {this.state.user_mode}/>
            <Picker.Item label="Courier" value="courier"/>
            <Picker.Item label="Customer" value="customer"/>
            </Picker>
            </View>

            {/* <Button  onPress={()=> this.set_update()} title = "back"></Button> */}
            <View style={Platform.OS === "ios" ? styles.touchBtn1 : styles.touchBtn2}>
            <TouchableOpacity 
               onPress={()=> this.set_update()}
             >
            <Text style={styles.text_opacity}>Confirm</Text>
            </TouchableOpacity>
          </View>
            </View>
        )}

}

const styles = StyleSheet.create({ 
    container: { 
      flex:0.5 , 
      flexDirection: 'column',
      height: null, 
      width: null, 
      justifyContent: 'space-between',
      alignItems: 'center',
    },    
    container1: { 
        flex:1 , 
        flexDirection: 'row',
        //paddingHorizontal:20,
        paddingVertical: 30,
        height: 10, 
        width: null, 
        justifyContent: 'flex-start',
        alignItems: 'center',
        bottom:-20,
       },
    container2: { 
        paddingVertical: 30,
        height: 100, 
        width: 100, 
        justifyContent: 'center',
        alignItems: 'center',
        // bottom:-50,
       },
    container3: { 
        paddingVertical: 150,
        height: 10, 
        width: 100, 
        justifyContent: 'center',
        alignItems: 'center',
        // bottom:-50,
       },
    text:{
        //flex: 0,
        padding:0,
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        color:"black",
        bottom :-100,
      },
  touchBtn1:{
        backgroundColor: '#F65353',
        borderRadius: 5,
        paddingHorizontal: 74,
        paddingVertical: 10,
        alignItems: 'center',
        marginBottom: 10,
        bottom: -250,
        },
  touchBtn2:{
          backgroundColor: '#F65353',
          borderRadius: 5,
          paddingHorizontal: 74,
          paddingVertical: 10,
          alignItems: 'center',
          marginBottom: 10,
          }, 
    text_opacity:{
          flex: 0,
          padding:10,
          fontSize: 20,
          fontWeight: "bold",
          textAlign: "left",
        },
})






