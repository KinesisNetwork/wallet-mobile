import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native'
let FontAwesomeIcon = require('react-native-vector-icons/FontAwesome').default;
let SimpleLineIconsIcon = require('react-native-vector-icons/SimpleLineIcons').default;

export class Drawer extends React.Component<any, any> {
  static navigationOptions = (opt: any) => {
    return {
      header: <Header navigation={opt.navigation} />
    }
  }
  constructor(props: any) {
    super(props)
  }
  render() {
    return (
      <View style={styles.drawerContent}>
        <View style={{flex: 1}}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Dashboard')} style={{flexDirection: 'row', justifyContent: 'center', alignContent: 'center', backgroundColor: '#2e4458', marginTop: 18, margin: 12, padding: 8}}>
            <FontAwesomeIcon name="wallet" size={30} color="#999" />
            <Text style={{color: 'white', fontSize: 16}} >wutupyos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')} style={{flexDirection: 'row', justifyContent: 'center', alignContent: 'center', marginTop: 0, borderWidth: 1, marginLeft: 12, marginRight: 12, padding: 8, borderColor: 'yellow'}}>
            <Text style={{color: 'yellow'}}>Add Wallet</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export class Header extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }
  render() {
    return (
      <View style={styles.headerContent}>
        <View style={[styles.headerNavSections, {flexDirection: 'row', justifyContent: 'flex-start'}]}>
          <TouchableOpacity style={styles.headerNavButtons} onPress={
            () => {
              this.props.navigation.navigate('Dashboard')
            }
          }>
            <SimpleLineIconsIcon name="wallet" size={22} color="#d1edff" />
          </TouchableOpacity>
        </View>
        <View style={[styles.headerNavSections, {alignItems: 'center'}]}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Create')}>
            <Image source={require('../images/logo.png')} style={{ tintColor: '#d1edff', width: 35, height: 28, marginTop: 12, marginBottom: 12 }} />
          </TouchableOpacity>
        </View>
        <View style={[styles.headerNavSections, {flexDirection: 'row', justifyContent: 'flex-end'}]}>
          <TouchableOpacity style={styles.headerNavButtons} onPress={() => this.props.navigation.navigate('Create')}>
              <SimpleLineIconsIcon name="user-follow" size={22} color="#d1edff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerNavButtons} onPress={() => this.props.navigation.navigate('Settings')}>
              <SimpleLineIconsIcon name="options-vertical" size={22} color="#d1edff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: '#2b3e50',
  },
  headerContent: {
    paddingHorizontal: 12,
    backgroundColor: '#2b3e50',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerNavSections: {
    flex: 1,
  },
  headerNavButtons: {
    padding: 8
  }
});
