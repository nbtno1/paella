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
         TextInput
       } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

export default class ListScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      text: '',
      header: {},
      data: []
    }
  }

  componentDidMount() {
    this.getHeaderData()
    this.getListData()
  }

  getHeaderData = () => {
    return fetch('http://10.90.87.30:3000/paella/header',  {
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
        console.log('Lỗi',error)
      })
  }

  getListData = () => {
    return fetch('http://10.90.87.30:3000/paella/list',  {
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
        console.log('Lỗi',error)
      })
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
                      <Text
                        style = {{
                          fontSize: 30,
                          color: '#f2f2f2',
                          margin: 20,
                          fontWeight: 'bold',
                      }}>
                          {item.title} Them view tao nen
                      </Text>

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

  render() {

    const { search } = this.state;

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
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
          placeholder={'Search Paella...'}
          placeholderTextColor={'#8c8c8c'}
          maxLength= {40}
          />
        </View>

        <FlatList
          data = {this.state.data}
          showsVerticalScrollIndicator = {false}
          keyExtractor = {this.keyExtractor}
          renderItem = {this.renderItem}
          ListHeaderComponent = {this.renderHeader(this.state.header)}
        />

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
