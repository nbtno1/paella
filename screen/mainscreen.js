import React, {Component} from 'react'
import {
  View,
  BackHandler,
  Animated,
  Dimensions,
  TouchableOpacity,
  Text
} from 'react-native'
import ListScreen from './listscreen'
import LikedScreen from './likedscreen'
import ProfileScreen from './profilescreen'
import BottomBar from '../components/bottombar'
import AsyncStorage from '@react-native-community/async-storage'

let ScrollableTabView = require('react-native-scrollable-tab-view')

export default class MainScreen extends Component {

  static navigationOptions = { header: null }

  constructor(props) {
    super(props)
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
    this.state = {
      isLogin: false,
      isOut: false,
    }
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick)
  }

  componentDidMount() {
    this.getData()
  }

  handleBackButtonClick() {
    this.setState({isOut: true})
    return true
  }

  out = () => {
    BackHandler.exitApp()
  }

  stay = () => {
    this.setState({isOut: false})
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

    render() {
      return(
        <View style = {{flex: 1}}>
        <ScrollableTabView
          initialPage={0}
          tabBarPosition = {'bottom'}
          renderTabBar={() => <BottomBar/>}
        >
            <ListScreen {...this.props} tabLabel="home" />
            {!this.state.isLogin ? <LikedScreen tabLabel="hearto"/>:<ProfileScreen {...this.props} tabLabel="hearto"/>}
          </ScrollableTabView>
          {this.state.isOut ?
            <View
              style = {{
                width:'100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.3)',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute'
            }}>
              <View
                style = {{
                  width: Dimensions.get('window').width *(0.8),
                  height: 200,
                  backgroundColor: 'white',
                  paddingLeft: 15,
                  paddingRight: 15,
                  paddingBottom: 15,
                  borderRadius: 5
                }}>
                <View
                  style = {{
                    flex: 2,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                  <Text
                    style = {{
                      color: 'black',
                      fontSize: 24,
                      fontWeight: '700'
                    }}>Exit?</Text>
                </View>
                <View
                  style = {{
                    flex: 1,
                    flexDirection: 'row',
                    alignContent: 'stretch'
                }}>
                  <TouchableOpacity
                    style = {{
                      flex: 1,
                      backgroundColor: '#66ff8c',
                      borderRadius: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: 5
                  }}
                    onPress = {this.out}
                  >
                    <Text style = {{fontSize: 18}}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style = {{
                      flex: 1,
                      backgroundColor: '#ff6666',
                      borderRadius: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: 5
                  }}
                    onPress = {this.stay}
                  >
                    <Text style = {{fontSize: 18}}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View> : null}
        </View>
      )
    }
}
