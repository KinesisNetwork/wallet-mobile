import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native'

export class Menu extends React.Component {
  render() {
    return (
      <View style={styles.menuContent}>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignContent: 'center', backgroundColor: '#2e4458', padding: 10}}>
          <Image source={require('../images/logo.png')} style={{ width: 48, height: 38, marginTop: 10, marginBottom: 10 }} />
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignContent: 'center', backgroundColor: '#2e4458', marginTop: 18, margin: 12, padding: 8, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)'}}>
          <Text style={{color: 'white', fontSize: 16}} >wutup</Text>
        </View>
        <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'center', alignContent: 'center', marginTop: 0, borderWidth: 1, marginLeft: 12, marginRight: 12, padding: 8, borderColor: 'yellow'}}>
          <Text style={{color: 'yellow'}}>Add Wallet</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  menuContent: {
    flex: 1,
    backgroundColor: '#2b3e50',
  },
});
