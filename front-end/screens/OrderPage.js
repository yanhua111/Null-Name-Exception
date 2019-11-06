import React from "react";
import {
    StyleSheet, Text, Image, View, Button, TextInput,
    PanResponder, TouchableOpacity, TimePickerAndroid, Alert, ToastAndroid
} from "react-native";
import MapView, { AnimatedRegion, Marker } from "react-native-maps";
import SocketIOClient from "socket.io-client";
import Modal from "react-native-modal";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { URL, PORT, WebSocketPORT, APIKEY } from '../src/conf'



export default class OrderScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user_text: "",
            position: {
                latitude: 49.267941,
                longitude: -123.247360,
                latitudeDelta: 0.00922,
                longitudeDelta: 0.0200
            },
            orderTime: {
                hour: -1,
                minute: -1
            },
        };
    }

    /* Update position set by user */
    setPosition = (position) => {
        this.setState({
            position: {
                latitude: position.latitude,
                longitude: position.longitude,
                latitudeDelta: 0.00922,
                longitudeDelta: 0.00200
            }
        });
    }

    /* place order handler */
    get_order_info = () => {
        if (this.state.user_text === "") {
            Alert.alert('Invalid order', 'Please enter order content!');
            return;
        }
        if (this.state.orderTime.hour === -1) {
            Alert.alert('Invalid order', 'Please enter a time!');
            return;
        }
        navigator.geolocation.getCurrentPosition((position) => {
            this.place_order(position.coords.latitude, position.coords.longitude, `${this.state.orderTime.hour}:${this.state.orderTime.minute}:00`);
        }, (err) => console.log(err));
    }

    /* place a order */
    place_order = (lat, lng, time) => {
        fetch(`${URL}:${PORT}/order/place`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                content: this.state.user_text,
                lat: lat,
                lng: lng,
                time: time
            }),
        }).then(() => {
            this.setState({ showOderInfo: false });
            ToastAndroid.showWithGravityAndOffset(
                'Order Placed!',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            );
        })
    }



    /* Time picker */
    async pickTime() {
        try {
            const { action, hour, minute } = await TimePickerAndroid.open({
                hour: 14,
                minute: 0,
                is24Hour: false, // Will display '2 PM'
            });
            if (action !== TimePickerAndroid.dismissedAction) {
                this.setState({
                    orderTime: {
                        hour: hour,
                        minute: minute
                    }
                })
            }
        } catch ({ code, message }) {
            console.warn('Cannot open time picker', message);
        }
    }

    render() {
        // let handles = this.state.panResponder.panHandlers;
        return (
            <View style={styles.container}>
                <View style={styles.searchBar}>
                    <GooglePlacesAutocomplete
                        placeholder='Enter Location'
                        minLength={2}
                        autoFocus={false}
                        returnKeyType={'default'}
                        fetchDetails={true}

                        query={{
                            // available options: https://developers.google.com/places/web-service/autocomplete
                            key: APIKEY,
                            language: 'en', // language of the results
                            // types: '(cities)' // default: 'geocode'
                        }}

                        styles={{
                            textInputContainer: {
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
                                color: '#1faadb'
                            },
                        }}
                        currentLocation={false}
                    />
                </View>

                <View style={{ position: "absolute", bottom: 200, alignSelf: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", color: 'white', marginVertical: 20 }}>Enter Order Information</Text>
                    <TextInput
                        placeholder="Order Information"
                        underlineColorAndroid={"transparent"}
                        onChangeText={(user_text) => this.setState({ user_text })}
                        style={{ marginVertical: 20 }} />
                    <Button title="Cancel" onPress={this.toggleModal} />
                    <Button title="Pick a time"
                        onPress={this.pickTime.bind(this)} />
                    <Button title="Place!"
                        onPress={this.get_order_info.bind(this)} />
                </View>

                <View style={{ position: "absolute", top: 50, height: 60, marginVertical: 20 }}>
                    <Button
                        onPress={() => { this.props.navigation.navigate("DashboardScreen"); }}
                        title="back"
                        color="green">
                    </Button>
                </View>
                <View style={{ position: "absolute", top: 100, height: 100, marginVertical: 20 }}>
                    <Button
                        onPress={this.toggleModal}
                        title="Place Order"
                        color="#ff9900">
                    </Button>
                </View>
            </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        padding: 0,
    },
    searchBar: {
        position: "absolute",
        top: 20,
        alignSelf: 'center',
        borderRadius: 10,
        width: '80%',
        height: '50%'
    },
});