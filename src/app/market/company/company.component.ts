import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { UIService } from 'src/app/shared/UI.service';
import { WalletService } from 'src/app/wallet/wallet.service';
import { CompanyDetailsComponent } from '../company-details/company-details.component';
import { Company, Stock } from '../company.model';
import { MarketService } from '../market.service';
import { CompanyDialogComponent } from './company-dialog/company-dialog.component';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
})
export class CompanyComponent implements OnInit, OnDestroy {
  @Input() company: Company;
  @Output() progresBar = new EventEmitter<boolean>();
  companiesList: Company[];
  saldo: number = 0;
  showChart: boolean = false;
  checkChange: string = '';
  stocks: Stock[];
  index: number;
  private sub$ = new Subscription();

  constructor(
    private marketService: MarketService,
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
      this.marketService.companiesList.subscribe((sub) => {
        this.companiesList = sub;
      })
    );
    this.sub$.add(
      this.walletService.stocks.subscribe((sub) => {
        this.stocks = sub;
      })
    );
    this.onCheckChange();
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onCheckChange() {
    const value = this.company.change;
    if (value.slice(0, 1) === '-') {
      this.checkChange = 'negative';
    } else {
      this.checkChange = 'positive';
    }
  }

  openDialogBuy() {
    const dialogRef = this.dialog.open(CompanyDialogComponent, {
      data: {
        symbol: this.company.symbol,
        price: this.company.price,
      },
    });

    this.sub$.add(
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const msg = 'You bought ' + result.buyValue + ' stocks.';
          this.uiService.openSnackBar(msg, 'close', 3000);
          const value =
            Math.round(
              (result.price * result.buyValue + Number.EPSILON) * 100
            ) / 100;
          this.saldo =
            Math.round((this.saldo - value + Number.EPSILON) * 100) / 100;
          this.walletService.saldo.next(this.saldo);
          this.upgradeStock(result.symbol, result.buyValue);
        }
      })
    );
  }

  openDialogChart() {
    const dialogRef = this.dialog.open(CompanyDetailsComponent, {
      width: '90%',
      data: { symbol: this.company.symbol },
    });

    this.sub$.add(dialogRef.afterClosed().subscribe((result) => {}));
  }

  onRefresh() {
    this.progresBar.emit(true);
    this.sub$.add(
      this.marketService
        .onFetchCompanyInfo(this.company.symbol)
        .subscribe((sub) => {
          this.sub$.add(
            this.marketService.company.subscribe((sub) => {
              this.progresBar.emit(false);
              const index = this.companiesList.findIndex(
                (obj) => obj.symbol == this.company.symbol
              );
              this.company = sub;
              this.companiesList[index] = this.company;
              this.marketService.companiesList.next(this.companiesList);
            })
          );
        })
    );
  }

  private upgradeStock(symbol: string, value: number) {
    const index = this.stocks.findIndex((obj) => obj.symbol == symbol);
    if (index < 0) {
      this.stocks.splice(this.stocks.length, 0, {
        symbol: symbol,
        value: value,
      });
    } else {
      this.stocks[index].value = this.stocks[index].value + value;
    }
    this.walletService.stocks.next(this.stocks);
  }
}
