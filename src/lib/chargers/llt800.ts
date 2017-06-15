'use strict'

import { default as Agent } from 'llt800'
import * as llt800 from 'llt800'
import {
  Charger, IChargeRequest, IOption,
  IReport, Status, Type
} from './charger'

export class Llt800Charge extends Charger {
  private agent: Agent
  private agentOption: llt800.Option

  public constructor(option: IOption) {
    super(option)

    const agentOption: llt800.Option = {
      account: option.account,
      key: option.key,
      url: option.baseUrl
    }
    this.agent = new Agent(agentOption)
  }

  public async getBalance() {
    return await this.agent.getBalance()
  }

  public async charge(chargeReq: IChargeRequest) {
    const range: llt800.Range = llt800.Range.Roaming
    return await this.agent.charge(chargeReq.phone, range, chargeReq.packageSize, chargeReq.outTradeNo)
  }

  public async queryOrder(outTradeNo: string) {
    const reports = await this.agent.queryOrder(outTradeNo)
    // reports.length should always be 1
    return this.convertStatus(reports[0].Status)
  }

  public parseCallback(data: object) {
    const result: IReport[] = []
    const reports = this.agent.parseCallback(this.agentOption, data)
    for (const report of reports) {
      result.push(this.convertReport(report))
    }
    return result
  }

  public feedback(done: boolean) {
    return this.agent.feedback(done)
  }

  private convertStatus(status: llt800.Status): Status {
    let result: Status = Status.Unknown
    switch (status) {
      case llt800.Status.Done:
        result = Status.Done
        break
      case llt800.Status.ChargeFailed:
        result = Status.Failed
        break
      case llt800.Status.Charging:
        result = Status.Charging
        break
      case llt800.Status.Unknown:
      default:
        // ignore
        break
    }
    return result
  }

  private convertReport(report: llt800.IReport): IReport {
    const result: IReport = {
      outTradeNo: report.OutTradeNo,
      status: this.convertStatus(report.Status),
      type: this.option.type
    }
    return result
  }
}
