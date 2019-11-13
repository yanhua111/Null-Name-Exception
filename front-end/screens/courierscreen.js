import React from "react";
import { StyleSheet, Text, View,Button, Alert } from "react-native";
import "../global";
import { URL, PORT } from '../src/conf'

export default class CourierScreen extends React.Component {

    /* This function list_order is triggered by button of each order.
    Every small order is a button, when pressed, it will give us the 
    detailed information. This function help us to get all the information
    from back end database
    */
     
    list_order = (order_num) => {
      console.log("here");
        fetch(`${URL}:${PORT}/order/list`, {
                method: "GET",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                credentials: "include",
              }).then((res) => {
                  res.json().then(result =>{
                    global.id_ls = result.data.list[order_num].id;//global
                    global.content_ls = result.data.list[order_num].content;
                    global.lat_ls = result.data.list[order_num].lat;
                    global.lng_ls = result.data.list[order_num].lng;
                    global.user_id_ls = result.data.list[order_num].userid;
                    global.courier_id_ls = result.data.list[order_num].courierid;  
                    global.status  = result.data.list[order_num].status;
                    this.forceUpdate(); 
                  })
              } 
              ).catch((error) => console.log(error));
             }


      /* This function helps us to get total number of data. We need this function to 
      decide how many small "order button" we need to create. This will triggered by press
      button "get all order"
       */
     
      order_list_length = () => {
        fetch(`${URL}:${PORT}/order/list`, {
                method: "GET",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                credentials: "include",
              }).then((res) => {
                res.json().then(result=>{
                  console.log("result is :", result.data.list[0]);
                  console.log("length is:", result.data.list.length);
                  global.ls_length = result.data.list.length;//global
                  this.forceUpdate();
                })
                
              } 
              ).catch((error) => console.log(error));
      }

      /*This function help us to create list of order button use for loop
       Before this function, we need to first press "get all order", to get 
       the total number of button we need to create
       */
      renderButtons = () => {
        const buttons = [];
        for( let i = 0; i < global.ls_length; i++) { 
           buttons.push(
           <Button
           onPress={() => {this.list_order(i);}}
           title = {`order ${i}`}
           key = {i}
           ></Button>
          );
        }
        return buttons;
      }
   
      /* When courier wants to accept certain order, he can press "accpet order" button.
      Function will be called, and in backend, this order will be marked accepted 
       */
      accept_order = () => {
        fetch(`${URL}:${PORT}/order/accept`, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                 orderid: global.id_ls, 
                 }),
              });
              this.props.navigation.navigate("CourierMap");   
      }
    
      /* This function gets the user's app token so 
      that we can send notification later
      */
      get_user_token = () => {
       return fetch(`${URL}:${PORT}/users/get_token`, {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                  userid: global.user_id_ls,
                  }),
              }).then((res) => {
                  res.json().then((result) => {
                    global.apptoken = result.data.apptoken;
                    console.log("userid", global.user_id_ls);
                    this.forceUpdate();
                  });
                   
              } 
              ).catch((error) => console.log(error));
      }
      
      /* This function will mark the order to finished status. After this we will send
      notification to customer indicate his order is finished. 
      */
      finish_order = () => {
        this.get_user_token().then( 
          fetch(`${URL}:${PORT}:3000/order/finish`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              orderid: global.id_ls,
             }),
          }).then( (res)=>{
            fetch(`${URL}:${PORT}:3000/push`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
             token : global.apptoken, 
             message: "finished"
             }),
          }).then( (res) => {
            global.id_ls = -1;
            global.content_ls = "";
            global.lat_ls = -1;
            global.lng_ls = -1;
            global.user_id_ls = -1;
            global.courier_id_ls = -1;
            global.apptoken = "";
          });
        })

        );
        
 
      }


    render() {   
      return (
        <View style = {styles.container}>
           
        
           <View style = {styles.btn}>
           <Button 
                onPress={() => { this.props.navigation.navigate("DashboardScreen"); }}
                title="back">
           </Button> 
            </View> 

          <View style = {styles.btn}>
           <Button 
                onPress={() => { this.props.navigation.navigate("CourierMap"); }}
                title="Go to Map">
           </Button>  
           </View>

        <View style = {styles.btn}>
        <Button 
                onPress={this.order_list_length.bind(this)}
                title="Get All Order">
           </Button> 
         </View>

         <View style = {styles.btn}>
           <Button 
                onPress={this.accept_order.bind(this)}
                title="Accept Order">
           </Button> 
        </View>
           
        <View style = {styles.btn}>
           <Button 
                onPress={this.finish_order.bind(this)}
                title="Finish Order">
           </Button> 
        </View>
            {
                 global.ls_length != 0?( // global
                     <View>{this.renderButtons()}</View>
                     ):(
                       <View><Text style={styles.text}>no order</Text></View>
                    )
                  }
                    <Text style={styles.text}>Order Content: {global.content_ls}</Text>
            
            <Text style={styles.text}>Total order number : {global.ls_length}</Text>
            <Text style={styles.text}>Order ID :{global.id_ls}</Text>
      </View>

      );
    }
  
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      justifyContent: "space-between",
      alignItems: "center",
      margin:40,
      padding: 10,
      flexDirection: "column"
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
      padding:20,
      borderWidth:1,  
      borderRadius:3, 
      backgroundColor: "#E0FFFF",
      borderStyle: "dotted",
      fontSize: 20,
      fontWeight: "bold"
    },
  });
  