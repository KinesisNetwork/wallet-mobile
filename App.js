import React from 'react'
import { StyleSheet, Text, View, Button, Dimensions } from 'react-native'
import { Create } from './build/Create'
import { Dashboard } from './build/Dashboard'
import { Settings } from './build/Settings'
import { Menu } from './build/Navigation'
import { StackNavigator, DrawerNavigator } from 'react-navigation'
const screenWidth = Dimensions.get('window').width

let DrawerStack = DrawerNavigator({
    Home: {
      screen: Create
    },
    Dashboard: {
      screen: Dashboard
    },
    Settings: {
      screen: Settings
    },
  },{
    initialRouteName: 'Home',
    contentComponent: Menu,
    drawerWidth: screenWidth > 320 ? 300 : 250
  }
);
export default class App extends React.Component {
  render() {
    return <DrawerStack />;
  }
}
