import React from 'react';
import { Alert, TouchableOpacity, ScrollView, StyleSheet, TextInput, Text, View } from 'react-native'
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux'
let StellarBase = require('js-kinesis-sdk')
import { Header } from './Navigation';
import { encryptPrivateKey } from './services/encryption';
import { addNewWallet } from './services/wallet_persistance';
import { Wallet } from './store/options/index';
import { retrieveWallets } from './services/wallet_persistance';
import { OptionActionCreators } from './store/root-actions'
import { AppState } from './store/options/index'
import { Routes } from './Routing';

const NOOP: () => void = () => {}

const enum AccountFields {
  accountName = 'accountName',
  privateKey = 'privateKey',
  publicKey = 'publicKey',
  password = 'password',
  passwordVerify = 'passwordVerify',
}

type AccountView = 'import' | 'generate'
type AccountProps = StateProps & DispatchProps

interface StateProps {
  appState: AppState,
  navigation: any
}

interface DispatchProps {
  setWalletList: Function,
  setActiveWalletIndex: Function,
}

interface CreateAccountProps extends StateProps, DispatchProps {
  accountView: AccountView,
}

interface AccountState {
  privateKey: string,
  publicKey: string,
  password: string,
  passwordVerify: string,
  accountName: string,
}

const mapStateToProps: MapStateToProps<StateProps, any, any> = ({options}: any, ownProps: any) => ({
  appState: options,
  ...ownProps
})

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch, ownProps) => ({
  setWalletList: async (walletList: Wallet[]) => {
    dispatch(OptionActionCreators.setWalletList.create(walletList))
  },
  setActiveWalletIndex: async (index: number) => {
    dispatch(OptionActionCreators.setActiveWalletIndex.create(index))
  }
})

const defaultState: AccountState = {
  privateKey: '',
  publicKey: '',
  password: '',
  passwordVerify: '',
  accountName: ''
}

export class CreateAccount extends React.Component<CreateAccountProps, AccountState> {

  public state: AccountState = {
    ...defaultState
  }

  public async componentDidMount() {
    const wallets = await retrieveWallets()
    this.props.setWalletList(wallets)
  }

  public generate = async (): Promise<void> => {
    const { accountName, password, passwordVerify } = this.state
    const [validName, validPassword] = await Promise.all([
      this.validateCondition(accountName, 'Account Creation Failed', 'Please provide an account name.'),
      this.verifyPassword(password, passwordVerify),
    ])

    if (validName && validPassword) {
      const accountKeys = StellarBase.Keypair.random()
      const [accountKey, privateKey]: any = [accountKeys.publicKey(), accountKeys.secret()]
      this.addNewWallet(accountKey, privateKey, password, accountName)
    }
  }

  private addNewWallet = async (accountKey: string, privateKey: string, password: string, accountName: string): Promise<void> => {
    const { navigation, setActiveWalletIndex, setWalletList } = this.props
    const encryptedPrivateKey = encryptPrivateKey(privateKey, password)
    const walletList = await addNewWallet(accountKey, encryptedPrivateKey, accountName)

    setWalletList(walletList)
    setActiveWalletIndex(0)
    this.setState({...defaultState}, () => {
      navigation.navigate(Routes.dashboardScreen)
    })
  }

  public setAlert = async ({ header, message }: { header: string , message: string }): Promise<boolean> => {
    Alert.alert(header, message, [{text: 'OK', onPress: NOOP }], { cancelable: false })
    return false
  }

  public validateCondition = async (condition: string | boolean, header: string, message: string): Promise<boolean> => {
    if (!condition) return await this.setAlert({ header, message })
    return true
  }

  public verifyPassword = async (password: string, passwordVerify: string): Promise<boolean> => {
    const pwCheck = this.validateCondition(password, 'Account Creation Failed', 'Please supply a password')
    const pvCheck = this.validateCondition(password === passwordVerify, 'Account Creation Failed', 'Please ensure both passwords match')
    const [validPassword, validPasswordVerify] = await Promise.all([ pwCheck, pvCheck ])

    return validPassword && validPasswordVerify
  }

  public importKeys = async (): Promise<boolean> => {
    const { accountName, password, passwordVerify, privateKey, publicKey } = this.state

    const validPublicKey = this.validateCondition(publicKey, 'Account Creation Failed', 'Please provide a valid public key')
    const validPrivateKey = this.validateCondition(privateKey, 'Account Creation Failed', 'Please provide a valid private key.')
    const validName = this.validateCondition(accountName, 'Account Creation Failed', 'Please provide an account name.')
    const validPassword = this.verifyPassword(password, passwordVerify)

    const criteria = await Promise.all([ validPublicKey, validPrivateKey, validName, validPassword ])

    if (criteria.every(c => c)) {
      this.addNewWallet(publicKey, privateKey, password, accountName)
      return true
    }
    return false
  }

