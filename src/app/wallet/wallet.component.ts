import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { Stock } from '../market/company.model';
import { UIService } from '../shared/UI.service';
import { SellDialogComponent } from './sell-dialog/sell-dialog.component';
import { WalletService } from './wallet.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit, OnDestroy {
  saldo: number = 0;
  stocks: Stock[] = [];
  msgList: boolean = true;
  private sub$ = new Subscription();

  constructor(
    public dialog: MatDialog,
    private walletService: WalletService,
    private uiService: UIService
  ) {}

  ngOnInit() {
    this.sub$.add(
      this.walletService.saldo.subscribe((sub) => {
        this.saldo = sub;
      })
    );
    this.sub$.add(
      this.walletService.stocks.subscribe((sub) => {
        this.stocks = sub;
        if (sub.length != 0) {
          this.msgList = false;
        }
      })
    );
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
    this.msgList = true;
  }

  openDialog(stock: Object) {
    const dialogRef = this.dialog.open(SellDialogComponent, {
      data: { stock },
    });

    this.sub$.add(
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const msg = 'You sold ' + result.soldValue + ' stocks.';
          this.uiService.openSnackBar(msg, 'close', 3000);
          const value =
            Math.round(
              (result.price * result.soldValue + Number.EPSILON) * 100
            ) / 100;
          this.saldo =
            Math.round((this.saldo + Number(value) + Number.EPSILON) * 100) /
            100;
          this.walletService.saldo.next(this.saldo);
          this.upgradeStock(result.symbol, result.soldValue);
        }
      })
    );
  }

  private upgradeStock(symbol: string, value: number) {
    const index = this.stocks.findIndex((obj) => obj.symbol == symbol);
    this.stocks[index].value = this.stocks[index].value - value;
    if (this.stocks[index].value == 0) {
      this.stocks.splice(index, 1);
      this.msgList = true;
    }
    this.walletService.stocks.next(this.stocks);
  }
}
