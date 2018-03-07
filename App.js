import React from 'react'
import './shim.js'
console.disableYellowBox = true
import Routes from './build/Routing'

export default class App extends React.Component {
  render() {
    return <Routes />
  }
}
