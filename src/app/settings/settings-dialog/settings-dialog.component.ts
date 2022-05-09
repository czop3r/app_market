import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { CompanyOverview } from 'src/app/market/company.model';
import { MarketService } from 'src/app/market/market.service';

export interface DialogData {
  symbol: string;
}

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss'],
})
export class SettingsDialogComponent implements OnInit, OnDestroy {
  loadingProgress: boolean = true;
  companyOverview: CompanyOverview;
  private sub$ = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<SettingsDialogComponent>,
    private marketService: MarketService
  ) {}

  ngOnInit(): void {
    this.loadingProgress = true;
    this.sub$.add(
      this.marketService
        .onFetchCompanyOverview(this.data.symbol)
        .subscribe(() => {
          this.companyOverview = this.marketService.companyOverview;
          this.loadingProgress = false;
        })
    );
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
    this.loadingProgress = true;
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
