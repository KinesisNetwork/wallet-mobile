import * as _ from 'lodash'
import { Action, ActionCreators } from './action'
import { defaultConnections, AppState } from './index'

const defaultState: OptionState = {
  walletList: [],
  activeWalletIndex: 0,
  passwordMap: {},
  connection: defaultConnections[0],
  allConnections: defaultConnections
}

export function options (state: OptionState = defaultState, action: Action): OptionState {
  switch (action.type) {
    case ActionCreators.changeConnection.type:
      return { ...state, action.payload.connection }
    case ActionCreators.setWalletList.type:
      return { ...state, action.payload.walletList }
    default:
      return state
  }
}
