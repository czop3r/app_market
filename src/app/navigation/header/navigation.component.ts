import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { UserData } from 'src/app/auth/users/user.model';
import { MarketService } from 'src/app/market/market.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  @Output() sidenavToggle = new EventEmitter<void>();
  userData: UserData;
  private sub$ = new Subscription();

  constructor(
    private marketService: MarketService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('marketData'));
    this.sub$.add(
      this.marketService.saldoHeader.subscribe((sub: number) => {
        this.userData.saldo = sub;
      })
    );
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }
}
