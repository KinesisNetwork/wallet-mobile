import * as _ from 'lodash'
import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { BackNav } from './Navigation';
import { Routes } from './Routing'
let IoniconsIcon = require('react-native-vector-icons/Ionicons').default;
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux'
import { OptionActionCreators } from './store/root-actions'
import { AppState, Wallet } from './store/options/index'

interface StateProps {
  appState: AppState,
  navigation: any
}

const mapStateToProps: MapStateToProps<StateProps, any, any> = ({options}: any, ownProps: any) => ({
  appState: options,
  ...ownProps
})

interface DispatchProps {
  setActiveWalletIndex: (index: number) => any
}

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch, ownProps) => ({
  setActiveWalletIndex: async (index: number) => {
    dispatch(OptionActionCreators.changeConnection.create(index))
  }
})

type WalletListProps = StateProps & DispatchProps

export class WalletListState extends React.Component<WalletListProps, {}> {
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
        <ScrollView style={{flex: 1, paddingTop: 5}}>
          { _.map(this.props.appState.walletList, (wallet: Wallet, index) => {
            return (
              <TouchableOpacity key={index} onPress={() => {
                this.props.setActiveWalletIndex(index)
                this.props.navigation.navigate(Routes.dashboardScreen)
              }} style={{flexDirection: 'row', justifyContent: 'center', alignContent: 'center', backgroundColor: '#354f67', marginTop: 8, marginHorizontal: 12, marginBottom: 0, padding: 8}}>
                <View style={{flex: 1}}>
                  <Text style={{color: 'white', fontSize: 14}} >{wallet.publicKey}</Text>
                </View>
                <IoniconsIcon style={{margin: 8}} name='ios-arrow-forward-outline' size={21} color='#d1edff' />
              </TouchableOpacity>
            )
          })}
        </ScrollView>
        <TouchableOpacity onPress={() => this.props.navigation.navigate(Routes.accountScreen)} style={{
          flexDirection: 'row', justifyContent: 'center', alignContent: 'center', borderWidth: 1, margin: 12, padding: 8, borderColor: 'yellow'
        }}>
          <Text style={{color: 'yellow'}}>Add Wallet</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: '#2e4458',
  },
});

export const WalletList = connect(mapStateToProps, mapDispatchToProps)(WalletListState)
