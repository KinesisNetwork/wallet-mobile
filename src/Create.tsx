import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

export class Create extends React.Component<{openNav: Function}, {}> {
  constructor(props: any) {
    super(props)
  }

  render() {
    return (
      <View style={styles.mainContent}>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignContent: 'center', backgroundColor: '#1b2835', height: 80}}>
          <TouchableOpacity onPress={() => this.props.openNav()}>
            <Text>Open Navbar</Text>
          </TouchableOpacity>
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
