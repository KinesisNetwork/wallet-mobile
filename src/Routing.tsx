import React from 'react'
import { View } from 'react-native'
import { Create } from './Create'
import { WalletList, Dashboard } from './Dashboard'
import { Settings } from './Settings'
let { StackNavigator, TabNavigator, TabBarBottom } = require('react-navigation')
let SimpleLineIconsIcon = require('react-native-vector-icons/SimpleLineIcons').default;

let CreateAccount = TabNavigator(
  {
    Generate: { screen: Create },
    Import: { screen: Create },
  },
  {
    navigationOptions: ({ navigation }: any) => ({
      tabBarIcon: ({ focused, tintColor }: any) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Import') {
          iconName = `login`;
        } else if (routeName === 'Generate') {
          iconName = `user-follow`;
        }
        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <SimpleLineIconsIcon name={iconName} size={18} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'yellow',
      activeBackgroundColor: '#2e4458',
      inactiveTintColor: '#d1edff',
      style: {
        backgroundColor: '#2b3e50',
        height: 65,
      },
      tabStyle: {
        marginVertical: 8,
      },
      labelStyle: {
        marginVertical: 2
      }
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);

let SettingsScreen = TabNavigator(
  {
    'Select Network': { screen: Settings },
    'Add Network': { screen: Settings },
  },
  {
    navigationOptions: ({ navigation }: any) => ({
      tabBarIcon: ({ focused, tintColor }: any) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Select Network') {
          iconName = `globe`;
        } else if (routeName === 'Add Network') {
          iconName = `globe-alt`;
        }
        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <SimpleLineIconsIcon name={iconName} size={18} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'yellow',
      activeBackgroundColor: '#2e4458',
      inactiveTintColor: '#d1edff',
      style: {
        backgroundColor: '#2b3e50',
        height: 65,
      },
      tabStyle: {
        marginVertical: 8,
      },
      labelStyle: {
        marginVertical: 2
      }
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);


let WalletScreen = TabNavigator(
  {
    'Balances': { screen: Dashboard },
    'Transfer': { screen: Dashboard },
    'Transactions': { screen: Dashboard },
  },
  {
    navigationOptions: ({ navigation }: any) => ({
      tabBarIcon: ({ focused, tintColor }: any) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Balances') {
          iconName = `wallet`;
        } else if (routeName === 'Transfer') {
          iconName = `logout`;
        } else if (routeName === 'Transactions') {
          iconName = `tag`;
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <SimpleLineIconsIcon name={iconName} size={18} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'yellow',
      activeBackgroundColor: '#2e4458',
      inactiveTintColor: '#d1edff',
      style: {
        backgroundColor: '#2b3e50',
        height: 65,
      },
      tabStyle: {
        marginVertical: 8,
      },
      labelStyle: {
        marginVertical: 2
      }
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);

let WalletStack = StackNavigator({
    WalletList: {
      screen: WalletList
    },
    WalletScreen: {
      screen: WalletScreen
    },
  },{
    initialRouteName: 'WalletList',
    headerMode: 'none',
    cardStyle: {
      backgroundColor: '#000'
    }
  }
);

let RootStack = StackNavigator({
    Settings: {
      screen: SettingsScreen
    },
    Wallet: {
      screen: WalletStack
    },
    Create: {
      screen: CreateAccount
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

