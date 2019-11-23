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
import ChangeSetting from "../../screens/ChangeSetting";
import CustomerList from "../../screens/customerlist";
import HistoryOrder from "../../screens/HistoryOrder";

// import { setDetectionImagesAsync } from 'expo/build/AR';

export const CourierMapStack = createStackNavigator({
    CourierMap: CourierMap,
    OrderList: OrderList ,
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
   }
  );


  export const CustomerScreenSwitch = createSwitchNavigator({ //change here
    CustomerScreen :CustomerScreen,
    OrderScreen: OrderScreen,
    AddressScreen: AddressScreen,
  },{
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
   }
  );



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
    ChangeSetting: ChangeSetting,
  });
  
  export const CustomerListStack = createStackNavigator({
    CustomerList: {screen: CustomerList},
    HistoryOrder: {screen: HistoryOrder},
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
   })

  export const CourierTabs = createBottomTabNavigator({
      OrderList: {screen: OrderList},
      Map      : CourierMap,
      //Setting:{screen : Setting},
      Setting:  SettingSwitch,
     
  });

  export const CustomerTabs = createBottomTabNavigator({
    //CustomerScreen: {screen: CustomerScreen},
    // PlaceOrder      : PlaceOrderStack,
    //Setting:{screen : Setting},
    PlaceOrder:CustomerScreenSwitch,
    CustomerList:CustomerListStack, //{screen: CustomerList},
    Setting:  SettingSwitch,
});
  
   

export const courierStack = createStackNavigator({
  CourierTabs : CourierTabs,
  //CourierMapStack: CourierMapStack,
  //CourierMap: CourierMap,
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



