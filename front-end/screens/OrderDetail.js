/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import '../global';
import { URL, PORT } from '../src/conf';
import TopBar from '../src/utils/TopBar';
import profilepic from '../assets/courier.png';
import despic from '../assets/destination.png';
import originpic from '../assets/origin.png';
import OrderView from '../src/utils/OrderView';
import dotpic from '../assets/dot.png';
import righticon from '../assets/arrow_right.png';
import CustomButton from '../src/utils/CustomButton';
import CustomLoading from '../src/utils/CustomLoading';

export default class OrderDetail extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      showloader: false
    };
  }

  /* Accept an order, update status, return error messages on error */
  accept_order = (order_id, acceptTime, courierPhone) => {
    fetch(`${URL}:${PORT}/order/accept`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        orderid: order_id,
        acceptTime: acceptTime,
        courierPhone: courierPhone
      })
    }).then(res => {
      res.json().then(result => {
        Alert.alert(result.message);
        this.props.navigation.navigate('OrderList');
      });
    });
  };

  finish_order = (order_id, userid, finishTime) => {
    Alert.alert(
      'Have you finished the order?',
      '',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Confirm',
          onPress: () => {
            this.setState({
              showloader: true
            });

            fetch(`${URL}:${PORT}/users/get_token`, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              credentials: 'include',
              body: JSON.stringify({
                // userid: global.user_id_ls,
                userid: userid
              })
            }).then((res) => {
              res.json().then(result => {
                const apptoken = result.data.apptoken;
                fetch(`${URL}:${PORT}/order/finish`, {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                  },
                  credentials: 'include',
                  body: JSON.stringify({
                    orderid: order_id,
                    finishTime: finishTime
                  })
                }).then(res => {
                  fetch(`${URL}:${PORT}/push`, {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                      token: apptoken,
                      message: 'You order has been finished!'
                    })
                  });
                  res.json().then(result => {
                    setTimeout(() => {
                      this.setState({
                        showloader: false
                      });
                      if (result.errno == 0) {
                        this.props.navigation.navigate('OrderList');
                      } else {
                        Alert.alert(result.message);
                      }
                    }, 300);
                  });
                });
              });
            });
          }
        }
      ],
      { cancelable: false }
    );
  };

  getPlaceTime = () => {
    const today = new Date();
    const time =
      today.getFullYear() +
      '/' +
      (today.getMonth() + 1) +
      '/' +
      today.getDate() +
      ' ' +
      today.getHours() +
      ':' +
      today.getMinutes();
    return time;
  };

  render () {
    const locFrom = this.props.navigation.getParam('locFrom', '');
    const locTo = this.props.navigation.getParam('locTo', '');
    var status = this.props.navigation.getParam('status', '');
    const id = this.props.navigation.getParam('id', '');
    const detail = this.props.navigation.getParam('detail', '');
    const time = this.props.navigation.getParam('time', '');
    const userid = this.props.navigation.getParam('userid', '');
    const courierPhone = this.props.navigation.getParam('courierPhone', '');
    const customerPhone = this.props.navigation.getParam('customerPhone', '');
    const fee = this.props.navigation.getParam('fee', '');
    const placeTime = this.props.navigation.getParam('placeTime', '');
    const acceptTime = this.props.navigation.getParam('acceptTime', '');
    const finishTime = this.props.navigation.getParam('finishTime', '');

    return (
      <View style={styles.container}>
        <CustomLoading visible={this.state.showloader} />
        <TopBar
          onBackPress={() => {
            if (global.role == 'courier') {
              this.props.navigation.navigate('OrderList');
            } else {
              this.props.navigation.navigate('CustomerList');
            }
          }}
        >
          Order Detail
        </TopBar>
        <OrderView
          locFrom={locFrom}
          locTo={locTo}
          status={status}
          righticon={righticon}
          id={id}
          detail={detail}
          time={time}
          courierPhone={courierPhone}
          customerPhone={customerPhone}
          fee={fee}
          placeTime={placeTime}
          acceptTime={acceptTime}
          finishTime={finishTime}
          rich={true}
        />
        {status == 1 && (
          <CustomButton
            content="Accept"
            style={{ backgroundColor: 'red' }}
            onPress={() =>
              this.accept_order(id, this.getPlaceTime(), global.phoneNum)
            }
          />
        )}
        {status == 0 && (
          <CustomButton
            content="Finish"
            style={{ backgroundColor: '#f55442' }}
            onPress={() => this.finish_order(id, userid, finishTime)}
          />
        )}

        <CustomButton
          content="Cancel"
          style={{ backgroundColor: 'blue' }}
          onPress={() => this.props.navigation.navigate('OrderList')}
          whitefont={true}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  }
});
