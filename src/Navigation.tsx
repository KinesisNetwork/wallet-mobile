import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native'

export class Menu extends React.Component {
  render() {
    return (
      <View style={styles.menuContent}>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignContent: 'center', backgroundColor: '#2e4458'}}>
          <Image source={require('../images/logo.png')} style={{ width: 50, height: 40, marginTop: 10, marginBottom: 10 }} />
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignContent: 'center', backgroundColor: '#2e4458', marginTop: 10, padding: 5}}>
          <Text style={{color: 'white'}} >wutup</Text>
        </View>
        <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'center', alignContent: 'center', marginTop: 0, padding: 5}}>
          <Text>Add Wallet</Text>
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
