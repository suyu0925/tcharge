'use strict'

import { Lljypt as Agent } from 'lljypt'
import * as lljypt from 'lljypt'
import {
  Charger, IChargeRequest, IOption,
  IReport, Status, Type
} from './charger'

export class LljyptCharge extends Charger {
  private agent: Agent
  private agentOption: lljypt.Option

  public constructor(option: IOption) {
    super(option)

    const agentOption: lljypt.Option = {
      baseUrl: option.baseUrl,
      clientId: parseInt(option.client, 10),
      key: option.key,
      merchant: parseInt(option.account, 10)
    }
    this.agent = new Agent(agentOption)
  }

  public async getBalance() {
    return await this.agent.getBalance()
  }

  public async charge(chargeReq: IChargeRequest) {
    // TODO: get product through phone and group, packageSize
    const product = 21522 // 全国移动
    const taskId = await this.agent.charge(chargeReq.phone, product, chargeReq.outTradeNo)
    return taskId.toString()
  }

  public async queryOrder(outTradeNo: string) {
    const status = await this.agent.queryOrder(outTradeNo)
    return this.convertStatus(status)
  }

  public parseCallback(data: object) {
    const result: IReport[] = []
    const report = this.agent.parseCallback(data)
    result.push(this.convertReport(report))
    return result
  }

  public feedback(done: boolean) {
    return this.agent.feedback(done)
  }

  private convertStatus(status: lljypt.Status): Status {
    let result: Status = Status.Unknown
    switch (status) {
      case lljypt.Status.Sucess:
        result = Status.Done
        break
      case lljypt.Status.Fail:
        result = Status.Failed
        break
      case lljypt.Status.Charging:
        result = Status.Charging
        break
      default:
        // ignore
        break
    }
    return result
  }

  private convertReport(report: lljypt.CallbackRequest): IReport {
    const result: IReport = {
      outTradeNo: report.outTradeNo,
      status: this.convertStatus(report.status),
      type: this.option.type
    }
    return result
  }
}
