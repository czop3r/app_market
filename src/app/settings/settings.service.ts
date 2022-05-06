import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, pipe, tap, throwError } from "rxjs";
import { Company } from "../market/company.model";

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    searchResponse: any = [];
    constructor(
        private http: HttpClient
    ) {
        this.onGetCompanies()
    }

    onFetchSearch(keyword: string) {
      return this.http.get('https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=tesco&apikey=demo')
      .pipe(
        catchError(err => {
          return throwError(err);
        }), tap(
          res => {
            console.log(res);
            this.searchResponse
          }
        )
      );
    }

    companiesList = new BehaviorSubject<Company[]>(null);
    private companiesListExample: Company[] = [
        {
          symbol: 'IBM',
          price: '1000',
          volume: '2000',
          change: '2.01',
          changePercent: '0.3%'
        },
        {
          symbol: 'TACO',
          price: '72',
          volume: '345',
          change: '-023',
          changePercent: '-0.1%'
        },
        {
          symbol: 'APPLE',
          price: '72',
          volume: '423',
          change: '-123',
          changePercent: '-0.342%'
        }
      ]

      onGetCompanies() {
          this.companiesList.next(this.companiesListExample);
      }

      onAddCompany(company: Company) {
          this.companiesListExample.push(company);
          this.companiesList.next(this.companiesListExample);
          console.log(this.companiesList.value)
      }
      
}