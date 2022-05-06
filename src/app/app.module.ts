import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { MarketComponent } from './market/market.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { WalletComponent } from './wallet/wallet.component';
import { SettingsComponent } from './settings/settings.component';
import { LoginComponent } from './auth/login/login.component';
import { UserComponent } from './users/user/user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompanyComponent } from './market/company/company.component';
import { CompanyDetailsComponent } from './market/company-details/company-details.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent},
  { path: 'market', component: MarketComponent },
  { path: 'wallet', component: WalletComponent },
  { path: 'user', component: UserComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'settings', component: SettingsComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    MarketComponent,
    WalletComponent,
    SettingsComponent,
    LoginComponent,
    UserComponent,
    DashboardComponent,
    CompanyComponent,
    CompanyDetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
