import { Component, OnDestroy, OnInit } from '@angular/core';

import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';
import { CompanyChart } from '../company.model';
import { MarketService } from '../market.service';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent implements OnInit, OnDestroy {
  companyChart: CompanyChart;
  private sub$ = new Subscription();

  constructor(
    private marketService: MarketService
  ) { }

  ngOnInit() {
    this.sub$.add(
      this.marketService.companyChart.subscribe(
        sub => {
          this.companyChart = sub;
        }
      )
    );
    Chart.register(...registerables);
    this.sub$.add(
      this.marketService.onFetchCompanyChart().subscribe(
        sub => {
          this.loadChart();
        }
      )
    );
  }

  ngOnDestroy() {
    if(this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  loadChart() {
    new Chart('companyChart', {
      type: 'line',
      data: {
        labels: this.companyChart.x,
        datasets: [{
            label: this.companyChart.label,
            data: this.companyChart.y,
        }]
    }
    })
  }
}

