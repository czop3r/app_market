import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { Company } from '../company.model';
import { MarketService } from '../market.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit, OnDestroy {
  @Input() company: Company;
  @Output() companyView = new EventEmitter<boolean>();
  showChart: boolean = false;
  private sub$ = new Subscription();

  constructor(
    private marketService: MarketService
  ) { }

  ngOnInit() {
    this.sub$.add(
      this.marketService.onFetchCompanyInfo(this.company.symbol).subscribe(
        sub => {
            // this.company = this.marketService.company.value;
        }
      )
    );
  }

  ngOnDestroy() {
    if(this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onCompanyView() {
    if(this.showChart) {
      this.showChart = false;
    } else {
      this.showChart = true;
    }
    console.log(this.showChart);
    console.log(this.companyView)
    this.companyView.emit(this.showChart)
  }

}
