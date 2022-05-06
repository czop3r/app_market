import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';

import { CompanyChart } from '../company.model';
import { MarketService } from '../market.service';

export interface DialogData {
  symbol: string;
}

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss'],
})
export class CompanyDetailsComponent implements OnInit, OnDestroy {
  loadingProgress: boolean = true;
  companyChart: CompanyChart;
  private sub$ = new Subscription();

  constructor(
    private marketService: MarketService,
    public dialogRef: MatDialogRef<CompanyDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {
    this.sub$.add(
      this.marketService.companyChart.subscribe((sub) => {
        this.companyChart = sub;
      })
    );
    Chart.register(...registerables);
    this.sub$.add(
      this.marketService.onFetchCompanyChart().subscribe((sub) => {
        this.loadChart();
        this.loadingProgress = false;
      })
    );
  }

  ngOnDestroy() {
    this.loadingProgress = true;
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  loadChart() {
    new Chart('companyChart', {
      type: 'line',
      data: {
        labels: this.companyChart.x,
        datasets: [
          {
            label: this.companyChart.label,
            data: this.companyChart.y,
          },
        ],
      },
    });
  }
  onNoClick() {
    this.dialogRef.close();
  }
}
