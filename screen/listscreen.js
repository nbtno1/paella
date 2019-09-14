import React from 'react'
import { View,
         Text,
         ScrollView,
         StyleSheet,
         FlatList,
         BackHandler,
         ImageBackground,
         TouchableOpacity,
         Image,
         SafeAreaView,
         TextInput,
         Dimensions
       } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import * as Animatable from 'react-native-animatable'

export default class ListScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      header: {},
      data: [],
      result: [],
      search: false,
    }
  }

  componentDidMount() {
    this.getHeaderData()
    this.getListData()
  }

  search = (item) => {

    return fetch('http://192.168.0.109:3000/paella/search',  {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        search_item: item.toUpperCase(),
      }),
    })
      .then((response) =>
        response.json()
      )
      .then((responseJson) => {
        this.setState({result: responseJson})
      })
      .catch((error) => {
        console.log(error)
      })
  }

  getHeaderData = () => {
    return fetch('http:/192.168.0.109:3000/paella/header',  {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) =>
        response.json()
      )
      .then((responseJson) => {
        const index = ~~(Math.random()*3)+0
         this.setState({header: responseJson[index]})
      })
      .catch((error) => {
        console.log(error)
      })
  }

  getListData = () => {
    return fetch('http://192.168.0.109:3000/paella/list',  {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) =>
        response.json()
      )
      .then((responseJson) => {
         this.setState({data: responseJson})
      })
      .catch((error) => {
        console.log(error)
      })
  }

  turnOnSearch = () => {
    this.setState({search: true})
  }

  turnOffSearch = () => {
    this.setState({search: false})
  }

  renderHeader = (item) => {

    return (
      <View
        style = {{
          justifyContent: 'center',
          alignItems: 'center',
          padding: 8,
          marginTop: 10*(-1)
        }}>
        <View
          style = {{
            height: 350,
            width: '100%',
            marginBottom: 15,
            flex: 1
          }}
        >
              <TouchableOpacity
                style = {{
                  flex:1,
                  backgroundColor: 'black',
                  borderRadius: 15,

                }}
                activeOpacity = {0.7}
                onPress={() => {
                  this.props.navigation.push(
                    'Detail',
                    {data: item.address}
                  )
                }}
              >
                    <ImageBackground
                      source = {{uri: item.image_source}}
                      style = {{
                        width: '100%',
                        height: 350,
                        flexDirection: 'column-reverse',
                        position: 'absolute'
                      }}
                      imageStyle = {{borderRadius: 20, position: 'absolute'}}
                    >
                    <View
                      style = {{
                        backgroundColor: 'rgba(0,0,0,0.3)'
                      }}>
                      <Text
                        style = {{
                          fontSize: 30,
                          color: '#f2f2f2',
                          margin: 20,
                          fontWeight: 'bold',
                      }}>
                          {item.title}
                      </Text>
                    </View>


                    </ImageBackground>

              </TouchableOpacity>

        </View>
      </View>

    )
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({item}) => {
     return (
       <SafeAreaView
        style = {{
          flex: 1,
          alignItems: 'center',
        }}
       >
            <View
              style = {{
                marginBottom: 10
              }}
            >
              <Text
                style = {{
                  fontWeight: '500',
                  fontSize: 20,
                  color: '#ff00bf',
                  marginLeft: 10,
                  marginBottom: 5
              }}>
                    {item.titleData}
              </Text>

                <ScrollView
                  showHorizontalScrollIndicator = {false}
                  horizontal = {true}
                  key = {item.key}
                >
                    {item.itemData.map((cell, index) => {
                      return (
                        <TouchableOpacity
                          style = {{
                            width: 200,
                            height: 200,
                            paddingLeft: 10
                          }}
                          key = {index}
                          onPress={() => {
                              this.props.navigation.push(
                                'Detail',
                                {data: cell.address}
                              )
                          }}
                        >
                            <View
                              style = {{
                                flex: 3
                              }}
                            >
                              <Image
                                source = {{
                                  uri: cell.image_source
                                }}
                                style = {{
                                  flex: 1,
                                  width: null,
                                  height: null,
                                  resizeMode: 'cover'
                                }}
                              />

                            </View>
                            <View
                              style = {{
                                flex: 1,
                                padding: 5,
                              }}
                            >
                              <Text
                                style = {{
                                  fontSize: 15,
                                  fontWeight: '700',
                                  color: 'black'
                                }}
                              >
                              {cell.title}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )
                      })}
                  </ScrollView>

            </View>

        </SafeAreaView>
     )
   }

  renderItem_search = ({item}) => {
    return (
      <SafeAreaView
        style = {{
          flex: 1,
          width: Dimensions.get('window').width,
      }}>
        <TouchableOpacity
          style = {{
            margin: 5,
            borderWidth: 0.5,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            width: 400,
            height: 50
          }}
          onPress={() => {
              this.props.navigation.push(
                'Detail',
                {data: item._id}
              )
          }}
        >
          <Text>{item.name}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  render() {

    return (
      <View style = {styles.container}>

        <View style = {styles.search_zone}>
        <TextInput
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 2,
            paddingLeft: 15,
            borderRadius: 10,
            borderColor: '#409fbf',
          }}
          onChangeText = {(text) => {
            this.search(text)
            if(text.length === 0) {
              this.turnOffSearch()
            } else {
              this.turnOnSearch()
            }

          }}
          value = {this.state.search_text}
          placeholder = {'Search Paella...'}
          placeholderTextColor = {'#8c8c8c'}
          maxLength = {40}
          />
        </View>
        {!this.state.search ?
          <FlatList
            data = {this.state.data}
            showsVerticalScrollIndicator = {false}
            keyExtractor = {this.keyExtractor}
            renderItem = {this.renderItem}
            ListHeaderComponent = {this.renderHeader(this.state.header)}
          />
          :
          <FlatList
            data = {this.state.result}
            showsVerticalScrollIndicator = {false}
            keyExtractor = {this.keyExtractor}
            renderItem = {this.renderItem_search}
          />
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  search_zone: {
    width: '95%',
    height: 50,
    backgroundColor: 'white',
    paddingTop: 5,
    opacity: 7,
    borderRadius: 10
  }
})
