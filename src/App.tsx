import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native'

export class Wallet extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignContent: 'center'}}>
          <Image source={require('../images/logo.svg')} style={{ width: 60, height: 60 }} />
        </View>
        <Text style={{color: 'white'}} >hi</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2d3b',
  },
});
