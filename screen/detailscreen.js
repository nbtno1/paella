import React from 'react'
import {
  View,
  FlatList,
  Text,
  Image,
  SafeAreaView,
  Dimensions,
  BackHandler,
  Button,
  TouchableOpacity,
  Alert
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/AntDesign'

export default class DetailScreen extends React.Component {

  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
    this.state = {
      name: "",
      ingredient: [],
      instruction: [],
      isLiked: false,
      isLogin: false
    }
  }

  componentDidMount() {
    this.getData1()
    this.getData2()
  }

  getData1 = () => {
    const {navigation} = this.props
    const recipe_id = navigation.getParam('data', 'no-data')
    return fetch('http://10.90.87.30:3000/paella/detail',  {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      	id: recipe_id,
      }),
    })
      .then((response) =>
        response.json()
      )
      .then((responseJson) => {
        this.setState({
          name: responseJson.data.name,
          ingredient: responseJson.data.ingredient,
          instruction: responseJson.data.instruction})
        console.log(this.state.data)
      })
      .catch((error) => {
        console.log('Lỗi',error)
      })
  }

  getData2 = async () => {
      try {
        const value1 = await AsyncStorage.getItem('member')
        const value2 = await AsyncStorage.getItem('khongthichlogin')

        if(value1 !== null) {
          this.setState({isLogin: true})
        }
        else {
          this.setState({isLogin: false})    
        }
      } catch(e) {
        console.log(e)
      }
  }

  showAlert = () => {
    Alert.alert('Login to like')
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick)
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null)
    return true
  }

  like = () => {
    if(!this.state.isLiked) {
      this.setState({isLiked: true})
    } else {
      this.setState({isLiked: false})
    }

  }

  keyExtractor = (item, index) => index.toString();

  renderHeader = () => {
    return (
      <View
        style = {{
          flex: 1,
          paddingLeft: 10,
        }}>
      <View>
        <Text
          style = {{
            fontSize: 32,
            fontWeight: '700',
        }}>{this.state.name}</Text>
      </View>
      <View
        style = {{
          marginTop: 15
        }}>
        <Text
          style = {{
            fontSize: 18,
            fontWeight: '700'
        }}>INGREDIENTS</Text>
        {this.state.ingredient.map((cell, index) => {
          return(
            <View
              key = {index}
              style = {{
                marginLeft: 10
              }}>
              <Text
                style = {{
                  fontSize: 16
                }}>
                ● {cell}
              </Text>
            </View>
          )
        })}
      </View>
      <Text
        style = {{
          fontSize: 18,
          fontWeight: '700',
          marginTop: 5
        }}>
        INSTRUCTIONS
      </Text>
      </View>
    )
  }

  renderItem = ({item, index}) => {
    return (
      <SafeAreaView
        style = {{
         flex: 1,
      }}>
          <View>
              <View
                key = {index}
                style = {{
                  marginBottom: 10,
                  padding: 8,
                  borderColor: '#ff4d88'
                }}
              >
                <Image
                  source = {{uri: item.image}}
                  style = {{
                    width: '100%',
                    height: 300,
                    borderRadius: 10,
                    marginBottom: 8
                  }}
                />
                <Text
                  style = {{
                    fontSize: 16
                  }}
                >{item.step}</Text>
              </View>
        </View>
      </SafeAreaView>
    )
  }

  render() {
    return(
      <View
        style = {{
          flex: 1,
        }}>
        <View
          style = {{
            height: 45,
            flexDirection: 'row',
          }}
        >

          <View style = {{flex: 5, justifyContent: 'center'}}>
            <TouchableOpacity
              style = {{
                paddingLeft: 8,
                justifyContent: 'center',
                width: 50,
                borderRadius: 30,
              }}
              onPress = {
                this.handleBackButtonClick
              }
            >
              <Icon
                name = "arrowleft"
                size = {30}
                color = "black"
              />
            </TouchableOpacity>
          </View>

          <View style = {{flex: 1, justifyContent: 'center', paddingLeft: 10}}>
            <TouchableOpacity
              style = {{
                paddingLeft: 8,
                justifyContent: 'center',
                width: 50,
                borderRadius: 30
              }}
              onPress = {() => {
                if(!this.state.isLogin) {
                  this.showAlert()
                } else {
                  this.like()
                }
              }}
            >
              <Icon
                name = {!this.state.isLiked ? "hearto" : "heart"}
                size = {30}
                color = {!this.state.isLiked ? "black" : "red"}
              />
            </TouchableOpacity>
          </View>

        </View>
        <FlatList
          data = {this.state.instruction}
          showsVerticalScrollIndicator = {false}
          keyExtractor = {this.keyExtractor}
          renderItem = {this.renderItem}
          ListHeaderComponent = {this.renderHeader(this.state.data)}
        />
      </View>
    )
  }
}
