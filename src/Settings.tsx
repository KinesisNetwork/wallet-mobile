import * as _ from 'lodash'
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux'
import { OptionActionCreators } from './store/root-actions'
import React from 'react'
import { TouchableOpacity, StyleSheet, Text, ScrollView, View } from 'react-native'
let FeatherIcon = require('react-native-vector-icons/Feather').default;
import { BackNav } from './Navigation'
import { Connection } from './store/options/index';
import { AppState } from './store/options/index'

interface StateProps {
  appState: AppState,
  navigation: any
}

const mapStateToProps: MapStateToProps<StateProps, any, any> = ({options}: any, ownProps: any) => ({
  appState: options,
  ...ownProps
})

interface DispatchProps {
  changeConnection: (connection: Connection) => any
}

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch, ownProps) => ({
  changeConnection: async (connection: Connection) => {
    dispatch(OptionActionCreators.changeConnection.create(connection))
  }
})

type SettingsProps = StateProps & DispatchProps

export class SettingsState extends React.Component<SettingsProps, {horizonServer: string, networkPassphrase: string, connectionName: string}> {
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

  render() {
    return (
      <SettingsPresentation
        appState={this.props.appState}
        changeConnectionName={this.changeConnectionName.bind(this)}
        changeConnection={this.props.changeConnection.bind(this)}
        changeNetworkPassphrase={this.changeNetworkPassphrase.bind(this)}
        changeHorizonServer={this.changeHorizonServer.bind(this)}
        horizonServer={this.state.horizonServer}
        networkPassphrase={this.state.networkPassphrase}
        connectionName={this.state.connectionName}
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
          this.props.appState.allConnections.map((connection: Connection, index: number) => {
            console.log(this.props.appState.connection)
            let activeNetwork: boolean = connection === this.props.appState.connection
            return (
              <View key={index} style={{marginTop: 8, padding: 12, backgroundColor: activeNetwork ? '#3e5468' : '#2e4458', flexDirection: 'row', justifyContent: 'center'}}>
                <View style={{marginRight: 10, alignContent: 'center', justifyContent: 'center'}}>
                  <FeatherIcon style={{margin: 8}} name={activeNetwork ? 'check-circle' : 'circle' } size={21} color='#d1edff' />
                </View>
                <TouchableOpacity onPress={() => {this.props.changeConnection(connection)}} style={{
                  flex: 1,
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

export const Settings = connect(mapStateToProps, mapDispatchToProps)(SettingsState)
