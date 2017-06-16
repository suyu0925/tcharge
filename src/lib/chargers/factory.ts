'use strict'

import { Charger, IOption } from './charger'
import { LljyptCharge } from './lljypt'
import { Llt800Charge } from './llt800'
import { Sy666Charge } from './sy666'

export { Charger, IOption } from './charger'

export function create(option: IOption) {
  let result: Charger = null
  if (option.type === 'llt800') {
    result = new Llt800Charge(option)
  } else if (option.type === 'sy666') {
    result = new Sy666Charge(option)
  } else if (option.type === 'lljypt') {
    result = new LljyptCharge(option)
  }
  return result
}
