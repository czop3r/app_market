import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription, switchMap } from 'rxjs';

import { UIService } from 'src/app/shared/UI.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  private sub$ = new Subscription();

  constructor(
    private authService: AuthService,
    private uiService: UIService
    ) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    this.sub$.add(
      this.authService
        .registerUser({
          email: form.value.email,
          password: form.value.password,
        })
        .pipe(switchMap(() => this.authService.creatUserData()))
        .subscribe(
          () => {
            this.uiService.openSnackBar(
              'Added user succsessfull!',
              'close',
              3000
            );
          }
        )
    );
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }
}
