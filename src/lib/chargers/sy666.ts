'use strict'

import { default as Agent } from 'sy666'
import * as sy666 from 'sy666'
import {
  Charger, Group, IChargeRequest, IOption,
  IReport, Status, Type
} from './charger'

export class Sy666Charge extends Charger {
  private agent: Agent
  private agentOption: sy666.IOption

  public constructor(option: IOption) {
    super(option)

    const agentOption: sy666.IOption = {
      account: option.account,
      key: option.key,
      retUrl: option.retUrl,
      url: option.baseUrl
    }
    this.agent = new Agent(agentOption)
  }

  public async getBalance() {
    return await this.agent.getBalance()
  }

  public async charge(chargeReq: IChargeRequest) {
    const roaming = (chargeReq.group === Group.National || chargeReq.group === Group.Roaming)
    return await this.agent.charge(chargeReq.phone, chargeReq.packageSize, chargeReq.outTradeNo, roaming)
  }

  public async queryOrder(outTradeNo: string) {
    const status = await this.agent.queryOrder(outTradeNo)
    return this.convertStatus(status)
  }

  public parseCallback(data: object) {
    const req = this.agent.parseCallback(data)
    const result: IReport[] = [{
      outTradeNo: req.Orderid,
      status: this.convertStatus(req.Orderstatu_int),
      type: this.option.type
    }]
    return result
  }

  public feedback(done: boolean) {
    return this.agent.feedback(done)
  }

  private convertStatus(status: sy666.Status): Status {
    let result: Status = Status.Unknown
    switch (status) {
      case sy666.Status.Canceling:
        result = Status.Canceling
        break
      case sy666.Status.CancleFailed:
        result = Status.Failed
        break
      case sy666.Status.Waitting:
        result = Status.Waitting
        break
      case sy666.Status.Pending:
        result = Status.Pending
        break
      case sy666.Status.Doing:
        result = Status.Doing
        break
      case sy666.Status.Charing:
        result = Status.Charging
        break
      case sy666.Status.ChargeFailed:
        result = Status.Failed
        break
      case sy666.Status.Freezed:
        result = Status.Freezed
        break
      default:
        // ignore
        break
    }
    return result
  }
}
