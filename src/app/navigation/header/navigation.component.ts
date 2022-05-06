import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { WalletService } from 'src/app/wallet/wallet.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  @Output() sidenavToggle = new EventEmitter<void>();
  saldo: number = 0;
  private sub$ = new Subscription();

  constructor(private walletService: WalletService) {}

  ngOnInit() {
    this.sub$.add(
      this.walletService.saldo.subscribe((sub) => {
        this.saldo = sub;
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
