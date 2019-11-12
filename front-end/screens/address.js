/* eslint-disable camelcase */
import React from 'react';
import {
  StyleSheet, Image, View, TouchableOpacity
} from 'react-native';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { APIKEY } from '../src/conf';
import backicon from '../assets/back.png';
import searchIcon from '../assets/search.png';
import confirmIcon from '../assets/confirm.png';
import TopBar from '../src/utils/TopBar.js';

export default class OrderScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user_text: 'Please enter adress...',
      lat: 0,
      lng: 0
    };
  }

  render () {
    const selection = this.props.navigation.getParam('selection', 'NO SELECTION');
    const locFrom = this.props.navigation.getParam('locFrom', 'NO SELECTION');
    const locTo = this.props.navigation.getParam('locTo', 'NO SELECTION');
    /* Saving lat, lng passed from order page */
    const fromLat = this.props.navigation.getParam('fromLat', 0);
    const fromLng = this.props.navigation.getParam('fromLng', 0);
    const toLat = this.props.navigation.getParam('toLat', 0);
    const toLng = this.props.navigation.getParam('toLng', 0);
    return (
      <View style={styles.container}>
        {/* <View style={styles.topBar}>
          <TouchableOpacity style={styles.backbtn}
            onPress={() => {
              this.props.navigation.navigate('OrderScreen', {
                locFrom: locFrom,
                fromLat: fromLat,
                fromLng: fromLng,

                locTo: locTo,
                toLat: toLat,
                toLng: toLng
              });
            }} >
            <Image source={backicon} style={styles.icon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.confirmBtn}
            onPress={() => {
              this.props.navigation.navigate('OrderScreen', {
                locFrom: (selection === 'from') ? this.state.user_text : locFrom,
                fromLat: (selection === 'from') ? this.state.lat : fromLat,
                fromLng: (selection === 'from') ? this.state.lng : fromLng,

                locTo: (selection === 'to') ? this.state.user_text : locTo,
                toLat: (selection === 'to') ? this.state.lat : toLat,
                toLng: (selection === 'to') ? this.state.lng : toLng
              });
            }} >
            <Image source={confirmIcon} style={styles.icon} />
          </TouchableOpacity>
        </View> */}
        <TopBar onPress={() => {
          this.props.navigation.navigate('OrderScreen', {
            locFrom: locFrom,
            fromLat: fromLat,
            fromLng: fromLng,

            locTo: locTo,
            toLat: toLat,
            toLng: toLng
          });
        }}>
          Enter Address
        </TopBar>
        <View style={styles.searchBar}>
          <GooglePlacesAutocomplete
            placeholder={this.state.user_text}
            minLength={2}
            autoFocus={true}
            returnKeyType={'default'}
            fetchDetails={true}
            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
              console.log(details.geometry.location);
              this.setState({
                user_text: details.name,
                lat: details.geometry.location.lat,
                lng: details.geometry.location.lng
              });
            }}
            isRowScrollable={true}
            textInputProps={{
              onChangeText: (user_text) => this.setState({ user_text })
            }}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: APIKEY,
              language: 'en' // language of the results
              // types: '(cities)' // default: 'geocode'
            }}
            currentLocation={true}
            currentLocationLabel="Current location"
            styles={{
              textInputContainer: {
                borderColor: 'grey',
                borderRadius: 5,
                width: '100%',
                backgroundColor: 'white',
                borderTopWidth: 0,
                borderBottomWidth: 0
              },
              textInput: {
                marginLeft: 0,
                marginRight: 0,
                height: 38,
                color: '#5d5d5d',
                fontSize: 16
              },
              predefinedPlacesDescription: {
                color: '#1faadb',
                height: 100
              }
            }}
            renderLeftButton={() => <Image style={styles.searchIcon} source={searchIcon} />}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // justifyContent: "center",
    flexDirection: 'column',
    padding: 0
  },
  topBar: {
    position: 'absolute',
    backgroundColor: 'white',
    marginBottom: 20,
    width: '100%',
    height: 80,
    borderColor: 'grey',
    borderBottomWidth: 1,
    shadowOffset: { width: 10, height: 10 },
    shadowColor: 'black',
    shadowOpacity: 1.0,
    elevation: 10
  },
  backbtn: {
    position: 'absolute',
    top: 40,
    left: 10
  },
  confirmBtn:{
    position: 'absolute',
    top: 40,
    right: 20
  },
  icon: {
    width: 30,
    height: 30
  },
  searchIcon: {
    width: 30,
    height: 30,
    marginVertical: 10,
    marginHorizontal: 10
  },
  searchBar: {
    position: 'absolute',
    top: 80,
    marginVertical: 20,
    borderColor: 'grey',
    borderTopWidth: 2,
    borderRadius: 5,
    width: '100%',
    height: 500
  }
});
