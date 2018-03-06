export interface AppState {
  walletList: Wallet[],
  activeWalletIndex: number,
  passwordMap: PasswordMap,
  connection: Connection,
  allConnections: Connection[]
}

export interface PasswordMap {
  [accountId: string]: {
    timestamp: number,
    password: string
  }
}

export interface ViewParams {
  walletIndex?: number
}

export interface Wallet {
  publicKey: string,
  encryptedPrivateKey: string,
  accountName?: string
}

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

export * from './action'
export * from './reducer'
