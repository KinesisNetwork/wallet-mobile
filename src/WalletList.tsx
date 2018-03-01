import * as _ from 'lodash'
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { BackNav } from './Navigation';
import { Routes, Wallet, AppState } from './Routing'

export class WalletList extends React.Component<{
  screenProps: {appState: AppState, rootNavigation: any, setActiveWalletId: any}, navigation: any
}, {}> {
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
                this.props.screenProps.setActiveWalletId(index)
                this.props.navigation.navigate(Routes.dashboardScreen)
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

