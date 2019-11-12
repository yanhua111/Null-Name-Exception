import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

import LoginScreen from "./screens/login_screen";
import DashboardScreen from "./screens/dashboard";
import CustomerScreen from "./screens/customerscreen";
import CourierScreen from "./screens/courierscreen";
import CourierMap from "./screens/couriermap";
import OrderScreen from './screens/OrderPage';
import AddressPage from './screens/address';


export default class App extends React.Component {
  render() {
    return <AppNavigator />;
  }
}
/* Navigation between each map
*/
const AppSwitchNavigator = createSwitchNavigator({
  LoginScreen: LoginScreen,
  DashboardScreen: DashboardScreen,
  CourierScreen: CourierScreen,
  CustomerScreen: CustomerScreen,
  CourierMap: CourierMap,
  OrderScreen: OrderScreen,
  AddressPage: AddressPage
});

const AppNavigator = createAppContainer(AppSwitchNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});