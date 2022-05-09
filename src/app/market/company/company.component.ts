import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Subscription, switchMap } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { UserData } from 'src/app/auth/users/user.model';
import { UIService } from 'src/app/shared/UI.service';
import { CompanyDetailsComponent } from '../company-details/company-details.component';
import { Company } from '../company.model';
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
  userData: UserData;
  showChart: boolean = false;
  checkChange: string = '';
  index: number;
  isAuth: boolean = false;
  private sub$ = new Subscription();

  constructor(
    private marketService: MarketService,
    public dialog: MatDialog,
    private uiService: UIService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.sub$.add(
      this.marketService.userData.subscribe((sub) => {
        this.userData = sub;
      })
    );
    this.onCheckChange();
    this.sub$.add(
      this.authService.user.subscribe((user) => {
        this.isAuth = !!user;
      })
    );
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
      dialogRef
        .afterClosed()
        .pipe(
          map((result) => {
            if (result) {
              const msg = 'You bought ' + result.buyValue + ' stocks.';
              this.uiService.openSnackBar(msg, 'close', 3000);
              const value =
                Math.round(
                  (result.price * result.buyValue + Number.EPSILON) * 100
                ) / 100;
              this.userData.saldo =
                Math.round(
                  (this.userData.saldo - value + Number.EPSILON) * 100
                ) / 100;
              this.upgradeStock(result.symbol, result.buyValue);
              this.marketService.userData.next(this.userData);
            }
          }),
          switchMap(() => this.authService.updateUserData(this.userData))
        )
        .subscribe()
    );
  }

  openDialogChart() {
    const dialogRef = this.dialog.open(CompanyDetailsComponent, {
      width: '90%',
      data: { symbol: this.company.symbol },
    });

    this.sub$.add(dialogRef.afterClosed().subscribe());
  }

  onRefresh() {
    this.progresBar.emit(true);
    this.sub$.add(
      this.marketService
        .onFetchCompanyInfo(this.company.symbol)
        .pipe(
          map(() => {
            this.sub$.add(
              this.marketService.company.subscribe((sub) => {
                this.progresBar.emit(false);
                const index = this.userData.companies.findIndex(
                  (obj) => obj.symbol == this.company.symbol
                );
                this.company = sub;
                this.userData.companies[index] = this.company;
                this.marketService.companiesList = this.userData.companies;
              })
            );
          })
        )
        .subscribe()
    );
  }

  private upgradeStock(symbol: string, value: number) {
    const index = this.userData.stocks.findIndex((obj) => obj.symbol == symbol);
    if (index < 0) {
      this.userData.stocks.splice(this.userData.stocks.length, 0, {
        symbol: symbol,
        value: value,
      });
    } else {
      this.userData.stocks[index].value =
        this.userData.stocks[index].value + value;
    }
    this.marketService.stocks = this.userData.stocks;
  }
}
