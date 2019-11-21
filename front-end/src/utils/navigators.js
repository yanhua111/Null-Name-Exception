import { createAppContainer, createSwitchNavigator,createDrawerNavigator} from 'react-navigation';
import {createStackNavigator,} from 'react-navigation-stack';
import {createBottomTabNavigator,} from 'react-navigation-tabs';

import AddressScreen from "../../screens/address";
import CourierMap from "../../screens/couriermap";
import CustomerScreen from "../../screens/customerscreen";
import OpenPage from "../../screens/OpenPage";
import OrderList from "../../screens/OrderList";
import OrderScreen from "../../screens/PlaceorderPage";
import Setting from "../../screens/setting";
// import { setDetectionImagesAsync } from 'expo/build/AR';

export const CourierMapStack = createStackNavigator({
    CourierMap: CourierMap,
    OrderList: OrderList ,
  });


  export const CustomerScreenStack = createStackNavigator({
    OrderList: OrderList ,
  });



  export const addressSwitch = createSwitchNavigator({ 
    AddressScreen: AddressScreen,
    OrderScreen: OrderScreen ,
  });

  export const PlaceOrderStack = createStackNavigator({
    PlaceOrder: OrderScreen,
    addressSwitch: addressSwitch
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
   }
  );

  export const SettingSwitch = createSwitchNavigator({ 
    Setting: Setting,
    OpenPage: OpenPage,
  });


  export const CourierTabs = createBottomTabNavigator({
      OrderList: {screen: OrderList},
      Map      : CourierMap,
      Setting:{screen : Setting},
     
  });

  export const CustomerTabs = createBottomTabNavigator({
    CustomerScreen: {screen: CustomerScreen},
     PlaceOrder      : PlaceOrderStack,
    //PlaceOrder      : OrderScreen,
    Setting:{screen : Setting},
   
});

export const courierStack = createStackNavigator({
  CourierTabs : CourierTabs,
  CourierMapStack: CourierMapStack,
  //CustomerScreenStack: CustomerScreenStack,
  CourierMap: CourierMap,
  //setting: Setting,
 
},
{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
 })

export const customerStack = createStackNavigator({
  CustomerTabs: CustomerTabs,
},
{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
 }
 )



