import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserData } from '../auth/users/user.model';

import { MarketService } from './market.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss'],
})
export class MarketComponent implements OnInit, OnDestroy {
  userData: UserData;
  progresBar: boolean = true;
  private sub$ = new Subscription();

  constructor(
    private marketService: MarketService,
  ) {}

  ngOnInit() {
    this.userData = this.marketService.onGetUserData();
    if (this.userData.companies.length != 0) {
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
