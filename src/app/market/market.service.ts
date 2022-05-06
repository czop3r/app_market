import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";

import { Company, CompanyChart } from "./company.model";

@Injectable({
    providedIn: 'root'
})
export class MarketService {
    company = new BehaviorSubject<Company>(null);
    companyChart = new BehaviorSubject<CompanyChart>(null);

    constructor(
        private http: HttpClient
    ) {}

    onFetchCompanyChart(symbol?: string) {
        return this.http.get('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo')
        .pipe(
            catchError(err => {
                return throwError(err);
            }),
            tap(res => {
                const resX = [];
                const resY = []
                for (let key in res['Time Series (5min)']) {
                    resX.push(key);
                    resY.push(
                        res['Time Series (5min)'][key]['4. close']
                      )
                    }
                this.onCompanyChart(
                    resX,
                    resY,
                    res['Meta Data']['2. Symbol']
                );
            })
        );
    }

    onFetchCompanyInfo(symbol: string) {
        return this.http.get('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=300135.SHZ&apikey=demo')
        .pipe(
            catchError(err => {
                return throwError(err);
            }),
            tap(res => {
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

    onCompanyInfo(
        symbol: string,
        price: string,
        volume: string,
        change: string,
        changePercent: string
    ) {
        const company = new Company(
            symbol,
            price,
            volume,
            change,
            changePercent
        );

        return company;
    }

    private onCompanyChart(
        x: Array<string>,
        y: Array<string>,
        label: string
    ) {
        x.reverse();
        y.reverse();
        const companyChart = new CompanyChart(
            x,
            y,
            label
        );
        this.companyChart.next(companyChart);
    }
}