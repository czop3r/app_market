import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription, switchMap } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  private sub$ = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    this.sub$.add(
      this.authService
        .registerUser({
          email: form.value.email,
          password: form.value.password,
        })
        .pipe(switchMap((res) => this.authService.creatUserData(res.localId)))
        .subscribe()
    );
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }
}
