import React from 'react';
import Drawer from 'react-native-drawer'
import { Menu } from './Navigation';
import { Create } from './Create';

export class Wallet extends React.Component<any, {open: boolean}> {
  constructor(props: any) {
    super(props)
    this.state = {
      open: true
    }
  }
  public render() {
    return (
      <Drawer
        type="displace"
        open={this.state.open}
        content={<Menu />}
        tweenHandler={(Drawer as any).tweenPresets.parallax}
        openDrawerOffset={50}
        styles={drawerStyles}
        acceptTap={true}
        acceptPan={true}
        closedDrawerOffset={0}
        >
         <Create openNav={() => this.setState({open: true})} />
      </Drawer>
    )
  }
}

const drawerStyles = {
  drawer: {
  },
  main: {
    paddingLeft: 0,
    shadowColor: '#000000',
    shadowOpacity: 0.9,
    shadowRadius: 8
  },
}
