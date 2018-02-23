import React from 'react'
import { StyleSheet, Text, View, Button, Dimensions } from 'react-native'
import { Create } from './build/Create'
import { Dashboard } from './build/Dashboard'
import { Settings } from './build/Settings'
import { Drawer } from './build/Navigation'
import { StackNavigator, DrawerNavigator } from 'react-navigation'
const screenWidth = Dimensions.get('window').width

let DrawerStack = DrawerNavigator({
    Dashboard: {
      screen: Dashboard
    }
  },{
    initialRouteName: 'Dashboard',
    header: null,
    contentComponent: Drawer,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    drawerWidth: screenWidth > 320 ? 300 : 250
  }
);
let RootStack = StackNavigator({
    Settings: {
      screen: Settings
    },
    Drawer: {
      screen: DrawerStack
    },
    Create: {
      screen: Create
    },
  },{
    initialRouteName: 'Create',
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
