import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

import { SearchRes } from '../market/company.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  searchResponse = new BehaviorSubject<SearchRes[]>(null);

  constructor(private http: HttpClient) {}

  onFetchSearch(keyword: string): Observable<Object> {
    return this.http
      .get(
        'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=tesco&apikey=demo'
      )
      .pipe(
        catchError((err) => {
          return throwError(err);
        }),
        tap((res) => {
          const searchList = [];
          for (let key in res['bestMatches']) {
            searchList.push(
              this.onSearchRes(
                res['bestMatches'][key]['1. symbol'],
                res['bestMatches'][key]['2. name'],
                res['bestMatches'][key]['4. region']
              )
            );
          }
          this.searchResponse.next(searchList);
        })
      );
  }

  private onSearchRes(symbol: string, name: string, region: string): SearchRes {
    const searchRes = {
      symbol: symbol,
      name: name,
      region: region,
    };
    return searchRes;
  }
}
