import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Subscription, switchMap } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { UserData } from '../auth/users/user.model';
import { Stock } from '../market/company.model';
import { MarketService } from '../market/market.service';
import { UIService } from '../shared/UI.service';
import { SellDialogComponent } from './sell-dialog/sell-dialog.component';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit, OnDestroy {
  userData: UserData;
  msgList: boolean = true;
  private sub$ = new Subscription();

  constructor(
    public dialog: MatDialog,
    private uiService: UIService,
    private marketService: MarketService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userData = this.marketService.onGetUserData();
    if (this.userData.stocks.length != 0) {
      this.msgList = false;
    }
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
    this.msgList = true;
  }

  openDialog(stock: Stock) {
    const dialogRef = this.dialog.open(SellDialogComponent, {
      data: { stock },
    });

    this.sub$.add(
      dialogRef
        .afterClosed()
        .pipe(
          map((result) => {
            if (result) {
              const msg = 'You sold ' + result.soldValue + ' stocks.';
              this.uiService.openSnackBar(msg, 'close', 3000);
              const value =
                Math.round(
                  (result.price * result.soldValue + Number.EPSILON) * 100
                ) / 100;
              this.userData.saldo =
                Math.round(
                  (this.userData.saldo + Number(value) + Number.EPSILON) * 100
                ) / 100;
              this.marketService.saldo = this.userData.saldo;
              this.marketService.saldoHeader.next(this.userData.saldo);
              this.upgradeStock(result.symbol, result.soldValue);
            }
          }),
          switchMap(() => this.authService.updateUserData(this.userData))
        )
        .subscribe()
    );
    if (this.userData.stocks.length == 0) {
      this.msgList = true;
    }
  }

  private upgradeStock(symbol: string, value: number) {
    const index = this.userData.stocks.findIndex((obj) => obj.symbol == symbol);
    this.userData.stocks[index].value =
      this.userData.stocks[index].value - value;
    if (this.userData.stocks[index].value == 0) {
      this.userData.stocks.splice(index, 1);
    }
    this.marketService.stocks = this.userData.stocks;
  }
}
