import React from 'react'
import { View } from 'react-native'
import { Create } from './Create'
import { WalletList, Dashboard } from './Dashboard'
import { defaultConnections, Connection,  Settings } from './Settings'
let { StackNavigator, TabNavigator, TabBarBottom } = require('react-navigation')
let SimpleLineIconsIcon = require('react-native-vector-icons/SimpleLineIcons').default;

export interface AppState {
  walletList: Wallet[],
  passwordMap: PasswordMap,
  connection: Connection
}

export interface PasswordMap {
  [accountId: string]: {
    timestamp: number,
    password: string
  }
}

export interface ViewParams {
  walletIndex?: number
}

export interface Wallet {
  publicKey: string,
  encryptedPrivateKey: string,
  accountName?: string
}

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

class CreateAccountWrapper extends React.Component<any, any> {
  constructor (props: any) { super(props) }
  static navigationOptions = Create.navigationOptions;
  // Pass props to children
  render() {
    return <CreateAccount
      screenProps={{
          appState: this.props.screenProps.appState,
          setWalletList: this.props.screenProps.setWalletList
      }}
      />
  }
}

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

class SettingsScreenWrapper extends React.Component<any, any> {
  constructor (props: any) { super(props) }
  static navigationOptions = Settings.navigationOptions;
  // Pass props to children
  render() {
    return <SettingsScreen
      screenProps={{
          appState: this.props.screenProps.appState,
          changeConnection: this.props.screenProps.changeConnection
      }}
      />
  }
}

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

class WalletScreenWrapper extends React.Component<any, any> {
  constructor (props: any) { super(props) }
  static navigationOptions = WalletList.navigationOptions;
  // Pass props to children
  render() {
    return <WalletStack
        screenProps={{
          rootNavigation: this.props.navigation,
          appState: this.props.screenProps.appState
        }}
      />
  }
}

class DashboardScreenWrapper extends React.Component<any, any> {
  constructor (props: any) { super(props) }
  static navigationOptions = Dashboard.navigationOptions;
  // Pass props to children
  render() {
    return <DashboardScreen
        screenProps={{
          appState: this.props.screenProps.appState
        }}
      />
  }
}

let WalletStack = StackNavigator({
    [Routes.walletList]: {
      screen: WalletList
    },
    [Routes.dashboardScreen]: {
      screen: DashboardScreenWrapper
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
      screen: SettingsScreenWrapper
    },
    [Routes.walletScreen]: {
      screen: WalletScreenWrapper
    },
    [Routes.accountScreen]: {
      screen: CreateAccountWrapper
    },
  },{
    initialRouteName: Routes.accountScreen,
    headerMode: 'float',
    cardStyle: {
      backgroundColor: '#000'
    }
  }
);

export default class App extends React.Component<null, AppState> {
  constructor (props: any) {
    super(props)
    this.state = {walletList: [], connection: defaultConnections[0], passwordMap: {}}
  }
  public changeConnection (connection: any) {
    this.setState({connection})
  }
  public setWalletList (walletList: Wallet[]): void {
    console.warn(walletList, 'walletList')
    this.setState({walletList})
  }
  render() {
    return <View style={{flex: 1, backgroundColor: '#000'}}>
      <RootStack
        screenProps={{
          appState: this.state,
          changeConnection: this.changeConnection.bind(this),
          setWalletList: this.setWalletList.bind(this)
        }}
      />
    </View>
  }
}

