import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  Text,
  View,
  Button,
  Alert,
  Image,
  TouchableOpacity
} from "react-native";
import "../global";
import { URL, PORT } from "../src/conf";
import TopBar from "../src/utils/TopBar";
import profilepic from "../assets/courier.png";
import despic from "../assets/destination.png";
import originpic from "../assets/origin.png";
import OrderView from "../src/utils/OrderView";
import dotpic from "../assets/dot.png";
import righticon from "../assets/arrow_right.png";



export default class HistoryOrder extends React.Component{
   
   
 state = { 
    refreshing: false,
    myArray: [],
  }

  componentDidMount() {
    this.get_history_order();
  }

  return_order = () => {
    return this.myArray;
  };

get_history_order = () => {
        
    fetch(`${URL}:${PORT}/order/order_history`, { 
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
      this.setState({ refreshing: true });
      this.onClearArray();
      this.list_order();
      this.setState({ refreshing: false });
    };
  
    _onEndReached = () => {
      console.log("on end reached");
      // this.state.reachedEnd =  true;
      this.setState({ reachedEnd: true });
      // this.forceUpdate();
      console.log(this.state.reachedEnd);
    };
  
    
    _renderItem = ({ item }) => (
  
      <OrderView
      profilepic = {profilepic}
      originpic = {originpic}
      locFrom = {item.locFrom}
      dotpic = {dotpic}
      despic = {despic}
      locTo = {item.locTo}
      status = {item.status}
      righticon = {righticon}
      />
    );
  
    render() {
      return (
        <SafeAreaView style={styles.container}>
          <View>
            <TopBar showback={true}
             onBackPress={() => {
              this.props.navigation.navigate("CustomerList");
            }}>History Order</TopBar>
          </View>
          <FlatList
           // style={{ marginTop: 100 }}
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
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      margin: 0,
      flexDirection: "column",
    },
    order: {
      width: "90%",
      alignSelf: "center",
      backgroundColor: "white",
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderRadius: 5,
      borderColor: "grey",
      height: 200,
      flexDirection: "row",
      marginBottom: 20,
      elevation: 10,
      shadowOffset: { width: 1, height: 1 },
      shadowColor: "black",
      shadowOpacity: 1.0,
      borderBottomWidth: 1,
      justifyContent: "flex-start"
    },
    locContainer: {
      flexDirection: "column",
      marginTop: 20,
      justifyContent: "space-around"
    },
    locLine: {
      flexDirection: "row",
      width: 200,
      marginVertical: 2,
      flexShrink: 1
    },
    dotpic: {
      width: 20,
      height: 30
    },
    smallpic: {
      width: 20,
      height: 20,
      marginRight: 2
    },
    largepic: {
      width: 50,
      height: 50,
      marginTop: 100
    },
    optionContainer: {
      flex: 1,
      height: 30,
      alignItems: "flex-end",
      flexDirection: 'column'
    },
    profilepic: {
      width: 50,
      height: 50,
      borderRadius: 5,
      borderWidth: 1,
      backgroundColor: "white",
      borderColor: "grey",
      marginRight: 10
    }
  });
  

