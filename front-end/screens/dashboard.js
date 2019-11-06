import React from "react";
import { StyleSheet, Text, View,Button } from "react-native";

/*DashBoard screen if for test use, the recent update is in openpages and 
login_screen, if you are doing code review, you can 
 */
export default class DashboardScreen extends React.Component {
  
  
  
  
  render() {
    return (
      <View style = {styles.container}>
      <Text style = {styles.text}>DashboardScreen</Text> 

      <View style = {styles.btn}>
      <Button
                onPress={() => { this.props.navigation.navigate("LoginScreen"); }}
                title="Jump back to login">
           </Button>
      </View>

    <View style = {styles.btn}>
     <Button
                onPress={() => { this.props.navigation.navigate("CourierScreen"); }}
                title="I want to be courier">
           </Button>
    </View>
    <View style = {styles.btn}>
     <Button
                onPress={() => { this.props.navigation.navigate("CustomerScreen"); }}
                title="I want to be customer">
           </Button>
      </View>
    </View>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  },
  btn:{   
    borderWidth:1,  
    borderRadius:3, 
    margin: 10,
    padding: 10, 
    borderColor:"black",  
    backgroundColor:"yellow",  
    borderStyle: "dotted"
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
  },
});