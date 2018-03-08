import React from 'react';
import { TouchableOpacity, ScrollView, StyleSheet, TextInput, Text, View } from 'react-native'
import { Header } from './Navigation';
import { encryptPrivateKey } from './services/encryption';
import { addNewWallet } from './services/wallet_persistance';
let StellarBase = require('stellar-sdk')
type AccountView = 'import' | 'generate'
import { Wallet } from './store/options/index';
import { retrieveWallets } from './services/wallet_persistance';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux'
import { OptionActionCreators } from './store/root-actions'
import { AppState } from './store/options/index'
import { Routes } from './Routing';

interface StateProps {
  appState: AppState,
  navigation: any
}

const mapStateToProps: MapStateToProps<StateProps, any, any> = ({options}: any, ownProps: any) => ({
  appState: options,
  ...ownProps
})

interface DispatchProps {
  setWalletList: Function,
  setActiveWalletIndex: Function,
}

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch, ownProps) => ({
  setWalletList: async (walletList: Wallet[]) => {
    dispatch(OptionActionCreators.setWalletList.create(walletList))
  },
  setActiveWalletIndex: async (index: number) => {
    dispatch(OptionActionCreators.setActiveWalletIndex.create(index))
  }
})

type AccountProps = StateProps & DispatchProps

export class GenerateAccountWrapper extends React.Component<AccountProps, any> {
  static navigationOptions = (opt: any) => {
    return {
      header: <Header navigation={opt.navigation} />
    }
  }
  constructor (props: any) {
    super(props)
  }
  render() {
    return (<CreateAccount {...this.props} accountView='generate' />)
  }
}

export class ImportAccountWrapper extends React.Component<AccountProps, any> {
  static navigationOptions = (opt: any) => {
    return {
      header: <Header navigation={opt.navigation} />
    }
  }
  constructor (props: any) {
    super(props)
  }
  render() {
    return (<CreateAccount {...this.props} accountView='import' />)
  }
}

const defaultState = {
  privateKey: '',
  publicKey: '',
  password: '',
  passwordVerify: ''
}

export class CreateAccount extends React.Component<
  { setActiveWalletIndex: Function, setWalletList: Function, appState: AppState, navigation: any, accountView: AccountView },
  { privateKey: string, publicKey: string, password: string, passwordVerify: string }>
{
  constructor (props: any) {
    super(props)
    this.state = {...defaultState}
  }

  public componentDidMount() {
     retrieveWallets()
      .then((wallets: Wallet[]) => this.props.setWalletList(wallets))
  }

  public async generate() {
    let validPassword = await this.verifyPassword(this.state.password, this.state.passwordVerify, 'generate')
    if (validPassword) {
      const accountKeys = StellarBase.Keypair.random()
      const [accountKey, privateKey]: any = [accountKeys.publicKey(), accountKeys.secret()]
      this.addNewWallet(accountKey, privateKey, this.state.password)
    }
  }

  private addNewWallet(accountKey: string, privateKey: string, password: string) {
    let encryptedPrivateKey = encryptPrivateKey(privateKey, password)
    return addNewWallet(accountKey, encryptedPrivateKey)
      .then((walletList) => {
        this.props.setWalletList(this.props.appState.walletList.concat({
          publicKey: accountKey,
          encryptedPrivateKey: encryptedPrivateKey
        }))
        this.props.setActiveWalletIndex(walletList.length - 1)
        this.setState({...defaultState}, () => {
          this.props.navigation.navigate(Routes.dashboardScreen)
        })
      })
  }

  public async verifyPassword(password: string, passwordVerify: string, accountType: 'generate' | 'import'): Promise<boolean> {
    if (!password) {
      return false
    }
    if (password !== passwordVerify) {
      return false
    }
    return true
  }

  public async importKeys() {
    if (!this.state.publicKey) {
      return false
    }
    if (!this.state.privateKey) {
      return false
    }
    let validPassword = await this.verifyPassword(this.state.password, this.state.passwordVerify, 'import')
    if (validPassword) {
      this.addNewWallet(this.state.publicKey, this.state.privateKey, this.state.password)
      return true
    }
    return false

  }

  public handlePublic(publicKey: string) {
    this.setState({publicKey: publicKey})
  }

  public handlePrivate(privateKey: string) {
    this.setState({privateKey: privateKey})
  }

  public handleVerifyPassword(passwordVerify: string) {
    this.setState({passwordVerify: passwordVerify})
  }

  public handlePassword(password: string) {
    this.setState({password: password})
  }

  render() {
    return (
      <CreateAccountPresentation
        accountView={this.props.accountView}
        appState={this.props.appState}
        importKeys={this.importKeys.bind(this)}
        generate={this.generate.bind(this)}
        handlePublic={this.handlePublic.bind(this)}
        handlePrivate={this.handlePrivate.bind(this)}
        handleVerifyPassword={this.handleVerifyPassword.bind(this)}
        handlePassword={this.handlePassword.bind(this)}
        privateKey={this.state.privateKey}
        publicKey={this.state.publicKey}
        password={this.state.password}
        passwordVerify={this.state.passwordVerify}
      />
    )
  }
}

