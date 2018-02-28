import React from 'react';
import { Text, View, ScrollView } from 'react-native'
import { getActiveWallet } from './helpers/wallets';
import { BackNav } from './Navigation';
import { AppState } from './Routing'
let StellarSdk: any = require('stellar-sdk')
import * as _ from 'lodash'

export interface HumanTransactions {
  txId: string
  txType: StellarTxType
  txData: any
  fee: number
  date: Date
  memo: string
  signatures: string[]
}

export enum StellarTxType {
  'Create Account' = 0,
  'Payment' = 1,
  'Path Payment' = 2,
  'Manage Offer' = 3,
  'Create Passive Offer' = 4,
  'Set Options' = 5,
  'Change Trust' = 6,
  'Allow Trust' = 7,
  'Account Merge' = 8,
  'Inflation' = 9,
  'Manage Data' = 10
}

export interface IState {
  transactions: HumanTransactions[]
  currentPage: any
  lastPage: boolean
  recentlyLoaded: boolean
}

const defaultState = { transactions: [], lastPage: false, currentPage: undefined, recentlyLoaded: false }
export class Transactions extends React.Component<{screenProps: {appState: AppState}}, IState> {
  static navigationOptions = (opt: any) => {
    return {
      header: <BackNav title='Wallet Transactions' navigation={opt.navigation} />
    }
  }
  constructor (props: any) {
    super(props)
    this.state = _.cloneDeep(defaultState)
  }

  async componentDidMount() {
    await this.transactionPage()
  }

  // To ensure we don't trigger the scroll event multiple times, we will force a wait of
  // 10 seconds before we consider loading more docs
  // public handleScroll () {
  //   const ele: any = document.getElementById('transactions')
  //   const triggerLoad = ele.scrollHeight - ele.scrollTop <= ele.clientHeight + 250
  //   if (triggerLoad && !this.state.lastPage && !this.state.recentlyLoaded) {
  //     this.setState({recentlyLoaded: true})
  //     this.transactionPage()

  //     setTimeout(() => this.setState({recentlyLoaded: false}), 3000)
  //   }
  // }

  public reloadTrasactions() {
    this.setState(_.cloneDeep(defaultState), () => {this.transactionPage()})
  }

  public async componentWillReceiveProps(nextProps: {screenProps: {appState: AppState}}) {
    let currentWalletIndex = _.get(nextProps, 'screenProps.appState.viewParams.walletIndex', null)
    let newWalletIndex = _.get(this.props, 'screenProps.appState.viewParams.walletIndex', null)
    if (currentWalletIndex !== newWalletIndex && newWalletIndex !== null) {
      this.setState(_.cloneDeep(defaultState), () => {this.transactionPage()})
    }
  }

  // TODO: Hook this up to a next page button that is hidden if lastPage === true
  async transactionPage (): Promise<void> {
    StellarSdk.Network.use(new StellarSdk.Network(this.props.screenProps.appState.connection.networkPassphrase))
    const server = new StellarSdk.Server(this.props.screenProps.appState.connection.horizonServer, {allowHttp: true})

    // Load 2 pages of records at a time, initializing if we do not yet have transactions
    const currentPage = this.state.currentPage
      ? this.state.currentPage
      : await server.transactions().forAccount(getActiveWallet(this.props.screenProps.appState).publicKey).order('desc').call()

    const nextPage = await currentPage.next()

    if (nextPage.records.length === 0) {
      this.setState({lastPage: true})
    }

    const records = currentPage.records.concat(nextPage.records)

    const transactions = _.flatten(await Promise.all(records.map(async (r: any) => {
      const operations = await r.operations()
      return operations._embedded.records.map((o: any) => {
        return {
          txId: r.id,
          txType: StellarTxType[o.type_i],
          txData: this.determineTxData(o),
          date: new Date(r.created_at),
          memo: r.memo,
          fee: _.round(r.fee_paid * 0.0000001, 8)
        }
      })
    })))

    this.setState({transactions: this.state.transactions.concat(transactions as any), currentPage: nextPage})
  }

  public renderTransactions (t: any, i: number) {
      const dynamicKeys = Object.keys(t.txData)
      return (
        <View key={i}>
          <View>
            <Text>{t.txType}</Text>
          </View>
          <View>
            <View>
              <Text>Tx Id</Text>
              <Text>{t.txId}</Text>
            </View>
            <View>
              <Text>Message</Text>
              <Text>{t.memo}</Text>
            </View>
            <View>
              <Text>Date</Text>
              <Text>{t.date.toISOString()}</Text>
            </View>
            <View>
              <Text>Fee</Text>
              <Text>{t.fee}</Text>
            </View>
            {
              dynamicKeys.map((d, k) => {
                return t.txData[d] && (
                  <View key={k}>
                    <Text>{d}</Text>
                    <Text>{t.txData[d]}</Text>
                  </View>
                )
              })
            }
          </View>
        </View>
      )
  }

  determineTxData (operation: any) {
    switch(operation.type) {
      case 'create_account':
        return {
          'Funder': operation.funder,
          'Starting Balance': operation.starting_balance,
          'Account Created': operation.account
        }
      case 'payment':
        return {
          'Asset Type': operation.asset_type === 'native' ? 'Kinesis' : operation.asset_type,
          'From': operation.from,
          'To': operation.to,
          'Amount': operation.amount
        }
      case 'set_options':
        return {
          'Signer Key': operation.signer_key,
          'Signer Weight': operation.signer_weight,
          'Master Key Weight': operation.master_key_weight,
          'Low Threshold': operation.low_threshold,
          'Mid Threshold': operation.med_threshold,
          'High Threshold': operation.high_threshold,
          'Home Domain': operation.home_domain,
          'Set Flags': operation.set_flags_s,
          'Clear Flags': operation.clear_flags_s,
        }
      default:
        return operation
    }
  }

  render() {
    return (
      <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
        { this.state.transactions.map((t, i) => this.renderTransactions(t, i)) }
      </ScrollView>
    )
  }
}
