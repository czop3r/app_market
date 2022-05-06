import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MarketService {
    companyDateList: Array<string> = [];
    companyCloseList: Array<string> = [];
    companySybmolLabel: string = '';

    constructor(
        private http: HttpClient
    ) {}

    onFetchCompany() {
        return this.http.get('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo')
        .pipe(
            catchError(err => {
                return throwError(err);
            }),
            tap(response => {
                for (var key in response['Time Series (5min)']) {
                    this.companyDateList.push(key);
                    this.companyCloseList.push(
                        response['Time Series (5min)'][key]['4. close']
                      )
                    }
                this.onReverse();
                this.companySybmolLabel = response['Meta Data']['2. Symbol'];
            })
        )
    }

    private onReverse() {
        this.companyDateList.reverse(); 
        this.companyCloseList.reverse(); 
    }
}