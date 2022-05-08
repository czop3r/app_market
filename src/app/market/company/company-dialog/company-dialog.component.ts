import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Subscription, switchMap } from 'rxjs';

import { UserData } from 'src/app/auth/users/user.model';
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
  userData: UserData;
  loadingProgress: boolean = true;
  private sub$ = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<CompanyDialogComponent>,
    private marketService: MarketService
  ) {}

  ngOnInit() {
    this.sub$.add(
      this.marketService
        .onFetchCompanyInfo(this.data.symbol)
        .pipe(
          switchMap(() => this.marketService.company),
          map((sub) => {
            this.data.price = Number(sub.price);
          })
        )
        .subscribe((sub) => {
          this.loadingProgress = false;
        })
    );
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
