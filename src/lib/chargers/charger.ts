'use strict'

export type Type = 'llt800' | 'sy666' | 'lljypt' | 'dahanbank'

export enum Group {
  National = 1,
  Roaming = 2,
  Provincial = 3,
  Special = 4
}

export enum Status {
  Unknown = 0,
  Waitting = 1,
  Charging = 2,
  Charged = 3,
  Canceling = 4,
  Canceled = 5,
  Done = 6,
  Failed = 7,
  Pending = 8,
  Freezed = 9,
  Doing = 10
}

export interface IOption {
  name: string
  type: Type
  account: string
  client: string
  key: string
  baseUrl: string
  retUrl: string
}

export interface IChargeRequest {
  type: Type,
  phone: string
  group: Group,
  packageSize: number // 1G = 1024
  outTradeNo: string
}

export interface IReport {
  outTradeNo: string
  status: Status
  type: Type
}

export abstract class Charger {
  protected option: IOption

  public constructor(option: IOption) {
    this.option = option
  }

  public abstract async getBalance(): Promise<number>

  public abstract async charge(chargeReq: IChargeRequest): Promise<string>

  public abstract async queryOrder(outTradeNo: string): Promise<Status>

  public abstract parseCallback(data: object): IReport[]

  public abstract feedback(done: boolean): string
}
