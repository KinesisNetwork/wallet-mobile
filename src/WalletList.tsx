import * as _ from 'lodash'
import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { BackNav } from './Navigation';
import { Routes, Wallet, AppState } from './Routing'
let IoniconsIcon = require('react-native-vector-icons/Ionicons').default;

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
        <ScrollView style={{flex: 1, paddingTop: 5}}>
          { _.map(this.props.screenProps.appState.walletList, (wallet: Wallet, index) => {
            return (
              <TouchableOpacity key={index} onPress={() => {
                this.props.screenProps.setActiveWalletId(index)
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
        <TouchableOpacity onPress={() => this.props.screenProps.rootNavigation.navigate(Routes.accountScreen)} style={{
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

