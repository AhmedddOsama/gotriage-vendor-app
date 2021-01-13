import React, { Component } from 'react';
import { Text, View, StyleSheet ,Image , Dimensions,TouchableOpacity} from 'react-native';
import { Button } from 'react-native-elements';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { LinearGradient } from 'expo-linear-gradient';
import { HeaderBackButton } from 'react-navigation-stack';
import * as SecureStore from 'expo-secure-store';
const deviceWidth  =  Dimensions.get('window').width;
const deviceHeight =  Dimensions.get('window').height;
const GradientBtn = ({ name }) => (
    <LinearGradient
        colors={['#5f0191', '#9f1f63']}
        style={styles.GradientView}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
    >
    <Text style={styles.GradientViewTxt}>{name}</Text>
    </LinearGradient>
    )
export default class Scanner extends Component {
    static navigationOptions = ({navigation}) =>{
        return {
            headerBackground: (
            <LinearGradient colors={['#5f0191', '#9f1f63']} style={{ flex: 1 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
            ),
            headerLeft: (<View></View>),
            headerRight: (
            <TouchableOpacity onPress={() => { SecureStore.deleteItemAsync('userdata'); navigation.replace('Login');}}>
                <Text style={{color:'white',padding:10}}>Sign Out</Text>
            </TouchableOpacity>
            ),
            headerTitleStyle: { color: '#fff' },
            title: 'QR SCANNER'
        }
    }
    signout=()=>{
        SecureStore.setItemAsync("userdata",null);
        this.props.navigation.replace('Login');
        
    }
    state = {
        hasCameraPermission: null,
        scanned: false,
    };
    
    async componentDidMount() {
        this.getPermissionsAsync();
    }
    
    getPermissionsAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    handleBarCodeScanned = ({ type, data }) => {
        this.setState({ scanned: true });
        var scandata=[];
        if(data){
            if(data[0]!='{'){
                scandata=data;
            }
            else{
                scandata=JSON.parse(data);
            }
            if(scandata.userId && scandata.toRedeem && scandata.vendorId && scandata.OfferID && scandata.offerName){
                this.props.navigation.navigate('Scandata',{scandata:scandata});
            }
            else{
                alert('Not a Valid QR Code');
            }
        }
    };
    render() {
        const { hasCameraPermission, scanned } = this.state;

        if (hasCameraPermission === null) {
        return <Text>Requesting for camera permission</Text>;
        }
        if (hasCameraPermission === false) {
        return <Text>No access to camera</Text>;
        }
        return (
            <View style={styles.MainContainer}>
                <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
                style={{width:deviceWidth,height:deviceHeight,marginTop:-60}}
                />
                <View style={{width:'100%',height:'100%',position:'absolute',top:'25%',left:'25%'}}>
                    <Image style={{width:200,height:200}} source={require('../assets/scannerimg.png')} />
                </View>
                {scanned && (
                <View style={styles.SignInBtnView}>
                    <TouchableOpacity style={styles.wrapper} onPress={() => this.setState({ scanned: false })}>
                        <GradientBtn name="Tap to Scan Again" />
                    </TouchableOpacity>
                </View>
                )} 
            </View>
        )
    }
}
const styles = StyleSheet.create({
    MainContainer:{
        flex:1,
    },
    SignInBtnView:{
        position:'absolute',
        bottom:0,
        width:'100%'
    },
    wrapper: {
        height: 60,
      },
      GradientView:{
        flex: 1, 
        paddingTop: 15, 
        borderRadius: 5
    },
    GradientViewTxt:{
        fontSize: 18, 
        fontWeight: "800", 
        color: 'white', 
        textAlign: 'center', 
    },
  })