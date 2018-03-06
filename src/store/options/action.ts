import { ActionCreator } from 'react-redux-typescript'

export enum Actions {
  changeConnection = 'CHANGE_CONNECTION',
  setWalletList = 'SET_WALLET_LIST'
}

export const ActionCreators = {
  changeConnection: new ActionCreator<Actions.changeConnection, any>(Actions.changeConnection),
  setWalletList: new ActionCreator<Actions.setWalletList, any>(Actions.setWalletList),
}

export type Action = typeof ActionCreators[keyof typeof ActionCreators]
