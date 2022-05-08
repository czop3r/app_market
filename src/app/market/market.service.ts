import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  Observable,
  Subject,
  tap,
  throwError,
} from 'rxjs';

import { environment } from 'src/environments/environment';
import { UserData } from '../auth/users/user.model';
import { Company, CompanyChart, CompanyOverview, Stock } from './company.model';

@Injectable({
  providedIn: 'root',
})
export class MarketService {
  userData = new BehaviorSubject<UserData>(null);
  company = new BehaviorSubject<Company>(null);
  companyChart: CompanyChart;
  companiesList: Company[];
  companyOverview: CompanyOverview;
  saldo: number = 200000;
  stocks: Stock[] = [
    {
      symbol: 'IBM',
      value: 430,
    },
    {
      symbol: 'NBA',
      value: 3,
    },
    {
      symbol: 'TACO',
      value: 82,
    },
  ];
  companiesListChanged: Company[] = [
    {
      symbol: 'IBM',
      price: '1000',
      volume: '2000',
      change: '2.01',
      changePercent: '0.3%',
    },
    {
      symbol: 'MSFT',
      price: '72',
      volume: '345',
      change: '-023',
      changePercent: '-0.1%',
    },
    {
      symbol: 'AMZN',
      price: '72',
      volume: '423',
      change: '-123',
      changePercent: '-0.342%',
    },
  ];

  constructor(private http: HttpClient) {}

  onGetUserData(): UserData {
    const userData: UserData = {
      companies: this.companiesListChanged,
      stocks: this.stocks,
      saldo: this.saldo,
    };
    return userData;
  }

  onFetchCompanyChart(symbol: string): Observable<Object> {
    return this.http
      .get(
        'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=' +
          symbol +
          '&interval=30min&apikey=' +
          environment.alphaKey
      )
      .pipe(
        catchError((err) => {
          return throwError(err);
        }),
        tap((res) => {
          const resX = [];
          const resY = [];
          for (let key in res['Time Series (30min)']) {
            resX.push(key);
            resY.push(res['Time Series (30min)'][key]['4. close']);
          }
          this.onCompanyChart(resX, resY, res['Meta Data']['2. Symbol']);
        })
      );
  }

  onFetchCompanyInfo(symbol: string): Observable<Object> {
    console.log(this.saldo)
    return this.http
      .get(
        'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=' +
          symbol +
          '&apikey=' +
          environment.alphaKey
      )
      .pipe(
        catchError((err) => {
          return throwError(err);
        }),
        tap((res) => {
          this.company.next(
            this.onCompanyInfo(
              res['Global Quote']['01. symbol'],
              res['Global Quote']['05. price'],
              res['Global Quote']['06. volume'],
              res['Global Quote']['09. change'],
              res['Global Quote']['10. change percent']
            )
          );
        })
      );
  }

  onFetchCompanyOverview(symbol: string): Observable<Object> {
    return this.http
      .get(
        'https://www.alphavantage.co/query?function=OVERVIEW&symbol=' +
          symbol +
          '&apikey=' +
          environment.alphaKey
      )
      .pipe(
        catchError((err) => {
          return throwError(err);
        }),
        tap((res) => {
          this.companyOverview = this.onCompanyOverview(
            res['Symbol'],
            res['Name'],
            res['Description'],
            res['Sector'],
            res['Industry'],
            res['Address'],
            res['MarketCapitalization']
          );
        })
      );
  }

  private onCompanyOverview(
    symbol: string,
    name: string,
    desc: string,
    sector: string,
    industry: string,
    address: string,
    marketCapitalization: string
  ): CompanyOverview {
    const company = {
      symbol,
      name,
      desc,
      sector,
      industry,
      address,
      marketCapitalization,
    };

    return company;
  }

  private onCompanyInfo(
    symbol: string,
    price: string,
    volume: string,
    change: string,
    changePercent: string
  ): Company {
    const company = new Company(symbol, price, volume, change, changePercent);

    return company;
  }

  private onCompanyChart(x: Array<string>, y: Array<string>, label: string) {
    x.reverse();
    y.reverse();
    this.companyChart = new CompanyChart(x, y, label);
  }
}
