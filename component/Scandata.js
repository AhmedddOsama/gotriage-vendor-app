import React, { Component } from 'react'
import { Text, View , StyleSheet , TouchableOpacity,Alert} from 'react-native'
import { Input } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import { HeaderBackButton } from 'react-navigation-stack';
import axios from 'react-native-axios';
import * as SecureStore from 'expo-secure-store';
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
export default class Scandata extends Component {
    static navigationOptions = ({navigation}) =>{
        return {
            headerBackground: (
            <LinearGradient colors={['#5f0191', '#9f1f63']} style={{ flex: 1 }} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
            ),
            headerLeft: (<HeaderBackButton tintColor={'white'} onPress={() => {navigation.goBack()}}/>),
            headerRight: (
            <TouchableOpacity onPress={() => { SecureStore.deleteItemAsync('userdata'); navigation.replace('Login');}}>
                <Text style={{color:'white',padding:10}}>Sign Out</Text>
            </TouchableOpacity>
            ),
            headerTitleStyle: { color: '#fff' },
            title: 'QR SCAN DATA',
            headerBackStyle:'#ffffff'
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            userdata:[],
            scandata:[]
        }
        SecureStore.getItemAsync('userdata').then(result=>{
            this.state.userdata=JSON.parse(result);
            if(result!=null){
                this.setState({userdata:this.state.userdata});
                this.setState({scandata:this.props.navigation.getParam('scandata','')});
            }
            else{
                alert('User Data not found');
            }
        });
    }
    signout=()=>{
        SecureStore.setItemAsync("userdata",null);
        this.props.navigation.replace('Login');
    }
    submit=()=>{
        var body={
            userId: this.state.scandata.userId,
            offerId: this.state.scandata.OfferID,
        }
          axios.post('https://gotapis.gotriage.com/api/userRedeemedPoints/qrReader',body,{
            headers: { 'content-type': 'application/json', Authorization: this.state.userdata.id}
          }
          )
          .then(response =>{
              if(response.data.statusCode==405){
                alert(response.data.messsage);
              }
              else{
                Alert.alert(
                'Success',
                'Points Reedemed Successfully',
                [
                    {text: 'OK', onPress: () => {this.props.navigation.goBack();}},
                ]
                );
              }
          })
          .catch(error =>{
            if(error.response.status==401){
                alert('Token expired. Please login again.');
                SecureStore.setItemAsync("userdata",null);
                this.props.navigation.replace('Login');
            }
            else{
                alert('Network Error');
            }
          });
    }
    render() {
        return (
            <View style={styles.MainContainer}>
                {(this.state.scandata.length!=0)&&(
                    <>
                    <Text style={styles.LoginTxt}>Scan Data</Text>
                    <Text style={styles.inputfieldtxt}>User ID</Text>
                    <View style={styles.InputField}>
                        <Input inputContainerStyle={{ borderBottomWidth: 0 }} placeholderTextColor="#5e0191"
                        style={{color:'#5e0191'}}
                        value={this.state.scandata.userId.toString()}
                        disabled={true}
                        />
                    </View>
                    <Text style={styles.inputfieldtxt}>Username</Text>
                    <View style={styles.InputField}>
                        <Input inputContainerStyle={{ borderBottomWidth: 0 }} placeholderTextColor="#5e0191"
                        style={{color:'#5e0191'}}
                        value={this.state.scandata.name.toString()}
                        disabled={true}
                        />
                    </View>
                    <Text style={styles.inputfieldtxt}>Offer Name</Text>
                    <View style={styles.InputField}>
                        <Input inputContainerStyle={{ borderBottomWidth: 0 }} placeholderTextColor="#5e0191"
                        style={{color:'#5e0191'}}
                        value={this.state.scandata.offerName.toString()}
                        disabled={true}
                        />
                    </View>
                    <Text style={styles.inputfieldtxt}>Reedem Points</Text>
                    <View style={styles.InputField}>
                        <Input inputContainerStyle={{ borderBottomWidth: 0 }} placeholderTextColor="#5e0191"
                        style={{color:'#5e0191'}}
                        value={this.state.scandata.toRedeem.toString()}
                        disabled={true}
                        />
                    </View>
                    <View style={styles.SignInBtnView}>
                        <TouchableOpacity style={styles.wrapper} onPress={this.submit}>
                            <GradientBtn name="Submit" />
                        </TouchableOpacity>
                    </View>
                    </>
                )}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    MainContainer:{
        flex:1,
        justifyContent:'center',
        alignContent:'center',
        alignItems: 'center',
        padding:30
    },
    SignInBtnView:{
        width: '100%',
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
    InputField:{
        borderWidth: 1, 
        borderColor: '#5e0191', 
        borderRadius: 5,
        width:'100%',
        marginBottom:10
    },
    wrapper: {
      height: 55,
      marginTop: 10
    },
    LoginTxt:{
        fontSize:18,
        paddingBottom: 10,
        fontWeight:'700',
        color:'#5e0191'

    },
    inputfieldtxt:{
        fontSize:14,
        paddingBottom: 10,
        fontWeight:'500',
        color:'black',
        textAlign:'left',
        width:'100%'
    }
  })