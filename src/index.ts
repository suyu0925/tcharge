'use strict'

import * as api from './lib/api'

export class TCharge {
  private readonly option: api.IOption

  public constructor(option: api.IOption) {
    this.option = option
  }

  public async getBalance(name?: string) {
    return await api.getBalance(this.option.account[0])
  }
}