  public handleFieldUpdate = (field: keyof AccountState) => (value: any) => {
    this.setState({ [field as any]: value })
  }

  render() {
    return (
      <CreateAccountPresentation
        accountName={this.state.accountName}
        accountView={this.props.accountView}
        appState={this.props.appState}
        generate={this.generate}
        handleFieldUpdate={this.handleFieldUpdate}
        importKeys={this.importKeys}
        password={this.state.password}
        passwordVerify={this.state.passwordVerify}
        privateKey={this.state.privateKey}
        publicKey={this.state.publicKey}
      />
    )
  }
}

interface AccountPresentationProps {
  accountName: string,
  accountView: AccountView,
  appState: AppState,
  generate: () => void,
  importKeys: () => void,
  handleFieldUpdate: (field: string) => (value: any) => void,
  password: string,
  passwordVerify: string,
  privateKey: string,
  publicKey: string,
}

export const CreateAccountPresentation: React.SFC<AccountPresentationProps> = ({
  accountName,
  accountView,
  generate,
  handleFieldUpdate,
  importKeys,
  password,
  passwordVerify,
  publicKey,
  privateKey
}) => (
  <ScrollView style={styles.mainContent}>
  {(accountView === 'generate') && (
    <View style={styles.panelContent}>
      <Text style={styles.labelFont}>Account Name</Text>
      <TextInput value={accountName} style={styles.textInput} onChangeText={handleFieldUpdate(AccountFields.accountName)} />
      <Text style={styles.labelFont}>Account Password</Text>
      <TextInput value={password} style={styles.textInput} onChangeText={handleFieldUpdate(AccountFields.password)} secureTextEntry />
      <Text style={styles.labelFont}>Repeat Account Password</Text>
      <TextInput value={passwordVerify} style={styles.textInput} onChangeText={handleFieldUpdate(AccountFields.passwordVerify)} secureTextEntry />
      <TouchableOpacity onPress={generate} style={styles.createAccountButton}>
        <Text style={styles.createAccountButtonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  )}
  {(accountView === 'import') && (
    <View style={styles.panelContent}>
      <Text style={styles.labelFont}>Account Name</Text>
      <TextInput value={accountName} style={styles.textInput} onChangeText={handleFieldUpdate(AccountFields.accountName)} />
      <Text style={styles.labelFont}>Account Password</Text>
      <TextInput value={password} style={styles.textInput} onChangeText={handleFieldUpdate(AccountFields.password)} secureTextEntry />
      <Text style={styles.labelFont}>Repeat Account Password</Text>
      <TextInput value={passwordVerify} style={styles.textInput} onChangeText={handleFieldUpdate(AccountFields.passwordVerify)} secureTextEntry />
      <Text style={styles.labelFont}>Public Key</Text>
      <TextInput value={publicKey} style={styles.textInput} onChangeText={handleFieldUpdate(AccountFields.publicKey)} />
      <Text style={styles.labelFont}>Private Key</Text>
      <TextInput value={privateKey} style={styles.textInput} onChangeText={handleFieldUpdate(AccountFields.privateKey)} />
      <TouchableOpacity onPress={importKeys} style={styles.createAccountButton}>
        <Text style={styles.createAccountButtonText}>Import Account</Text>
      </TouchableOpacity>
    </View>
  )}
  </ScrollView>
)

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    backgroundColor: '#1f2d3b',
    padding: 15,
  },
  labelFont: {
    color: '#d1edff',
    marginBottom: 10,
    marginTop: 4
  },
  textInput: {
    backgroundColor: '#d1edff',
    marginBottom: 15,
    padding: 12
  },
  panelContent: {
    flex: 1,
    paddingBottom: 60
  },
  createAccountButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    borderWidth: 1,
    padding: 8,
    borderColor: 'yellow',
  },
  createAccountButtonText: {
    color: 'yellow'
  },
});

class GenerateAccountWrapper extends React.Component<AccountProps, any> {
  static navigationOptions = (opt: any) => {
    return {
      header: <Header navigation={opt.navigation} />
    }
  }

  render() {
    return (<CreateAccount {...this.props} accountView='generate' />)
  }
}

class ImportAccountWrapper extends React.Component<AccountProps, any> {
  static navigationOptions = (opt: any) => {
    return {
      header: <Header navigation={opt.navigation} />
    }
  }

  render() {
    return (<CreateAccount {...this.props} accountView='import' />)
  }
}

export const ImportAccount = connect(mapStateToProps, mapDispatchToProps)(ImportAccountWrapper)
export const GenerateAccount = connect(mapStateToProps, mapDispatchToProps)(GenerateAccountWrapper)
