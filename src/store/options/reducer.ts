import { Action, ActionCreators } from './action'
import { defaultConnections, AppState } from './index'

const defaultState: AppState = {
  walletList: [],
  activeWalletIndex: 0,
  passwordMap: {},
  connection: defaultConnections[0],
  allConnections: defaultConnections
}

export function options (state: AppState = defaultState, action: Action): AppState {
  switch (action.type) {
    case ActionCreators.changeConnection.type:
      return { ...state, connection: action.payload }
    case ActionCreators.setWalletList.type:
      return { ...state, walletList: action.payload }
    case ActionCreators.setActiveWalletIndex.type:
      return { ...state, activeWalletIndex: action.payload }
    default:
      return state
  }
}
