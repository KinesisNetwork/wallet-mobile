import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native'
import Drawer from 'react-native-drawer'

export class Menu extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignContent: 'center', backgroundColor: '#2e4458'}}>
          <Image source={require('../images/logo.png')} style={{ width: 58, height: 45, marginTop: 10, marginBottom: 10 }} />
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignContent: 'center', backgroundColor: '#2e4458', marginTop: 10, padding: 5}}>
          <Text style={{color: 'white'}} >wutup</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignContent: 'center', marginTop: 0, padding: 5}}>
          <Text style={{color: 'white'}} >heythere</Text>
        </View>
      </View>
    );
  }
}


export class Wallet extends React.Component {
  public render() {
    return (
      <Drawer
        type="displace"
        open={true}
        content={<Menu />}
        tweenHandler={(Drawer as any).tweenPresets.parallax}
        openDrawerOffset={50}
        styles={drawerStyles}
        acceptTap={true}
        acceptPan={true}
        closedDrawerOffset={10}
        >
        <View style={[styles.container, {padding: 20}]}>
          <Text style={{color: 'white'}}>Hello</Text>
        </View>
      </Drawer>
    )
  }
}

const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.9, shadowRadius: 8},
  main: {
    paddingLeft: 0,
    shadowColor: '#000000',
    shadowOpacity: 0.9,
    shadowRadius: 8
  },
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2d3b',
  },
});
