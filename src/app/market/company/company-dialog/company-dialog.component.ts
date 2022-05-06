import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { WalletService } from 'src/app/wallet/wallet.service';
import { MarketService } from '../../market.service';

export interface DialogData {
  symbol: string;
  price: number;
  buyValue: number;
}

@Component({
  selector: 'app-company-dialog',
  templateUrl: './company-dialog.component.html',
  styleUrls: ['./company-dialog.component.scss'],
})
export class CompanyDialogComponent implements OnInit, OnDestroy {
  saldo: number = 0;
  loadingProgress: boolean = true;
  private sub$ = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<CompanyDialogComponent>,
    private marketService: MarketService,
    private walletService: WalletService
  ) {}

  ngOnInit() {
    this.sub$.add(
      this.marketService
        .onFetchCompanyInfo(this.data.symbol)
        .subscribe((sub) => {
          this.sub$.add(
            this.marketService.company.subscribe((sub) => {
              this.data.price = Number(sub.price);
              this.loadingProgress = false;
            })
          );
        })
    );
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
