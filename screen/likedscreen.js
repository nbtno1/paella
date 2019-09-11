import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native'
import {
  AccessToken,
  LoginManager
} from 'react-native-fbsdk'
import {
  GoogleSignin,
  statusCodes
} from 'react-native-google-signin'
import AsyncStorage from '@react-native-community/async-storage'
import ProfileScreen from './profilescreen'

export default class LikedScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLogin: true,
      userInfo: ''
    };
  }

  componentDidMount() {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId: 'Replace Your Web Client Id here',
    });
    this.getData()
  }

  loginFB = () => {
    const self = this;
    LoginManager.logInWithPermissions(["public_profile"]).then(
      function(result) {
        if (result.isCancelled) {
          console.log("Login cancelled")
        } else {
          console.log("Login success")
          AccessToken.getCurrentAccessToken()
          .then((data) => {
            const {accessToken} = data
            self.removeData()
            self.initUser(accessToken)
          })
        }
      },
      function(error) {
        console.log("Login fail ", error)
      }
    );
  }

  initUser = (token) => {
    fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' + token)
    .then((response) => response.json())
    .then((json) => {
      this.storeData('member', JSON.stringify(json))
      this.setState({isLogin: true})
    })
    .catch((error) => {
      console.log(error)
    })
  }

  storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (e) {
      console.log(e)
    }
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('member')
      if(value !== null) {
        this.setState({isLogin: true})
      }
      else {
        this.setState({isLogin: false})
      }
    } catch(e) {
      console.log(e)
    }
  }

  removeData = async () => {
    try {
      await AsyncStorage.removeItem('khongthichlogin')
    }
    catch (e) {
      console.log(e)
    }
  }


  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      })
      const userInfo = await GoogleSignin.signIn()
      console.log('User Info --> ', userInfo)
      this.setState({ userInfo: userInfo })
    } catch (error) {
      console.log('Message', error.message)
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow')
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In')
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services Not Available or Outdated')
      } else {
        console.log('Some Other Error Happened')
      }
    }
  }

  getCurrentUser = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently()
      this.setState({userInfo})
    } catch (error) {
      console.error(error)
    }
  }

  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess()
      await GoogleSignin.signOut()
      this.setState({ user: null })
    } catch (error) {
      console.error(error)
    }
  }

  revokeAccess = async () => {
    try {
      await GoogleSignin.revokeAccess()
      console.log('deleted')
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    return(
      <View style = {{flex: 1}}>
        {this.state.isLogin ? <ProfileScreen/> :  <View
                style = {{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10
                }}
              >
              <View
                style = {{
                  flex: 8,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >

                <Image
                  source = {require('./booklet+bookmark+icon-1320087270980141420.png')}
                  style = {{width: 90, height: 90}}
                />

                <Text
                  style = {{
                    fontSize: 20,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: '#ff00bf'
                  }}
                >
                  Log in or create an account to save your favorite recipes

                </Text>


              </View>

              <View style = {{flex: 1.2}}>
                <TouchableOpacity
                  onPress = {this.loginFB}
                  style = {{
                    backgroundColor: '#3b5998',
                    width: 300,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                  <Text
                    style = {{
                      color: 'white',
                      fontWeight: '700',
                      fontSize: 18
                  }}>
                      Facebook
                  </Text>
                </TouchableOpacity>
              </View>

              <View style = {{flex: 1.2}}>
                <TouchableOpacity
                  onPress = {this.signIn}
                  style = {{
                    backgroundColor: '#DB4437',
                    width: 300,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style = {{
                      color: 'white',
                      fontWeight: '700',
                      fontSize: 18
                  }}>
                      Google
                  </Text>
                </TouchableOpacity>
              </View>

              </View>}
      </View>
    )
  }
}
