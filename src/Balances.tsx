import React from 'react';
import { TouchableOpacity, ScrollView, StyleSheet, Button, TextInput, Text, View } from 'react-native'
import { getActiveWallet } from './helpers/wallets';
import { BackNav } from './Navigation';
import { decryptPrivateKey } from './services/encryption';
let { NavigationActions } = require('react-navigation')
let StellarSdk = require('stellar-sdk')
let IoniconsIcon = require('react-native-vector-icons/Ionicons').default;
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux'
import { AppState } from './store/options/index'

interface StateProps {
  appState: AppState,
  navigation: any
}

const mapStateToProps: MapStateToProps<StateProps, any, any> = ({options}: any, ownProps: any) => ({
  appState: options,
  ...ownProps
})

interface DispatchProps { }

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch, ownProps) => ({})

type BalanceProps = StateProps & DispatchProps

export class BalancesState extends React.Component<BalanceProps, any> {
  static navigationOptions = (opt: any) => {
    return {
      header: <BackNav title='Wallet Balances' navigation={opt.navigation} />
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
    let decryptedPrivateKey = decryptPrivateKey(getActiveWallet(this.props.appState).encryptedPrivateKey, this.state.password)
    if (decryptedPrivateKey) {
      this.setState({decryptedPrivateKey})
    } else {
      console.warn('incorrect pass')
    }
  }

  public handlePassword(password: any) {
    this.setState({password})
  }

  public deleteWallet() {
    this.props.navigation.dispatch(NavigationActions.back())
  }

  public async loadBalances(props: any) {
    try {
      const server = new StellarSdk.Server(props.appState.connection.horizonServer, {allowHttp: true})
      const account = await server.loadAccount(getActiveWallet(props.appState).publicKey)
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
        deleteWallet={this.deleteWallet.bind(this)}
        handlePassword={this.handlePassword.bind(this)}
        unlockWallet={this.unlockWallet.bind(this)}
        appState={this.props.appState}
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
  deleteWallet: Function,
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
      <ScrollView style={styles.mainContent}>
        <View style={{paddingBottom: 60}}>
          <Text style={[styles.labelFont, styles.labelHeader]}>Public Key: </Text>
          <Text style={styles.labelFont}>{activeWallet.publicKey}</Text>
          <Text style={[styles.labelFont, styles.labelHeader]}>Reveal Private Key:</Text>

          {(this.props.privateKey) ? (
            <Text style={styles.labelFont}>{this.props.privateKey}</Text>
          ) : (
            <View style={{flexDirection: 'row'}}>
              <TextInput placeholder='Password' value={this.props.password} style={[styles.textInput, {flex: 4}]} onChangeText={(text) => this.props.handlePassword(text)} />
              <TouchableOpacity style={{borderLeftWidth: 1, borderLeftColor: 'black', flex:1, backgroundColor: 'yellow', marginBottom: 15, alignItems: 'center', justifyContent: 'center'}} onPress={() => this.props.unlockWallet()}>
                <IoniconsIcon style={{margin: 8}} name='ios-arrow-forward-outline' size={21} color='black' />
              </TouchableOpacity>
            </View>
          )}

          <View>
            <Text style={[styles.labelFont, styles.labelHeader]}>Account activated: </Text>
            <Text style={styles.labelFont}>{this.props.accountActivated ? 'Yes' : 'No'}</Text>
          </View>
          <View>
            <Text style={[styles.labelFont, styles.labelHeader]}>Kinesis Balance: </Text>
            <Text style={styles.labelFont}>{this.props.kinesisBalance}</Text>
          </View>
          <View style={{display: 'none'}}>
            <Button title='Delete wallet' onPress={() => this.props.deleteWallet()} />
          </View>

        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    backgroundColor: '#1f2d3b',
    padding: 15,
  },
  labelFont: {
    color: '#d1edff',
    marginBottom: 5
  },
  labelHeader: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 10
  },
  textInput: {
    backgroundColor: '#d1edff',
    marginBottom: 15
  }
});
export const Balances = connect(mapStateToProps, mapDispatchToProps)(BalancesState)
