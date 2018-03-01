import { Wallet } from '../Routing';
import { AsyncStorage } from 'react-native'
const walletsKey = 'wallets'

export function addNewWallet(publicKey: string, encryptedPrivateKey: string): Promise<Wallet[]> {
  const walletEntry = { publicKey, encryptedPrivateKey }

  return retrieveWallets()
    .then((wallets: Wallet[]) => {
      const newWalletList = [walletEntry].concat(wallets || [])
      return saveWallets(newWalletList)
    })
}

export async function retrieveWallets(): Promise<Wallet[]> {
  let wallets: string = await AsyncStorage.getItem(walletsKey);
  if (wallets) {
    return JSON.parse(wallets)
  }
  return []
}

export async function saveWallets(newWalletList: any): Promise<Wallet[]> {
  let stringifiedWallets = JSON.stringify(newWalletList)
  await AsyncStorage.setItem(walletsKey, stringifiedWallets);
  return newWalletList
}

export function deleteWallet(accountId: string): Promise<Wallet[]> {
  return retrieveWallets()
    .then((wallets: any[]) => {
      let newList = wallets.filter((wallet: any) => wallet.publicKey !== accountId)
      return saveWallets(newList)
    })
}

