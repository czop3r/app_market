import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { MarketService } from 'src/app/market/market.service';
import { WalletService } from '../wallet.service';

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
  saldo: number = 0;
  loadingProgress: boolean = true;
  private sub$ = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<SellDialogComponent>,
    private marketService: MarketService,
    private walletService: WalletService
  ) {}

  ngOnInit() {
    this.sub$.add(
      this.marketService
        .onFetchCompanyInfo(this.data.stock.symbol)
        .subscribe((sub) => {
          this.sub$.add(
            this.marketService.company.subscribe((sub) => {
              this.data.stock.price = Number(sub.price);
              this.loadingProgress = false;
            })
          );
        })
    );
    this.data.stock.symbol;
    this.sub$.add(
      this.walletService.saldo.subscribe((sub) => {
        this.saldo = sub;
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
