import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { map, Subscription, switchMap } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { UserData } from '../auth/users/user.model';
import { Company, SearchRes } from '../market/company.model';
import { MarketService } from '../market/market.service';
import { UIService } from '../shared/UI.service';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  userData: UserData;
  searchList: SearchRes[] = [];
  loadingProgress: boolean = false;
  progresBar: boolean = false;
  private sub$ = new Subscription();
  private company: Company;

  constructor(
    private settingsService: SettingsService,
    private marketService: MarketService,
    private uiService: UIService,
    public dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.sub$.add(this.marketService.userData.subscribe(
      sub => {
        this.userData = sub;
      }
    ))
    this.sub$.add(
      this.marketService.company.subscribe((sub) => (this.company = sub))
    );
    this.sub$.add(
      this.settingsService.searchResponse.subscribe((sub) => {
        this.searchList = sub;
      })
    );
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onSubmit(f: NgForm) {
    this.loadingProgress = true;
    this.searchList = [];
    this.sub$.add(
      this.settingsService.onFetchSearch(f.form.value.search).subscribe(() => {
        this.loadingProgress = false;
      })
    );
  }

  onAddCompany(company: SearchRes) {
    this.progresBar = true;
    this.sub$.add(
      this.marketService
        .onFetchCompanyInfo(company.symbol)
        .pipe(
          map(() => {
            this.progresBar = false;
            const index = this.userData.companies.findIndex(
              (obj) => obj.symbol == this.company.symbol
            );
            if (index < 0) {
              this.userData.companies.push(this.company);
              this.userData.saldo = this.marketService.saldo;
              this.marketService.companiesList = this.userData.companies;
              this.searchList.splice(index, 1);
              const msg = 'Added company ' + this.company.symbol;
              this.uiService.openSnackBar(msg, 'close', 3000);
            } else {
              const msg = 'Company ' + this.company.symbol + ' exist';
              this.uiService.openSnackBar(msg, 'close', 3000);
            }
            this.marketService.userData.next(this.userData);
          }),
          switchMap(() => this.authService.updateUserData(this.userData))
        )
        .subscribe(() => {})
    );
  }

  checkChange(i: number): string {
    const value = this.userData.companies[i].change;
    var msg = 'positive';
    if (value.slice(0, 1) === '-') {
      msg = 'negative';
    }
    return msg;
  }

  openDialogInfo(company: Company) {
    const dialogRef = this.dialog.open(SettingsDialogComponent, {
      data: {
        symbol: company.symbol,
      },
    });

    this.sub$.add(this.sub$.add(dialogRef.afterClosed().subscribe()));
  }

  onDelete(index: number) {
    this.userData.companies.splice(index, 1);
    this.marketService.companiesList = this.userData.companies;
    this.sub$.add(this.authService.updateUserData(this.userData).subscribe());
  }
}
