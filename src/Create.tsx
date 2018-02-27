import React from 'react';
import { StyleSheet, Button, TextInput, Text, View } from 'react-native'
import { Header } from './Navigation';
import { AppState, Routes } from './Routing';
import { encryptPrivateKey } from './services/encryption';
let StellarBase = require('stellar-sdk')

export class Create extends React.Component<{screenProps: {
  setWalletList: Function, setAccountKeys: Function, appState: AppState
}, navigation: any}, {
  privateKey: string, publicKey: string, password: string, passwordVerify: string
}> {
  static navigationOptions = (opt: any) => {
    return {
      header: <Header navigation={opt.navigation} />
    }
  }
  constructor (props: any) {
    super(props)
    this.state = {
      privateKey: '',
      publicKey: '',
      password: '',
      passwordVerify: ''
    }
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
    // return addNewWallet(accountKey, encryptedPrivateKey)
    //   .then((walletList) => {
    console.warn('hello', encryptedPrivateKey, 'there', accountKey)
    // this.props.screenProp.setWalletList(walletList)
    // this.props.navigation.navigate(Routes.walletList, {walletIndex: 0})
      // }, (err: any) => {
      //   console.error(err)
      // })
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

  public handleSubmit() {
    this.importKeys()
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
        appState={this.props.screenProps.appState}
        handleSubmit={this.handleSubmit.bind(this)}
        generate={this.generate.bind(this)}
        handlePublic={this.handlePublic.bind(this)}
        handlePrivate={this.handlePrivate.bind(this)}
        handleVerifyPassword={this.handleVerifyPassword.bind(this)}
        handlePassword={this.handlePassword.bind(this)}
      />
    )
  }
}

export class CreateAccountPresentation extends React.Component<{
  appState: AppState,
  handleSubmit: Function,
  generate: Function,
  handlePublic: Function,
  handlePrivate: Function,
  handleVerifyPassword: Function,
  handlePassword: Function,
}, {}> {
  constructor (props: any) {
    super(props)
  }

  render() {
    return (
        <View style={styles.mainContent}>
          <Text style={{color: 'white', marginBottom: 5}}>Wallet Password</Text>
          <TextInput style={{backgroundColor: 'white', marginBottom: 15}} onChangeText={(text) => this.props.handlePassword(text)} secureTextEntry={true} />
          <Text style={{color: 'white', marginBottom: 5}}>Repeat Wallet Password</Text>
          <TextInput style={{backgroundColor: 'white', marginBottom: 15}} onChangeText={(text) => this.props.handleVerifyPassword(text)} secureTextEntry={true} />
          <Button title='Create Account' onPress={() => this.props.generate()} />
        </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    backgroundColor: '#1f2d3b',
    padding: 15
  },
});
