import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Subscription, switchMap } from 'rxjs';

import { UserData } from 'src/app/auth/users/user.model';
import { MarketService } from 'src/app/market/market.service';

export interface DialogData {
  stock: {
    symbol: string;
    value: number;
    soldValue: number;
    price: number;
  };
}

@Component({
  selector: 'app-sell-dialog',
  templateUrl: './sell-dialog.component.html',
  styleUrls: ['./sell-dialog.component.scss'],
})
export class SellDialogComponent implements OnInit, OnDestroy {
  userData: UserData;
  loadingProgress: boolean = true;
  private sub$ = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<SellDialogComponent>,
    private marketService: MarketService
  ) {}

  ngOnInit() {
    this.sub$.add(
      this.marketService
        .onFetchCompanyInfo(this.data.stock.symbol)
        .pipe(
          switchMap(() => this.marketService.company),
          map((sub) => {
            this.data.stock.price = Number(sub.price);
          })
        )
        .subscribe((sub) => {
          this.loadingProgress = false;
        })
    );
    this.data.stock.symbol;
    this.userData = this.marketService.onGetUserData();
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
