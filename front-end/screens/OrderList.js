import React from "react";
import { Modal,StyleSheet,SafeAreaView, FlatList, Text, View,Button, Alert,ScrollView, RefreshControl,TouchableOpacity,} from "react-native";
import "../global";
import { URL, PORT } from '../src/conf';


export default class OrderList extends React.Component {
   
     state = { 
       refreshing: false,
       myArray: [],
     }
     
      componentDidMount() {
        this.list_order();
      }

    /* This function list_order is triggered by button of each order.
    Every small order is a button, when pressed, it will give us the 
    detailed information. This function help us to get all the information
    from back end database
    */
     
    list_order = () => {
        
        fetch(`${URL}:${PORT}/order/list`, {
                method: "GET",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                credentials: "include",
              }).then((res) => {
                  res.json().then(result =>{
                    console.log(result);
                    for(j = 0; j < result.data.list.length; j++){
                      var joined = this.state.myArray.concat(result.data.list[j]);
                      this.setState({ myArray: joined });
                    }
                    console.log(this.state.myArray);
                  })
              } 
              ).catch((error) => console.log(error));
  
        }


     onClearArray = () => {
           this.setState({ myArray: [] });
        };

      onRefresh = () => {
        this.setState({refreshing: true});
        this.onClearArray();
        this.list_order();
        this.setState({refreshing: false});
      }
      
      _onEndReached = () => {
        console.log("on end reached");
       // this.state.reachedEnd =  true;
       this.setState({reachedEnd : true});
      // this.forceUpdate();
        console.log(this.state.reachedEnd);
       
     }

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
 
   
    accept_order = (order_id) => {
      if(this.state.myArray[order_id].status == 1){
        Alert.alert("This order is already accepted");
      }else{
      fetch(`${URL}:${PORT}/order/accept`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
               orderid: order_id, //????????????
               }),
            });
            Alert.alert("successfully accepted");
          }
    }

    get_user_token = (userid) => {
      return fetch(`${URL}:${PORT}/users/get_token`, {
               method: "POST",
               headers: {
                 Accept: "application/json",
                 "Content-Type": "application/json",
               },
               credentials: "include",
               body: JSON.stringify({
                 //userid: global.user_id_ls,
                 userid: userid
                 }),
             }).then((res) => {
                 res.json().then((result) => {
                   global.apptoken = result.data.apptoken;
                   this.forceUpdate();
                 });
                  
             } 
             ).catch((error) => console.log(error));
     }
     

    finish_order = (order_id,userid) => {
      this.get_user_token(userid).then( 
        fetch(`${URL}:${PORT}/order/finish`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            orderid: order_id,
           }),
        }).then( (res)=>{
          fetch(`${URL}:${PORT}/push`, {
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
        })
      
      })

      );
    }

     _renderItem = ({item}) => (
      <View>
        {item.status === 1?<Text style = {styles.text}>content={item.content} | placed</Text>:(item.status === 0?<Text style = {styles.text}>content={item.content} | accepted</Text>:<Text style = {styles.text}>content={item.content} | finished</Text>)}
        <View style = {styles.btn}>
        <Button title =  {`order ${item.id} accept above order`} onPress = {()=>this.accept_order(item.id)}></Button>
        </View>  
        <View style = {styles.btn}>
        <Button title =  {"Finish this order"} onPress = {()=>this.finish_order(item.id,item.userid)}></Button>
        </View>  
      </View>
      
    );
   
      render() {
        return (
          <SafeAreaView style={styles.container}>
          <FlatList
            data={this.state.myArray}
            extraData={this.state}
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.refreshing}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
          />
        </SafeAreaView>
        );
      }    
   }

   const ListItem = ({ title }) => (
    <View>
      <Text>{title}</Text>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
     // justifyContent: "space-between",
      alignItems: "flex-start",
      margin:0,
      padding: 40,
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
    contentContainer: {
        paddingVertical: 20
      },
      item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
      },
      title: {
        fontSize: 32,
      },
  });
  