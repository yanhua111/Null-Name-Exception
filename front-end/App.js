import React from 'react';
import { Button, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
// import {createStackNavigator,} from 'react-navigation-stack';
import {createBottomTabNavigator,} from 'react-navigation-tabs';

//import DashboardScreen from "./screens/dashboard";
//import  {DashBoardStack } from "./screens/dashboard";
//import CourierScreen from "./screens/courierscreen";
//import OpenPage from "./screens/OpenPage";
import CustomerScreen from "./screens/customerscreen";
import CourierMap from "./screens/couriermap";
import OrderList from "./screens/OrderList";
import Setting from "./screens/setting";
import OrderScreen from "./screens/PlaceorderPage";
import AddressScreen from "./screens/address";
import {CourierMapStack} from "./screens/couriermap";
import {CustomerStack} from "./screens/customerscreen";
import {PlaceOrderStack} from "./screens/PlaceorderPage";
import {courierStack} from "./src/utils/navigators";
import {customerStack} from "./src/utils/navigators";
///////////////
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import phonemodeScreen from "./screens/phonemodeScreen";

export default class App extends React.Component {
  render() {
    return <APPNavigator/>;
  }
}


const APPNavigator = createAppContainer(
  createSwitchNavigator({
      OpenPage: {screen: OpenPage},
      courierStack: courierStack,
      customerStack: customerStack,
    /////////
  LoginScreen: LoginScreen,
  SignupScreen: SignupScreen,
  phonemodeScreen: phonemodeScreen,
  })
)





