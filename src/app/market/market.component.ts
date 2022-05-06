import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SettingsService } from '../settings/settings.service';
import { Company } from './company.model';
import { MarketService } from './market.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit, OnDestroy {
  companyView: boolean = false;
  companiesList: Company[];
  private sub$ = new Subscription();
  
  constructor(
    private marketService: MarketService,
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.sub$.add(
      this.settingsService.companiesList.subscribe(
        sub => {
          this.companiesList = sub;
        }
      )
    );
  }

  ngOnDestroy() {
    if(this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onCompanyView(event: boolean) {
    this.companyView = event;
  }
}
