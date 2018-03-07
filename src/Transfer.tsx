import * as React from 'react'
import { TouchableOpacity, ScrollView, StyleSheet, TextInput, Text, View } from 'react-native'
import * as _ from 'lodash'
import { AppState } from './Routing'
import { getActiveWallet, getActivePrivateKey } from './helpers/wallets'
import { isPaymentMultiSig } from './helpers/accounts';
import { BackNav } from './Navigation';
import { decryptPrivateKey } from './services/encryption';
let StellarSdk = require('stellar-sdk')

export interface Props {
  screenProps: {
    appState: AppState
  }
}

export interface State {
  targetAddress: string
  transferAmount: string
  memo: string
  loading: boolean
  password: string
  decryptedPrivateKey: string
}

export class Transfer extends React.Component<Props, State> {
  static navigationOptions = (opt: any) => {
    return {
      header: <BackNav title='Wallet Transfer' navigation={opt.navigation} />
    }
  }
  constructor (props: any) {
    super(props)
    this.state = {targetAddress: '', loading: false, memo: '', transferAmount: '', password: '', decryptedPrivateKey: ''}
  }

  async componentDidMount() {
    StellarSdk.Network.use(new StellarSdk.Network(this.props.screenProps.appState.connection.networkPassphrase))
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

  public async transferKinesis (targetAddress: string, amount: string): Promise<any> {
    const server = new StellarSdk.Server(this.props.screenProps.appState.connection.horizonServer, {allowHttp: true})
    // Get the most recent ledger to determine the correct baseFee
    const mostRecentLedger = await server.ledgers().order('desc').call()
    const currentBaseFeeInStroops = mostRecentLedger.records[0].base_fee_in_stroops
      ? mostRecentLedger.records[0].base_fee_in_stroops
      : mostRecentLedger.records[0].base_fee

    const currentBaseReserveInStroops = mostRecentLedger.records[0].base_reserve_in_stroops
      ? mostRecentLedger.records[0].base_reserve_in_stroops
      : Number(mostRecentLedger.records[0].base_reserve)

    // const currentBaseFee = _.round(currentBaseFeeInStroops * 0.0000001, 8)

    // The multiplier is defined here: https://www.stellar.org/developers/guides/concepts/fees.html
    const currentBaseReserve = _.round(currentBaseReserveInStroops * 0.0000001, 8) * 2

    let account

    try {
      account = await server.loadAccount(getActiveWallet(this.props.screenProps.appState).publicKey)
    } catch (e) {
      // return swal('Oops!', 'Your account does not have any funds to send money with', 'error')
      return false
    }

    const needMoreSigners = isPaymentMultiSig(account)

    const sequencedAccount = new StellarSdk.Account(getActiveWallet(this.props.screenProps.appState).publicKey, account.sequence)

    try {
      // We attempt to look up the target account. If this throws an error, we create
      // the account instead of transfering
      await server.loadAccount(targetAddress)
    } catch (e) {
      if (Number(amount) < currentBaseReserve) {
        // swal('Oops!', `You are transfering to an account without any funds. The minimum transfer required is ${currentBaseReserve} Kinesis`, 'error')
        return false
      }

      // const willCreate = await swal({
      //   title: `Continue with transfer?`,
      //   text: `
      //     The account that you are transfering with does not have any funds yet, are you sure you want to continue?
      //     The fee will be ${currentBaseFee} Kinesis
      //   `,
      //   icon: `warning`,
      //   dangerMode: true,
      //   buttons: true
      // })
      const willCreate = true

      if (!willCreate) {
        return
      }


      // If we get the correct error, we try call account creation
      let newAccountTransaction = new StellarSdk.TransactionBuilder(sequencedAccount, {fee: currentBaseFeeInStroops})
        .addOperation(StellarSdk.Operation.createAccount({
          destination: targetAddress,
          startingBalance: amount,
        }))
      .addMemo(StellarSdk.Memo.text(this.state.memo))
      .build()

      newAccountTransaction.sign(StellarSdk.Keypair.fromSecret(this.state.decryptedPrivateKey))

      if (needMoreSigners) {
        // return showMultiSigTransaction(newAccountTransaction)
        console.error('multisig not supported')
        return false
      }

      try {
        await server.submitTransaction(newAccountTransaction)
        // swal('Success!', 'Successfully submitted transaction', 'success')
      } catch (e) {
        // let opCode = _.get(e, 'data.extras.result_codes.operations[0]', _.get(e, 'message', 'Unkown Error'))
        console.error('Error occured submitting transaction', e)
        // swal('Oops!', `An error occurred while submitting the transaction to the network: ${opCode}`, 'error')
      }

      return
    }

    let paymentTransaction
    try {
      paymentTransaction = new StellarSdk.TransactionBuilder(sequencedAccount, {fee: currentBaseFeeInStroops})
        .addOperation(StellarSdk.Operation.payment({
          destination: targetAddress,
          asset: StellarSdk.Asset.native(),
          amount: amount,
        }))
        .addMemo(StellarSdk.Memo.text(this.state.memo))
        .build()

      paymentTransaction.sign(StellarSdk.Keypair.fromSecret(this.state.decryptedPrivateKey))

      if (needMoreSigners) {
        console.error('multisig not supported')
        // return showMultiSigTransaction(paymentTransaction)
        return false
      }
    } catch (e) {
      // return swal('Oops!', `This transaction is invalid: ${_.capitalize(e.message)}.`, 'error')
      return false
    }

    // const continueTransfer = await swal({
    //   title: 'Continue with transfer?',
    //   text: `Once submitted, the transaction can not be reverted! The fee will be ${currentBaseFee} Kinesis`,
    //   icon: 'warning',
    //   dangerMode: true,
    //   buttons: true
    // })
    const continueTransfer = true

    if (!continueTransfer) {
      return
    }

    try {
      await server.submitTransaction(paymentTransaction)
      // swal('Success!', 'Successfully submitted transaction', 'success')
    } catch (e) {
      // let opCode = _.get(e, 'data.extras.result_codes.operations[0]', _.get(e, 'message', 'Unkown Error'))
      console.error('Error occured submitting transaction', e)
      // swal('Oops!', `An error occurred while submitting the transaction to the network: ${opCode}`, 'error')
      return
    }

  }

  public async handleSubmit() {
    if (!this.state.targetAddress) {
      // await swal('Oops!', 'A target public key is required to transfer funds', 'error')
      return this.focusElement('transfer-public-key')
    }
    if (!this.state.transferAmount) {
      // await swal('Oops!', 'A transfer amount is required to transfer funds', 'error')
      return this.focusElement('transfer-amount')
    }

    let privateKey = getActivePrivateKey(this.props.screenProps.appState)
    if (!privateKey) {
      // await swal('Oops!', 'Please unlock your account to transfer funds', 'error')
      return this.focusElement('wallet-password')
    }
    this.transferKinesis(this.state.targetAddress, this.state.transferAmount)
  }

  private focusElement = (id: string): void => {
    console.warn('fill this:', id)
  }

  public handleAddress(text: any) {
    this.setState({targetAddress: text})
  }

  public async handleMemo(text: string) {
    const memo = text
    if (memo.length >= 25) {
      // return await swal('Oops!', 'The message field must be fewer than 25 characters long', 'error')
    }
    this.setState({memo: memo})
  }

  public handleAmount(text: string) {
    this.setState({transferAmount: text})
  }

  render() {
    return (
      <TransferPresentation
        appState={this.props.screenProps.appState}
        handleAddress={this.handleAddress.bind(this)}
        handlePassword={this.handlePassword.bind(this)}
        unlockWallet={this.unlockWallet.bind(this)}
        handleAmount={this.handleAmount.bind(this)}
        handleSubmit={this.handleSubmit.bind(this)}
        handleMemo={this.handleMemo.bind(this)}
        targetAddress={this.state.targetAddress}
        transferAmount={this.state.transferAmount}
        memo={this.state.memo}
        password={this.state.password}
        privateKey={this.state.decryptedPrivateKey}
        loading={this.state.loading}
      />
    )
  }
}

export class TransferPresentation extends React.Component<{
  appState: AppState,
  handleAddress: Function,
  handlePassword: Function,
  unlockWallet: Function,
  handleAmount: Function,
  handleSubmit: Function,
  handleMemo: Function,
  targetAddress: string,
  password: string,
  privateKey: string,
  transferAmount?: any,
  memo?: string,
  loading: boolean
}, {}> {
  constructor (props: any) {
    super(props)
  }

  render() {
    return (
      <ScrollView style={styles.mainContent}>
        {
          this.props.loading ? (
            <View>
              <Text style={styles.labelFont}>Loading</Text>
            </View>
          ) : (
            <View>
              {(this.props.privateKey) ? (
                <View>
                  <Text style={styles.labelFont}>Target Account</Text>
                  <TextInput value={this.props.targetAddress} style={styles.textInput} onChangeText={(text: string) => this.props.handleAddress(text)} />
                  <Text style={styles.labelFont}>Amount</Text>
                  <TextInput value={this.props.transferAmount} style={styles.textInput} onChangeText={(text: string) => this.props.handleAmount(text)} />
                  <Text style={styles.labelFont}>Message (Optional)</Text>
                  <TextInput value={this.props.memo} style={styles.textInput} onChangeText={(text) => this.props.handleMemo(text)} />
                  <TouchableOpacity onPress={() => this.props.handleSubmit()} style={{
                    flexDirection: 'row', justifyContent: 'center', alignContent: 'center', borderWidth: 1, padding: 8, borderColor: 'yellow'
                  }}>
                    <Text style={{color: 'yellow'}}>Transfer</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <Text style={styles.labelFont}>Password</Text>
                  <TextInput value={this.props.password} style={styles.textInput} onChangeText={(text) => this.props.handlePassword(text)} />
                  <TouchableOpacity onPress={() => this.props.unlockWallet()} style={{
                    flexDirection: 'row', justifyContent: 'center', alignContent: 'center', borderWidth: 1, padding: 8, borderColor: 'yellow'
                  }}>
                    <Text style={{color: 'yellow'}}>Unlock</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )
        }
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
