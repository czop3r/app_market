import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserData } from '../auth/users/user.model';
import { Company } from './company.model';

import { MarketService } from './market.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss'],
})
export class MarketComponent implements OnInit, OnDestroy {
  userData: UserData;
  companies: Company[];
  progresBar: boolean = true;
  private sub$ = new Subscription();

  constructor(
    private marketService: MarketService,
  ) {}

  ngOnInit() {
    this.companies = this.marketService.companiesListChanged;
    this.sub$.add(this.marketService.userData.subscribe(
      sub => {
        if(sub) {
          this.userData = sub;
          this.companies = sub.companies
        }
      }
    ))
    if (this.companies.length != 0) {
      this.progresBar = false;
    }
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onCheckProgresBar(event: boolean) {
    this.progresBar = event;
  }
}
