import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native'
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

export class Settings extends React.Component<{appState: any, changeConnection: Function}, {horizonServer: string, networkPassphrase: string, connectionName: string}> {
  static navigationOptions = (opt: any) => {
    return {
      header: <BackNav title='Settings' navigation={opt.navigation} />
    }
  }
  constructor (props) {
    super(props)
    this.state = {horizonServer: '', networkPassphrase: '', connectionName: ''}
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
    // this.props.changeConnection(connection)
    console.warn('Success', `Connected to ${connection.connectionName}`, 'success')
  }

  public async addConnection(ev) {
    ev.preventDefault()
    if (!this.state.connectionName) {
    }
    if (!this.state.horizonServer) {
    }
    if (!this.state.networkPassphrase) {
    }

    defaultConnections.push({
      horizonServer: this.state.horizonServer,
      networkPassphrase: this.state.networkPassphrase,
      connectionName: this.state.connectionName,
    })
    this.setState({
      horizonServer: '',
      networkPassphrase: '',
      connectionName: '',
    })
  }

  render() {
    return (
      <SettingsPresentation
        appState={this.props.appState}
        changeConnectionName={this.changeConnectionName.bind(this)}
        changeConnection={this.changeConnection.bind(this)}
        addConnection={this.addConnection.bind(this)}
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
      <View style={styles.mainContent}>
        <View style={{marginTop: 35}}>
            <Text>Select Network</Text>
            {
              this.props.defaultConnections.map((connection: Connection, index: number) => {
                // let activeNetwork = connection === this.props.appState.connection
                return (
                  <View key={index} style={{marginTop: 5}}>
                    <TouchableOpacity onPress={() => {this.props.changeConnection(connection)}} style={{width: '100%'}}>
                      <Text>{connection.connectionName}</Text>
                      <Text>{connection.horizonServer}</Text>
                      <Text>{connection.networkPassphrase}</Text>
                    </TouchableOpacity>
                  </View>
                )
              })
            }
          </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    backgroundColor: '#1f2d3b',
  },
});
