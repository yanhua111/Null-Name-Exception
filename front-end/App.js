import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createAppContainer} from "react-navigation";
import {createBottomTabNavigator,} from 'react-navigation-tabs';


import CustomerScreen from "./screens/customerscreen";
import CourierScreen from "./screens/courierscreen";
import CourierMap from "./screens/couriermap";
import PlaceorderPage from './screens/PlaceorderPage';
import AddressPage from './screens/address';
import OrderList from "./screens/OrderList";
import Setting from "./screens/setting";
import OpenPage from "./screens/OpenPage";

export default class App extends React.Component {
  render() {
    return <AppNavigator />;
  }
}


const APPNavigator = createAppContainer(
  createBottomTabNavigator(
    {
      OpenPage: {screen: OpenPage},
      Setting:  {screen: Setting},
      OrderList: {screen: OrderList},
      OrderScreen:{screen: OrderScreen},
      OrderScreen: {PlaceorderPage},
      CustomerScreen: { screen: CustomerScreen},
      CourierScreen: {screen: CourierScreen},
      CourierMap: {screen: CourierMap},
      AddressPage:{screen: AddressPage},
    },
 
  )
);