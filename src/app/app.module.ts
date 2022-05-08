import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';

import { NavigationComponent } from './navigation/header/navigation.component';
import { SidenavComponent } from './navigation/sidenav/sidenav.component';

import { LoginComponent } from './auth/login/login.component';

import { MarketComponent } from './market/market.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { WalletComponent } from './wallet/wallet.component';
import { SettingsComponent } from './settings/settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompanyComponent } from './market/company/company.component';
import { CompanyDetailsComponent } from './market/company-details/company-details.component';
import { UsersComponent } from './auth/users/users.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptorService } from './auth/auth.interceptor.service';
import { AuthGuard } from './auth/auth.guard';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import { SellDialogComponent } from './wallet/sell-dialog/sell-dialog.component';
import { CompanyDialogComponent } from './market/company/company-dialog/company-dialog.component';
import { SettingsDialogComponent } from './settings/settings-dialog/settings-dialog.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';





const routes: Routes = [
  { path: '', component: WelcomeComponent},
  { path: 'market', component: MarketComponent },
  { path: 'wallet', component: WalletComponent, canLoad: [AuthGuard] },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canLoad: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canLoad: [AuthGuard] }
]

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    SidenavComponent,
    MarketComponent,
    WalletComponent,
    SettingsComponent,
    LoginComponent,
    DashboardComponent,
    CompanyComponent,
    CompanyDetailsComponent,
    SellDialogComponent,
    CompanyDialogComponent,
    SettingsDialogComponent,
    UsersComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    BrowserAnimationsModule,
    CommonModule,
    
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule 
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
