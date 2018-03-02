import * as _ from 'lodash'
import React from 'react';
import { TouchableOpacity, StyleSheet, Text, ScrollView, View } from 'react-native'
import { BackNav } from './Navigation';

export interface Connection {
  horizonServer: string,
  connectionName: string,
  networkPassphrase: string
}

// This should most certainly be part of react state
//
export let defaultConnections: Connection[] = [{
  horizonServer: 'https://stellar-local.abx.com',
  networkPassphrase: 'Test SDF Network ; September 2015',
  connectionName: 'Local Development Network'
}, {
  horizonServer: 'https://kinesis-test-net.abx.com',
  networkPassphrase: 'Kinesis Test Network ; February 2018',
  connectionName: 'Kinesis Test Network'
}, {
  horizonServer: 'https://horizon-testnet.stellar.org/',
  networkPassphrase: 'Test SDF Network ; September 2015',
  connectionName: 'Stellar Test Network'
}]

export class Settings extends React.Component<{screenProps: {appState: any, changeConnection: Function}}, {horizonServer: string, networkPassphrase: string, connectionName: string}> {
  static navigationOptions = (opt: any) => {
    return {
      header: <BackNav title='Settings' navigation={opt.navigation} />
    }
  }
  constructor (props: any) {
    super(props)
    this.state = {horizonServer: '', networkPassphrase: '', connectionName: ''}
  }
  public componentWillReceiveProps(nextProps: any) {
    console.warn(nextProps)
  }

  public async changeHorizonServer(horizonServer: string) {
    this.setState({horizonServer})
  }

  public async changeNetworkPassphrase(networkPassphrase: string) {
    this.setState({networkPassphrase})
  }

  public async changeConnectionName(connectionName: string) {
    this.setState({connectionName})
  }

  public async changeConnection(connection: Connection) {
    this.props.screenProps.changeConnection(connection)
    console.warn('Success', `Connected to ${connection.connectionName}`, 'success')
  }

  render() {
    return (
      <SettingsPresentation
        appState={this.props.screenProps.appState}
        changeConnectionName={this.changeConnectionName.bind(this)}
        changeConnection={this.changeConnection.bind(this)}
        changeNetworkPassphrase={this.changeNetworkPassphrase.bind(this)}
        changeHorizonServer={this.changeHorizonServer.bind(this)}
        horizonServer={this.state.horizonServer}
        networkPassphrase={this.state.networkPassphrase}
        connectionName={this.state.connectionName}
        defaultConnections={defaultConnections}
      />
    )
  }
}


export class SettingsPresentation extends React.Component<any, {}> {
  constructor(props: any) {
    super(props)
  }

  render() {
    return (
      <ScrollView style={styles.mainContent}>
        {
          this.props.defaultConnections.map((connection: Connection, index: number) => {
            console.log(this.props.appState.connection)
            let activeNetwork: boolean = connection === this.props.appState.connection
            return (
              <View key={index} style={{marginTop: 8, padding: 12, backgroundColor: activeNetwork ? '#3e5468' : '#2e4458'}}>
                <TouchableOpacity onPress={() => {this.props.changeConnection(connection)}} style={{
                  width: '100%',
                }}>
                  <Text style={[styles.labelFont, {fontWeight: 'bold', fontSize: 15, color: 'white'}]}>{_.toUpper(connection.connectionName)}</Text>
                  <Text style={[styles.labelFont, {marginBottom: -2}]}>{connection.horizonServer}</Text>
                  <Text style={styles.labelFont}>{connection.networkPassphrase}</Text>
                </TouchableOpacity>
              </View>
            )
          })
        }
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    backgroundColor: '#1f2d3b',
    padding: 15
  },
  labelFont: {
    color: '#d1edff',
    marginBottom: 5
  },
  textInput: {
    backgroundColor: 'white',
    marginBottom: 15
  },
});

