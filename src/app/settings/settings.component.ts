import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

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
  searchList: SearchRes[] = [];
  loadingProgress: boolean = false;
  companiesList: Company[] = [];
  progresBar: boolean = false;
  private sub$ = new Subscription();

  constructor(
    private settingsService: SettingsService,
    private marketService: MarketService,
    private uiService: UIService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.sub$.add(
      this.settingsService.searchResponse.subscribe((sub) => {
        this.sub$.add(
          this.settingsService.searchResponse.subscribe((sub) => {
            this.searchList = sub;
          })
        );
      })
    );
    this.sub$.add(
      this.marketService.companiesList.subscribe((sub) => {
        this.companiesList = sub;
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
      this.settingsService
        .onFetchSearch(f.form.value.search)
        .subscribe((sub) => {
          this.loadingProgress = false;
        })
    );
  }

  onAddCompany(company: SearchRes, index: number) {
    this.progresBar = true;
    this.sub$.add(
      this.marketService.onFetchCompanyInfo(company.symbol).subscribe((sub) => {
        this.onUpgradeCompanies(index);
      })
    );
  }

  checkChange(i: number): string {
    const value = this.companiesList[i].change;
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

    this.sub$.add(dialogRef.afterClosed().subscribe());
  }

  private onUpgradeCompanies(index: number) {
    this.sub$.add(
      this.marketService.company.subscribe((sub) => {
        this.progresBar = false;
        const company = sub;
        const index = this.companiesList.findIndex(
          (obj) => obj.symbol == company.symbol
        );
        if (index < 0) {
          this.companiesList.push(company);
          this.marketService.companiesList.next(this.companiesList);
          this.searchList.splice(index, 1);
          const msg = 'Added company ' + company.symbol;
          this.uiService.openSnackBar(msg, 'close', 3000);
        } else {
          const msg = 'Company ' + company.symbol + ' exist';
          this.uiService.openSnackBar(msg, 'close', 3000);
        }
      })
    );
  }
}
