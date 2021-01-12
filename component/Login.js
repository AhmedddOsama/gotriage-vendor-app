import React, { Component } from 'react'
import { Text, View , StyleSheet , TouchableOpacity,Alert,SafeAreaView} from 'react-native'
import { Input } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
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
export default class Login extends Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        this.state = {
            email:'',
            password:''
        }
    }
    login=()=>{
        this.state.email=this.state.email.toLowerCase();
        this.state.email=this.state.email.trim();
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        if(this.state.email==''){
            alert('Plase Enter Email');
        }
        else if(this.state.password==''){
            alert('Plase Enter Password');
        }
        else if(reg.test(this.state.email) === false){
            Alert.alert( 'Error!!', 'Email is Not Correct',[{text:'OK'}]);
        }
        else{
            var body={
                email: this.state.email,
                password: this.state.password,
            }
          axios.post('https://gotapis.gotriage.com/api/admins/customLogin',body)
          .then(response =>{
            if(response.data.statusCode==405){
                Alert.alert('Error!!',response.data.message,[{text:'OK'}]);
            }
            else {
                if(response.data.vendor==true){
                    SecureStore.setItemAsync("userdata", JSON.stringify(response.data))
                    this.props.navigation.replace('Scanner',{userdata:response.data});
                }
                else{
                    Alert.alert('Error!!','Email is incorrect',[{text:'OK'}]);
                }
            }
          })
          .catch(error =>{
            alert('Network Error');
          })
        }
    }
    render() {
        return (
            <View style={styles.MainContainer}>
                <Text style={styles.LoginTxt}>Login</Text>
                <View style={styles.InputField}>
                    <Input inputContainerStyle={{ borderBottomWidth: 0 }} placeholderTextColor="#5e0191"
                    style={{color:'#5e0191'}}
                    placeholder="Email"
                    keyboardType={'email-address'}
                    onChangeText={(email) => {this.setState({email:email})}}
                    />
                </View>
                <View style={styles.InputField}>
                    <Input inputContainerStyle={{ borderBottomWidth: 0 }} placeholderTextColor="#5e0191"
                    style={{color:'#5e0191'}}
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(password) => {this.setState({password:password})}}
                    />
                </View>
                <View style={styles.SignInBtnView}>
                    <TouchableOpacity style={styles.wrapper} onPress={this.login}>
                        <GradientBtn name="Login" />
                    </TouchableOpacity>
                </View>
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
        justifyContent:'center',
        zIndex:99999
    },
    InputField:{
        borderWidth: 1, 
        borderColor: '#5e0191', 
        borderRadius: 5,
        width:'100%',
        marginBottom:10
    },
    wrapper: {
      marginTop: 10,
      height:55
    },
    LoginTxt:{
        fontSize:18,
        paddingBottom: 10,
        fontWeight:'700',
        color:'#5e0191'
    }
  })