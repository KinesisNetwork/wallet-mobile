import { createStore, combineReducers } from 'redux'
import { OptionState, options } from './options/'

export interface AppState {
  options: OptionState
}

const s = combineReducers<AppState>({
  options,
})

const w: any = window
export default createStore(s, w.__REDUX_DEVTOOLS_EXTENSION__ && w.__REDUX_DEVTOOLS_EXTENSION__())
