import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit, OnDestroy {
  @Output() sidenavClose = new EventEmitter<void>();
  isAuth: boolean = false;
  private sub$ = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit() {
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

  onClose() {
    this.sidenavClose.emit();
  }

  onLogout() {
    this.sidenavClose.emit();
    this.authService.logout();
  }
}
