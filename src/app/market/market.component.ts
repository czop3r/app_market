import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';
import { MarketService } from './market.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit, OnDestroy {
  
  chartX: Array<string> = [];
  chartY: Array<string> = [];
  companyChangedLabel: string = '';
  private sub$ = new Subscription();

  constructor(
    private marketService: MarketService
  ) { }

  ngOnInit() {
    Chart.register(...registerables);
    this.sub$ = this.marketService.onFetchCompany().subscribe(
      sub => {
        this.chartX = this.marketService.companyDateList;
        this.chartY = this.marketService.companyCloseList;
        this.companyChangedLabel = this.marketService.companySybmolLabel;
        this.loadChart();
      }
    );
  }

  ngOnDestroy() {
    this.sub$.unsubscribe();
  }

  loadChart() {
    new Chart('companyChart', {
      type: 'line',
      data: {
        labels: this.chartX,
        datasets: [{
            label: this.companyChangedLabel,
            data: this.chartY,
        }]
    }
    })
  }
}
