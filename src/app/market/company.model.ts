export class Company {
  constructor(
    public symbol: string,
    public price: string,
    public volume: string,
    public change: string,
    public changePercent: string
  ) {}
}

export class CompanyChart {
  constructor(
    public x: Array<string>,
    public y: Array<string>,
    public label: string
  ) {}
}

export interface SearchRes {
  symbol: string;
  name: string;
  region: string;
}

export interface Stock {
  symbol: string;
  value: number;
}

export interface CompanyOverview {
  symbol: string;
  name: string;
  desc: string;
  sector: string;
  industry: string;
  address: string;
  marketCapitalization: string;
}
