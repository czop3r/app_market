import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { SellDialogComponent } from '../market/wallet/sell-dialog/sell-dialog.component';
import { WalletComponent } from '../market/wallet/wallet.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { CompanyDialogComponent } from './company/company-dialog/company-dialog.component';
import { CompanyComponent } from './company/company.component';
import { MarketRoutingModule } from './market-routing.module';
import { MarketComponent } from './market.component';

@NgModule({
  declarations: [
    MarketComponent,
    CompanyComponent,
    CompanyDetailsComponent,
    CompanyDialogComponent,
    WalletComponent,
    SellDialogComponent,
  ],
  imports: [SharedModule, MarketRoutingModule],
  exports: [],
})
export class MarketModule {}
