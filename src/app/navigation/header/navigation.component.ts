import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User, UserData } from 'src/app/auth/users/user.model';
import { MarketService } from 'src/app/market/market.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  @Output() sidenavToggle = new EventEmitter<void>();
  userData: UserData;
  saldo: number = 0;
  isAuth: boolean = false;
  user: User;
  private sub$ = new Subscription();

  constructor(
    private marketService: MarketService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log(this.userData)
    this.sub$.add(this.marketService.userData.subscribe(
      sub => {
        if(sub) {
          this.userData = sub;
          this.saldo = sub.saldo;
        }
      }
    ))
    this.sub$.add(
      this.authService.user.subscribe((user) => {
        this.user = user;
        this.isAuth = !!user;
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

  onLogout() {
    this.authService.logout();
  }
}
