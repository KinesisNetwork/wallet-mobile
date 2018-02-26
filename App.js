import React from 'react'
import { StyleSheet, Text, View, Button, Dimensions } from 'react-native'
import { Create } from './build/Create'
import { Wallet } from './build/Dashboard'
import { Settings } from './build/Settings'
import { Drawer } from './build/Navigation'
import { StackNavigator, DrawerNavigator } from 'react-navigation'
const screenWidth = Dimensions.get('window').width

let RootStack = StackNavigator({
    Settings: {
      screen: Settings
    },
    Wallet: {
      screen: Wallet
    },
    Create: {
      screen: Create
    },
  },{
    initialRouteName: 'Create',
    headerMode: 'float',
    cardStyle: {
      backgroundColor: '#000'
    }
  }
);

export default class App extends React.Component {
  render() {
    return <View style={{flex: 1, backgroundColor: '#000'}}><RootStack/></View>
  }
}
