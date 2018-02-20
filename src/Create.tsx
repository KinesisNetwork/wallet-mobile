import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'

export class Create extends React.Component<{openNav: Function}, {}> {
  constructor(props: any) {
    super(props)
  }

  render() {
    return (
      <View style={styles.mainContent}>
        <TouchableOpacity onPress={() => this.props.openNav()}>
          <Text>Open Navbar</Text>
        </TouchableOpacity>
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

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    backgroundColor: '#1f2d3b',
  },
});
