import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { BackNav } from './Navigation';
let Drawer = require('react-native-drawer').default;

export class Wallet extends React.Component<any, {walletId: string, open: boolean}> {
  static navigationOptions = (opt: any) => {
    return {
      header: <BackNav title='Wallet' navigation={opt.navigation} />
    }
  }
  constructor(props: any) {
    super(props)
    this.state = {
      open: true,
      walletId: ''
    }
  }

  render() {
    return (
        <Drawer
        type="displace"
        open={this.state.open}
        content={<WalletDrawer navigation={this.props.navigation} changeWallet={(walletId: string) => this.setState({walletId, open: false})} />}
        tweenHandler={(Drawer as any).tweenPresets.parallax}
        openDrawerOffset={50}
        styles={{}}
        acceptTap={true}
        acceptPan={true}
        closedDrawerOffset={10}
        >
         <Dashboard navigation={this.props.navigation} walletId={this.state.walletId} openNav={() => this.setState({open: true})} />
      </Drawer>
    );
  }
}

export class Dashboard extends React.Component<any, {}> {
  constructor(props: any) {
    super(props)
  }

  render() {
    return (
      <View style={styles.mainContent}>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignContent: 'center', backgroundColor: '#1b2835', height: 80}}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('DrawerOpen')}>
            <Text>Open Navbar</Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignContent: 'center', marginTop: 0, padding: 5}}>
          <Text style={{color: 'white'}} >dashboard {this.props.walletId}</Text>
        </View>
      </View>
    );
  }
}


export class WalletDrawer extends React.Component<any, {}> {
  constructor(props: any) {
    super(props)
  }

  render() {
    return (
      <View style={styles.drawerContent}>
        <View style={{flex: 1}}>
          <TouchableOpacity onPress={() => {
            this.props.changeWallet('heyllo')
          }} style={{flexDirection: 'row', justifyContent: 'center', alignContent: 'center', backgroundColor: '#354f67', marginTop: 18, margin: 12, padding: 8}}>
            <Text style={{color: 'white', fontSize: 16}} >wutupyos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Create')} style={{flexDirection: 'row', justifyContent: 'center', alignContent: 'center', marginTop: 0, borderWidth: 1, marginLeft: 12, marginRight: 12, padding: 8, borderColor: 'yellow'}}>
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
