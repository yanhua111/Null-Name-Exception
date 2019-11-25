/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
import React from 'react';
import { Text, View, Image } from 'react-native';
import { createAppContainer, createSwitchNavigator, createDrawerNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import AddressScreen from '../../screens/address';
import CourierMap from '../../screens/couriermap';
import CustomerScreen from '../../screens/customerscreen';
import OrderList from '../../screens/OrderList';
import OrderScreen from '../../screens/PlaceorderPage';
import Setting from '../../screens/setting';
import ChangeSetting from '../../screens/ChangeSetting';
import CustomerList from '../../screens/customerlist';
import HistoryOrder from '../../screens/HistoryOrder';
import OrderDetail from '../../screens/OrderDetail';
import placeNotFocused from '../../assets/placeNotFocused.png';
import placeFocused from '../../assets/placeFocused.png';
import settingFocused from '../../assets/settingFocused.png';
import settingNotFocused from '../../assets/settingNotFocused.png';
import orderNotFocused from '../../assets/orderNotFocused.png';
import orderFocused from '../../assets/orderFocused.png';

// import { setDetectionImagesAsync } from 'expo/build/AR';

export const CourierMapStack = createStackNavigator({
  CourierMap: CourierMap,
  OrderList: OrderList
},
{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false
  }
}
);

export const CustomerScreenStack = createStackNavigator({ // change here
  CustomerScreen: CustomerScreen,
  OrderScreen: OrderScreen,
  AddressScreen: AddressScreen
}, {
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false
  }
}
);

export const addressSwitch = createSwitchNavigator({
  AddressScreen: AddressScreen,
  OrderScreen: OrderScreen
});

export const PlaceOrderStack = createStackNavigator({
  PlaceOrder: OrderScreen,
  addressSwitch: addressSwitch
},
{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false
  }
}
);

export const SettingSwitch = createSwitchNavigator({
  Setting: Setting,
  ChangeSetting: ChangeSetting
});

export const CustomerListStack = createStackNavigator({
  CustomerList: { screen: CustomerList },
  HistoryOrder: { screen: HistoryOrder }
},
{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false
  }
});

export const OrderListStack = createStackNavigator({
  OrderList: { screen: OrderList },
  OrderDetail: { screen: OrderDetail }
}, {
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false
  }
}
);
export const CourierTabs = createBottomTabNavigator({
  // OrderList: { screen: OrderList },
  OrderList: OrderListStack,
  Map: CourierMap,
  // Setting:{screen : Setting},
  Setting: SettingSwitch

},
{
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      // eslint-disable-next-line no-unused-vars
      let IconComponent;
      let iconname;
      if (routeName === 'Map') {
        iconname = focused ? placeFocused : placeNotFocused;
        IconComponent = IconWithBadge;
      } else if (routeName === 'Setting') {
        iconname = focused ? settingFocused : settingNotFocused;
        IconComponent = IconWithBadge;
      } else if (routeName === 'OrderList') {
        iconname = focused ? orderFocused : orderNotFocused;
        IconComponent = IconWithBadge;
      }

      // You can return any component that you like here!
      return <IconComponent source = {iconname}/>;
    }
  }),
  tabBarOptions: {
    activeTintColor: 'tomato',
    inactiveTintColor: 'gray'
  }
});

class IconWithBadge extends React.Component {
  render () {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image source={this.props.source} style={{ width: 30, height: 30 }}/>
      </View>
    );
  }
}

export const CustomerTabs = createBottomTabNavigator({
  // CustomerScreen: {screen: CustomerScreen},
  // PlaceOrder      : PlaceOrderStack,
  // Setting:{screen : Setting},
  PlaceOrder: CustomerScreenStack,
  CustomerList: CustomerListStack, // {screen: CustomerList},
  Setting: SettingSwitch
},
{
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      let IconComponent;
      let iconname;
      if (routeName === 'PlaceOrder') {
        iconname = focused ? placeFocused : placeNotFocused;
        IconComponent = IconWithBadge;
      } else if (routeName === 'Setting') {
        iconname = focused ? settingFocused : settingNotFocused;
        IconComponent = IconWithBadge;
      } else if (routeName === 'CustomerList') {
        iconname = focused ? orderFocused : orderNotFocused;
        IconComponent = IconWithBadge;
      }

      // You can return any component that you like here!
      return <IconComponent source = {iconname}/>;
    }
  }),
  tabBarOptions: {
    activeTintColor: 'tomato',
    inactiveTintColor: 'gray'
  }
}
);

export const courierStack = createStackNavigator({
  CourierTabs: CourierTabs
  // CourierMapStack: CourierMapStack,
  // CourierMap: CourierMap,
},
{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false
  }
});

export const customerStack = createStackNavigator({
  CustomerTabs: CustomerTabs
},
{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false
  }
}
);
