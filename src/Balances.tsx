import React from 'react';
import { Button, TextInput, Text, View } from 'react-native'
import { getActiveWallet } from './helpers/wallets';
import { BackNav } from './Navigation';
import { AppState } from './Routing'
import { decryptPrivateKey } from './services/encryption';
let StellarSdk = require('stellar-sdk')

export class Balances extends React.Component<{ screenProps: {appState: any}, navigation?: any}, any> {
  static navigationOptions = (opt: any) => {
    return {
      header: <BackNav title='Wallet Dashboard' navigation={opt.navigation} />
    }
  }

  constructor (props: any) {
    super(props)
    this.state = { account: null, kinesisBalance: 0, accountActivated: false, password: '', decryptedPrivateKey: '' }
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

  public async unlockWallet() {
    let decryptedPrivateKey = decryptPrivateKey(getActiveWallet(this.props.screenProps.appState).encryptedPrivateKey, this.state.password)
    if (decryptedPrivateKey) {
      this.setState({decryptedPrivateKey})
    } else {
      console.warn('incorrect pass')
    }
  }

  public handlePassword(password: any) {
    this.setState({password})
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
        handlePassword={this.handlePassword.bind(this)}
        unlockWallet={this.unlockWallet.bind(this)}
        appState={this.props.screenProps.appState}
        privateKey={this.state.decryptedPrivateKey}
        password={this.state.password}
        kinesisBalance={this.state.kinesisBalance}
        accountActivated={this.state.accountActivated}
      />
    )
  }

}

export class BalancesPresentation extends React.Component<{
  appState: AppState,
  handlePassword: Function,
  unlockWallet: Function,
  password: string,
  privateKey: string,
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
        <Text>Reveal Private Key:</Text>

        {(this.props.privateKey) ? (
          <Text>{this.props.privateKey}</Text>
        ) : (
          <View>
            <TextInput value={this.props.password} style={{backgroundColor: 'white', marginBottom: 15}} onChangeText={(text) => this.props.handlePassword(text)} />
            <Button title='Unlock' onPress={() => this.props.unlockWallet()} />
          </View>
        )}

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

