import React from 'react'
import './shim.js'
import Routes from './build/Routing'

export default class App extends React.Component {
  render() {
    return <Routes />
  }
}
