import React from 'react';
import { StyleSheet, Text, View , Image , Dimensions} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Login from './component/Login';
import Scandata from './component/Scandata';
import Scanner from './component/Scanner';
import * as SecureStore from 'expo-secure-store';
class App extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
      super(props);
      SecureStore.getItemAsync('userdata').then(result=>{
        if(result){
          this.props.navigation.replace('Scanner');
        }
        else{
          this.props.navigation.replace('Login');
        }
      }).catch(err =>{
        this.props.navigation.replace('Login');
      })
  }
  render() {
    return (
        <View style={{flex: 1, backgroundColor: '#f2f2f2',}}>
          <Image style={{width:Dimensions.get('screen').width,height:Dimensions.get('screen').height}} source={require('./assets/splash.png')} />
        </View>
    )
  }
}
const AppNavigator = createStackNavigator(
  {
  Home: { screen: App },
  Login: { screen: Login },
  Scandata: { screen: Scandata },
  Scanner: { screen: Scanner },
  },
  {
    initialRouteName: 'Home',
  }
);
export default createAppContainer(AppNavigator);
