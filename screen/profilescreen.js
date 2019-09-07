import React from 'react'
import {
  View,
  FlatList,
  SafeAreaView,
  Dimensions,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image
} from 'react-native'
import * as Animatable from 'react-native-animatable'
import {
  LoginManager
} from 'react-native-fbsdk'
import AsyncStorage from '@react-native-community/async-storage'

export default class ProfileScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isOptionOpen: false,
      userInfo: {},
      ava: 'http://lienminh360.vn/wp-content/uploads/2019/06/avatar-dau-truong-chan-ly.jpg',
    }
    this.data = [
      {
      },
    ]
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('member')
      if(value !== null) {
        this.setState({userInfo: JSON.parse(value)})
      }
      else {
        console.log('NO DATA')
      }
    } catch(e) {
      console.log(e)
    }
  }

  removeData = async () => {
    try {
      await AsyncStorage.removeItem('member')
    }
    catch (e) {
      console.log(e)
    }
  }

  logOut = () => {
    this.removeData()
    this.getData()
    this.props.navigation.popToTop()
  }

  turnOnOption = () => {
    this.setState({isOptionOpen: true})
  }

  turnOffOption = () => {
    this.setState({isOptionOpen: false})
  }

  keyExtractor = (item, index) => index.toString();

  handleViewRef = ref => this.view = ref;

  renderItem = ({item}) => {

    return (
      <SafeAreaView style = {{flex: 1}}>

        </SafeAreaView>
    )
  }
  render() {
    return(
      <View style = {{flex: 1}}>
      <View
        style = {{
          height: Dimensions.get('window').height/5,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 10
      }}>
        <TouchableOpacity
          style = {{
            width: 100,
            height: 100,
          }}
          onPress = {this.turnOnOption}>
            <Image
              style = {{
                width: 100,
                height: 100,
                borderRadius: 50
              }}
              source = {{uri:this.state.ava}}/>
                </TouchableOpacity>
                  <Text
                    style = {{
                      color: 'black',
                      fontSize: 32,
                      fontWeight: '700'
                    }}>
                    {this.state.userInfo.name}
                </Text>
      </View>
        <FlatList
          data = {this.data}
          showsVerticalScrollIndicator = {false}
          keyExtractor = {this.keyExtractor}
          renderItem = {this.renderItem}
        />
        {this.state.isOptionOpen ?
          <TouchableOpacity
            style = {{
              width: '100%',
              height: '100%',
              position: 'absolute',
              alignItems: 'center',
              flexDirection: 'column-reverse',
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}
            onPress = {this.turnOffOption}>
            <Animatable.View
              animation='slideInUp'
              duration = {100}
              style = {{

                height: '45%',
                width: Dimensions.get('window').width,
                justifyContent: 'center',
                alignItems: 'center'
              }}>
              <TouchableOpacity
                style = {{
                  height: 60,
                  width: '80%',
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderTopRightRadius: 5,
                  borderTopLeftRadius: 5
                }}>
                <Text style = {{color: 'black'}}>Change profile picture</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style = {{
                  height: 60,
                  width: '80%',
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style = {{color: 'black'}}>Edit username</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style = {{
                  height: 60,
                  width: '80%',
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 12,
                  borderBottomRightRadius: 5,
                  borderBottomLeftRadius: 5
                }}
                onPress = {this.logOut}
                >
                <Text style = {{color: 'red'}}>Log out</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style = {{
                  height: 60,
                  width: '80%',
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5
                }}
                onPress = {this.turnOffOption}
                >
                <Text style = {{color: 'black'}}>Cancel</Text>
              </TouchableOpacity>
            </Animatable.View>
          </TouchableOpacity>
        :null}
      </View>
    )
  }
}
