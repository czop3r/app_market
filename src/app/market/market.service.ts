import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

import { Company, CompanyChart, CompanyOverview } from './company.model';

@Injectable({
  providedIn: 'root',
})
export class MarketService {
  company = new BehaviorSubject<Company>(null);
  companyChart = new BehaviorSubject<CompanyChart>(null);
  companiesList = new BehaviorSubject<Company[]>(null);
  companyOverview = new BehaviorSubject<CompanyOverview>(null);
  private companiesListChanged: Company[] = [
    {
      symbol: 'IBM',
      price: '1000',
      volume: '2000',
      change: '2.01',
      changePercent: '0.3%',
    },
    {
      symbol: '300135.SHZ',
      price: '72',
      volume: '345',
      change: '-023',
      changePercent: '-0.1%',
    },
    {
      symbol: 'APPLE',
      price: '72',
      volume: '423',
      change: '-123',
      changePercent: '-0.342%',
    },
  ];

  constructor(private http: HttpClient) {
    this.companiesList.next(this.companiesListChanged);
  }

  onFetchCompanyChart(symbol?: string): Observable<Object> {
    return this.http
      .get(
        'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo'
      )
      .pipe(
        catchError((err) => {
          return throwError(err);
        }),
        tap((res) => {
          const resX = [];
          const resY = [];
          for (let key in res['Time Series (5min)']) {
            resX.push(key);
            resY.push(res['Time Series (5min)'][key]['4. close']);
          }
          this.onCompanyChart(resX, resY, res['Meta Data']['2. Symbol']);
        })
      );
  }

  onFetchCompanyInfo(symbol: string): Observable<Object> {
    return this.http
      .get(
        'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=300135.SHZ&apikey=demo'
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
        'https://www.alphavantage.co/query?function=OVERVIEW&symbol=IBM&apikey=demo'
      )
      .pipe(
        catchError((err) => {
          return throwError(err);
        }),
        tap((res) => {
          this.companyOverview.next(
            this.onCompanyOverview(
              res['Symbol'],
              res['Name'],
              res['Description'],
              res['Sector'],
              res['Industry'],
              res['Address'],
              res['MarketCapitalization']
            )
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
    const companyChart = new CompanyChart(x, y, label);
    this.companyChart.next(companyChart);
  }
}
