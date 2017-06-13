'use strict'

import * as lljypt from 'lljypt'
import * as llt800 from 'llt800'

export interface IAccount {
  name: string
  upstream: 'lljypt' | 'llt800'
  option: lljypt.Option | llt800.Option
}

export interface IOption {
  account: IAccount[]
}

export interface IGroup {
  National,
  Roaming,
  Provincial,
  Speical
}

export interface IChargeOption {
  phone: string
  group: Group
  packageSize: number
}

export async function getBalance(account: IAccount): number {
  if (account.upstream === 'llt800') {
        
  }
}
