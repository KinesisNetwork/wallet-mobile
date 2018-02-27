import * as _ from 'lodash'
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { getActiveWallet, getPrivateKey } from './helpers/wallets';
import { BackNav } from './Navigation';
import { Routes, Wallet, AppState } from './Routing'
let StellarSdk = require('stellar-sdk')

export class Dashboard extends React.Component<{ screenProps: {appState: any}}, any> {
  static navigationOptions = (opt: any) => {
    return {
      header: <BackNav title='Wallet Dashboard' navigation={opt.navigation} />
    }
  }

  constructor (props: any) {
    super(props)
    this.state = { account: null, kinesisBalance: 0, accountActivated: false }
  }

  componentDidMount() {
    this.loadBalances(this.props)
  }

  componentWillReceiveProps(nextProps: any) {
    if (this.props !== nextProps) {
      this.loadBalances(nextProps)
    }
  }

  // React antipattern (this is used via ref)
  public reloadBalances() {
    this.loadBalances(this.props)
  }

  public async loadBalances(props: any) {
    try {
      const server = new StellarSdk.Server(props.screenProps.appState.connection.horizonServer, {allowHttp: true})
      const account = await server.loadAccount(getActiveWallet(props.screenProps.appState).publicKey)
      console.warn(account)
      const kinesisBalance = Number(account.balances.filter((b: any) => b.asset_type === 'native')[0].balance)
      this.setState({account, kinesisBalance, accountActivated: true})
    } catch (e) {
      console.warn(e.message)
      this.setState({accountActivated: false, kinesisBalance: 0})
    }
  }

  render() {
    return (
      <BalancesPresentation
        appState={this.props.screenProps.appState}
        kinesisBalance={this.state.kinesisBalance}
        accountActivated={this.state.accountActivated}
      />
    )
  }

}

export class BalancesPresentation extends React.Component<{
  appState: AppState,
  kinesisBalance: number,
  accountActivated: boolean
}, {}> {
  constructor (props: any) {
    super(props)
  }

  render() {
    let activeWallet = getActiveWallet(this.props.appState) || {}
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <Text>Public Key: </Text>
        <Text>{activeWallet.publicKey}</Text>
        <Text>Reveal Private Key: </Text>
        <Text>{getPrivateKey(this.props.appState, activeWallet) || 'Please enter your wallet password'}</Text>
        <View>
          <Text>Account activated: </Text>
          <Text>{this.props.accountActivated ? 'Yes' : 'No'}</Text>
        </View>
        <View>
          <Text>Kinesis Balance: </Text>
          <Text>{this.props.kinesisBalance}</Text>
        </View>
      </View>
    )
  }
}



export class WalletList extends React.Component<any, {}> {
  static navigationOptions = (opt: any) => {
    return {
      header: <BackNav title='Wallet' navigation={opt.navigation} />
    }
  }
  constructor(props: any) {
    super(props)
  }

  render() {
    return (
      <View style={styles.drawerContent}>
        <View style={{flex: 1}}>
          { _.map(this.props.screenProps.appState.walletList, (wallet: Wallet, index) => {
            return (
              <TouchableOpacity key={index} onPress={() => {
                this.props.navigation.navigate(Routes.dashboardScreen, { walletIndex: index })
              }} style={{flexDirection: 'row', justifyContent: 'center', alignContent: 'center', backgroundColor: '#354f67', marginTop: 18, margin: 12, padding: 8}}>
                <Text style={{color: 'white', fontSize: 16}} >{wallet.publicKey}</Text>
              </TouchableOpacity>
            )
          })}
          <TouchableOpacity onPress={() => this.props.screenProps.rootNavigation.navigate(Routes.accountScreen)} style={{
            flexDirection: 'row', justifyContent: 'center', alignContent: 'center', marginTop: 0, borderWidth: 1, marginLeft: 12, marginRight: 12, padding: 8, borderColor: 'yellow'
          }}>
            <Text style={{color: 'yellow'}}>Add Wallet</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: '#2e4458',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#1f2d3b',
  },
});
