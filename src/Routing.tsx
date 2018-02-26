import React from 'react'
import { View } from 'react-native'
import { Create } from './Create'
import { WalletList, Dashboard } from './Dashboard'
import { Settings } from './Settings'
let { StackNavigator, TabNavigator, TabBarBottom } = require('react-navigation')
let SimpleLineIconsIcon = require('react-native-vector-icons/SimpleLineIcons').default;

export const enum Routes {
  accountScreen = 'Account Screen',
  walletScreen = 'Wallet Screen',
  dashboardScreen = 'Dashboard Screen',
  settingsScreen = 'Settings Screen',
  accountGenerate = 'Generate',
  accountImport = 'Import',
  selectNetwork = 'Select Network',
  addNetwork = 'Add Network',
  dashboardBalances = 'Balances',
  dashboardTransfer = 'Transfer',
  dashboardTransactions = 'Transactions',
  walletList = 'Wallet List',
}

let CreateAccount = TabNavigator(
  {
    [Routes.accountGenerate]: { screen: Create },
    [Routes.accountImport]: { screen: Create },
  },
  {
    navigationOptions: ({ navigation }: any) => ({
      tabBarIcon: ({ focused, tintColor }: any) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === Routes.accountImport) {
          iconName = `login`;
        } else if (routeName === Routes.accountGenerate) {
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
    [Routes.selectNetwork]: { screen: Settings },
    [Routes.addNetwork]: { screen: Settings },
  },
  {
    navigationOptions: ({ navigation }: any) => ({
      tabBarIcon: ({ focused, tintColor }: any) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === Routes.selectNetwork) {
          iconName = `globe`;
        } else if (routeName === Routes.addNetwork) {
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


let DashboardScreen = TabNavigator(
  {
    [Routes.dashboardBalances]: { screen: Dashboard },
    [Routes.dashboardTransfer]: { screen: Dashboard },
    [Routes.dashboardTransactions]: { screen: Dashboard }
  },
  {
    navigationOptions: ({ navigation }: any) => ({
      tabBarIcon: ({ focused, tintColor }: any) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === Routes.dashboardBalances) {
          iconName = `wallet`;
        } else if (routeName === Routes.dashboardTransfer) {
          iconName = `logout`;
        } else if (routeName === Routes.dashboardTransactions) {
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
    [Routes.walletList]: {
      screen: WalletList
    },
    [Routes.dashboardScreen]: {
      screen: DashboardScreen
    },
  },{
    initialRouteName: Routes.walletList,
    headerMode: 'none',
    cardStyle: {
      backgroundColor: '#000'
    }
  }
);

let RootStack = StackNavigator({
    [Routes.settingsScreen]: {
      screen: SettingsScreen
    },
    [Routes.walletScreen]: {
      screen: WalletStack
    },
    [Routes.accountScreen]: {
      screen: CreateAccount
    },
  },{
    initialRouteName: Routes.accountScreen,
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

