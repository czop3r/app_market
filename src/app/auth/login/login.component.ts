import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription, tap } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private sub$ = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    this.sub$.add(
      this.authService
        .login({
          email: form.value.email,
          password: form.value.password,
        })
        .pipe(
          tap((sub) => {
            this.authService.creatUserData('222222sdsdsdss2');
            console.log(sub);
          })
        )
        .subscribe((sub) => {
          console.log('sub');
          console.log(sub);
        })
    );
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }
}
