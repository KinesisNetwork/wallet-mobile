import React from 'react';
import { Text, View } from 'react-native'
import { getActiveWallet, getPrivateKey } from './helpers/wallets';
import { BackNav } from './Navigation';
import { AppState } from './Routing'
let StellarSdk = require('stellar-sdk')

export class Balances extends React.Component<{ screenProps: {appState: any}}, any> {
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

