import React from 'react';
import { StyleSheet, Text, View,Button, Alert } from 'react-native';
import '../global';


export default class CourierScreen extends React.Component {

//   constructor(props){
//     super(props);
//     this.id_ls = 1.0;
//     this.lng_ls = 5.0;
//     this.lat_ls = 6.0;
//     this.content_ls = ''; 
//     this.user_id_ls = '123';
//     this.courier_id_ls = '456';  
//     this.apptoken = 'abc';
//    // this.state = {
//      this.ls_length = 0;
//    //   
// }


//get order information
    list_order = (order_num) => {
      console.log("here");
        fetch('http://ec2-99-79-78-181.ca-central-1.compute.amazonaws.com:3000/order/list', {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
              }).then((res) => {
                  res.json().then(result =>{
                    global.id_ls = result.data.list[order_num].id;//global
                    global.content_ls = result.data.list[order_num].content;
                    global.lat_ls = result.data.list[order_num].lat;
                    global.lng_ls = result.data.list[order_num].lng;
                    global.user_id_ls = result.data.list[order_num].userid;
                    global.courier_id_ls = result.data.list[order_num].courierid;  
                    this.forceUpdate(); 
                  })
              } 
              ).catch(error => console.log(error))
             }


     //get order list length
      //const{ls_length} = this.state;
       // this.setState({ls_length:ls_length+5})
      order_list_length = () => {
        // this.ls_length = 5;//这个是假数据，等下要去掉
        // this.forceUpdate();
        fetch('http://ec2-99-79-78-181.ca-central-1.compute.amazonaws.com:3000/order/list', {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
              }).then((res) => {
                res.json().then(result=>{
                  console.log("result is :", result.data.list[0])
                  console.log("length is:", result.data.list.length)
                  global.ls_length = result.data.list.length;//global
                  this.forceUpdate();
                })
                
              } 
              ).catch(error => console.log(error))
      }

      renderButtons = () => {
        const buttons = [];
        for( let i = 0; i < global.ls_length; i++) { //global
           buttons.push(
           <Button
           onPress={()=>{this.list_order(i)}}
           title = {`order ${i}`}
           key = {i}
           ></Button>
          )
        }
        return buttons;
      }
   
      //accept order
      accept_order = () => {
        fetch('http://ec2-99-79-78-181.ca-central-1.compute.amazonaws.com:3000/order/accept', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                 orderid: global.id_ls, //global
                 }),
              })
              this.props.navigation.navigate('CourierMap');   
      }
    
      get_user_token = () => {
       return fetch('http://ec2-99-79-78-181.ca-central-1.compute.amazonaws.com:3000/users/get_token', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                  userid: global.user_id_ls,
                  }),
              }).then((res) => {
                  res.json().then(result =>{
                    global.apptoken = result.data.apptoken;//这里看看这个id可能会有错global
                    console.log("apptoken:",apptoken);
                    console.log("userid", global.user_id_ls);
                    this.forceUpdate();
                  })
                   
              } 
              ).catch(error => console.log(error))
      }
      
       //finish order
      finish_order = () => {//这个地方看看会不会有permission的问题
        this.get_user_token().then( //global
          fetch('http://ec2-99-79-78-181.ca-central-1.compute.amazonaws.com:3000/order/finish', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              orderid: global.id_ls,
             }),
          }).then( (res)=>{
            fetch('http://ec2-99-79-78-181.ca-central-1.compute.amazonaws.com:3000/push', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
             token : global.apptoken, 
             message: "finished"
             }),
          }).then( (res)=>{
            global.id_ls = -1;
            global.content_ls = '';
            global.lat_ls = -1;
            global.lng_ls = -1;
            global.user_id_ls = -1;
            global.courier_id_ls = -1;
            global.apptoken = '';
          })
        })

        )
        
 
      }




    render() {   
      return (
        <View style = {styles.container}>
           
        
           <View style = {styles.btn}>
           <Button 
                onPress={() => { this.props.navigation.navigate('DashboardScreen') }}
                title='back'>
           </Button> 
            </View> 

          <View style = {styles.btn}>
           <Button 
                onPress={() => { this.props.navigation.navigate('CourierMap') }}
                title='Go to Map'>
           </Button>  
           </View>

        <View style = {styles.btn}>
        <Button 
                onPress={this.order_list_length.bind(this)}
                title='Get All Order'>
           </Button> 
         </View>

         <View style = {styles.btn}>
           <Button 
                onPress={this.accept_order.bind(this)}
                title='Accept Order'>
           </Button> 
        </View>
           
        <View style = {styles.btn}>
           <Button 
                onPress={this.finish_order.bind(this)}
                title='Finish Order'>
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
      backgroundColor: '#fff',
      justifyContent: 'space-between',
      alignItems: 'center',
      margin:40,
      padding: 10,
      flexDirection: 'column'
    },
    btn:{   
        borderWidth:1,  
        borderRadius:3, 
        margin: 10,
        padding: 10, 
        borderColor:"black",  
        backgroundColor:"yellow",  
        borderStyle: 'dotted'
    },
    text:{
      padding:20,
      borderWidth:1,  
      borderRadius:3, 
      backgroundColor: '#E0FFFF',
      borderStyle: 'dotted',
      fontSize: 20,
      fontWeight: 'bold'
    },
  });