export class CreateAccountPresentation extends React.Component<{
  accountView: AccountView,
  appState: AppState,
  importKeys: Function,
  generate: Function,
  handlePublic: Function,
  handlePrivate: Function,
  handleVerifyPassword: Function,
  handlePassword: Function,
  privateKey: string,
  publicKey: string,
  password: string,
  passwordVerify: string
}, {}> {
  constructor (props: any) {
    super(props)
  }

  render() {
    return (
        <ScrollView style={styles.mainContent}>
        {(this.props.accountView === 'generate') && (
          <View style={{flex: 1, paddingBottom: 60 }}>
            <Text style={styles.labelFont}>Wallet Password</Text>
            <TextInput value={this.props.password} style={styles.textInput} onChangeText={(text) => this.props.handlePassword(text)} secureTextEntry={true} />
            <Text style={styles.labelFont}>Repeat Wallet Password</Text>
            <TextInput value={this.props.passwordVerify} style={styles.textInput} onChangeText={(text) => this.props.handleVerifyPassword(text)} secureTextEntry={true} />
            <TouchableOpacity onPress={() => this.props.generate()} style={{
              flexDirection: 'row', justifyContent: 'center', alignContent: 'center', borderWidth: 1, padding: 8, borderColor: 'yellow'
            }}>
              <Text style={{color: 'yellow'}}>Create Account</Text>
            </TouchableOpacity>
          </View>
        )}
        {(this.props.accountView === 'import') && (
          <View style={{flex: 1, paddingBottom: 60 }}>
            <Text style={styles.labelFont}>Public Key</Text>
            <TextInput value={this.props.publicKey} style={styles.textInput} onChangeText={(text) => this.props.handlePublic(text)} />
            <Text style={styles.labelFont}>Private Key</Text>
            <TextInput value={this.props.privateKey} style={styles.textInput} onChangeText={(text) => this.props.handlePrivate(text)} />
            <Text style={styles.labelFont}>Wallet Password</Text>
            <TextInput value={this.props.password} style={styles.textInput} onChangeText={(text) => this.props.handlePassword(text)} secureTextEntry={true} />
            <Text style={styles.labelFont}>Repeat Wallet Password</Text>
            <TextInput value={this.props.passwordVerify} style={styles.textInput} onChangeText={(text) => this.props.handleVerifyPassword(text)} secureTextEntry={true} />
            <TouchableOpacity onPress={() => this.props.importKeys()} style={{
              flexDirection: 'row', justifyContent: 'center', alignContent: 'center', borderWidth: 1, padding: 8, borderColor: 'yellow'
            }}>
              <Text style={{color: 'yellow'}}>Import Keys</Text>
            </TouchableOpacity>
          </View>
        )}
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
  textInput: {
    backgroundColor: '#d1edff',
    marginBottom: 15
  },
});

export const ImportAccount = connect(mapStateToProps, mapDispatchToProps)(ImportAccountWrapper)
export const GenerateAccount = connect(mapStateToProps, mapDispatchToProps)(GenerateAccountWrapper)
