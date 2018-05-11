import React from 'react'
import { connect } from 'react-redux'
import { View, Text, TouchableOpacity } from 'react-native'
let SimpleLineIconsIcon = require('react-native-vector-icons/SimpleLineIcons').default;

class Notification extends React.Component<any, any> {
  render() {
    return (
      <View
        style={{
          display: 'flex',
          alignSelf: 'stretch',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'crimson',
          top: 0,
          padding: 10,
          height: 65
        }}
      >
        <TouchableOpacity style={{
          alignSelf: 'stretch'
        }}>
          <SimpleLineIconsIcon style={{ }} name={'social-twitter'} size={18} color={'white'} />
          <Text>MESSAGE GOES HEREs</Text>
        </TouchableOpacity>
      </View>
    )
  }

}

export default connect()(Notification)
// export default connect(({ notification }) => notification)(Notification)
