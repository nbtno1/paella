import React from 'react'
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Text
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

export default class HomeScreen extends React.Component {

  static navigationOptions = { header: null }

  constructor(props) {
    super(props);
    this.state = {
      userInfo: '',
      isLogin: true
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
          console.log("Login cancelled");
        } else {
          console.log("Login success")
            AccessToken.getCurrentAccessToken().then((data) => {
              const {accessToken} = data
              self.initUser(accessToken)
              self.removeData()
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
      this.props.navigation.push('Main')
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
      const value1 = await AsyncStorage.getItem('member')
      const value2 = await AsyncStorage.getItem('khongthichlogin')

      if(value1 !== null) {
        this.props.navigation.push('Main')
        this.setState({isLogin: true})
      }
      else {
        if(value2 !== null) {
          this.props.navigation.push('Main')
        }
        else {
          this.setState({isLogin: false})
        }
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
      this.setState({ userInfo })
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
    return (

        <View
          style = {{
            flex: 1,
            flexDirection: 'column-reverse'
          }}>

          <ImageBackground
            source = {require('./background.jpg')}
            style = {{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%',
            }}
          />

          {!this.state.isLogin ? <View
            style = {{
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              padding: 5,
              height: '25%',
              marginBottom: 10
            }}>

            <Text
              style = {{
                color: 'white',
                fontSize: 13,
                textAlign: 'center',
                fontWeight: '200',
                paddingBottom: 5
              }}
            >
                Log in or create an account to save your favorite recipes
            </Text>

            <View style = {{marginBottom: 10}}>
              <TouchableOpacity
                onPress = {
                  this.loginFB
                }
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

            <View style = {{marginBottom: 10}}>
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

          <View style = {{marginBottom: 10}}>
            <TouchableOpacity
              style = {{
                width: 300,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: 15
              }}
              onPress={() => {
                this.props.navigation.push('Main')
                this.storeData('khongthichlogin', '2000')
              }}
            >
              <Text
                style = {{
                  color: 'white',
                  fontWeight: '300',
                  fontSize: 14
              }}>
                  Maybe later
              </Text>
          </TouchableOpacity>
        </View>

      </View> : null}

    </View>
    )
  }
}
