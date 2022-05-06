import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Stock } from '../market/company.model';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  saldo = new BehaviorSubject<number>(200000);
  stocks = new BehaviorSubject<Stock[]>([
    {
      symbol: 'IBM',
      value: 430,
    },
    {
      symbol: 'Tesco',
      value: 123,
    },
    {
      symbol: 'NBA',
      value: 3,
    },
    {
      symbol: 'LG',
      value: 4343,
    },
    {
      symbol: 'APPLE',
      value: 455,
    },
    {
      symbol: 'TACO',
      value: 82,
    },
  ]);

  constructor(private http: HttpClient) {}
}
