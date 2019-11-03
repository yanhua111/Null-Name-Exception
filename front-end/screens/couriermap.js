import React from 'react';
import { StyleSheet, Text, View,Button,TextInput,Alert } from 'react-native';
import MapView, {AnimatedRegion, Marker, ProviderPropType} from 'react-native-maps';
import SocketIOClient from 'socket.io-client';
import runicon from '/Users/wangxiaogou/goodProject/assets/run.png';


const LATITUDE = 49.267941;
const LONGITUDE = -123.247360;
let interval;

export default class CourierMap extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
    apptoken:'',
    user_text: '',
    region: {
      latitude: 49.267941,
      longitude: -123.247360,
      latitudeDelta: 0.00922,
      longitudeDelta: 0.00200
    },
    text: '',
    coordinate: new AnimatedRegion({
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: 0,
      longitudeDelta: 0
    }),   
    }
    this.socket = SocketIOClient('http://ec2-99-79-78-181.ca-central-1.compute.amazonaws.com:8000');
    this.socket.emit('locationIn', JSON.stringify({lat: 12.35, lng: 23.45})); // emits 'hi server' to your server
    this.socket.on('locationOut', (data) => {
      console.log(JSON.parse(data.location))
      let location = {
        latitude:JSON.parse(data.location).lat, 
        longitude: JSON.parse(data.location).lng};
      this.setPosition(location)
      this.animate(location)
    });
  }

//   get_user_token = (id) => {
//         fetch('http://ec2-99-79-78-181.ca-central-1.compute.amazonaws.com:3000/users/get_token', {
//                 method: 'POST',
//                 headers: {
//                   Accept: 'application/json',
//                   'Content-Type': 'application/json',
//                 },
//                 credentials: 'include',
//               }).then((res) => {
//                   this.apptoken = res.json()[id].apptoken;//这里看看这个id可能会有错
//                   this.forceUpdate();
//               } 
//               ).catch(error => console.log(error))
//       }
      
//        //finish order
//       finish_order (){//这个地方看看会不会有permission的问题
//         this.get_user_token(this.id_ls);
//         fetch('http://ec2-99-79-78-181.ca-central-1.compute.amazonaws.com:3000/push/token', {
//                 method: 'POST',
//                 headers: {
//                   Accept: 'application/json',
//                   'Content-Type': 'application/json',
//                 },
//                 credentials: 'include',
//                 body: JSON.stringify({
//                  token : this.apptoken, 
//                  message: "finished"
//                  }),
//               })
//       }

  //map goes here
  componentDidMount (){
    interval = setInterval(() => {
      this.getUserlocHandler();
  }, 1000);
  }

  componentWillUnmount() {
    clearInterval(interval);
  }

  getUserlocHandler = () => {
    navigator.geolocation.getCurrentPosition(position=> {
      this.socket.emit('locationIn', JSON.stringify({lat: position.coords.latitude, lng: position.coords.longitude}));
    }, err => console.log(err))
  }

  setPosition = (position) => {
    // console.log(position.latitude)
    console.log(position.longitude)
    this.setState({
      region: {
        latitude: position.latitude,
        longitude: position.longitude,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.00200
      }
    })
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  moveMarker() {
    this.marker._component.animateMarkerToCoordinate({
      latitude: 60.267941,
      longitude: -123.247360
    } ,500)
  }

  animate(location) {
    const { coordinate } = this.state;
    const newCoordinate = {
      latitude: location.latitude,  //+ Math.random(),
      longitude: location.longitude  //+ Math.random()
    };

    coordinate.timing(newCoordinate).start();
}


  

  
    render() {
      return (
        <View style = {styles.container}>
           <MapView 
        provider={this.props.provider}
        region={this.state.region} 
        onRegionChange={()=>this.onRegionChange}
        style ={{flex:1}} >
           <Marker.Animated
            ref={marker => {
              this.marker = marker;
            }}
            coordinate={this.state.coordinate}
            image = {runicon}
          />
        </MapView>
        <Button style={{position: "absolute", bottom: 10}}
                onPress={() => { this.props.navigation.navigate('CourierScreen') }}
                title='back to courier screen'>
           </Button>  

        {/* <View style = {styles.btn}>
           <Button 
                onPress={this.finish_order.bind(this)}
                title='Finish Order'>
           </Button> 
        </View> */}
      </View>
      );
    }
  
  
  }

  CourierMap.propTypes = {
    provider: ProviderPropType,
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
      padding: 0,
      margin: 0
    },
    btn:{   
        borderWidth:1,  
        borderRadius:3, 
        margin: 10,
        padding: 10, 
        borderColor:"black",  
        backgroundColor:"yellow",  
        borderStyle: 'dotted'
    },
  });


