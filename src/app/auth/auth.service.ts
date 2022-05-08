import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  Observable,
  Subject,
  tap,
  throwError,
} from 'rxjs';

import { environment } from 'src/environments/environment';

import { UIService } from '../shared/UI.service';
import { AuthData, AuthResponseData, User, UserData } from './users/user.model';

const api_path =
  'https://app-market-6ae4a-default-rtdb.europe-west1.firebasedatabase.app/';
const api_path_signup =
  'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
const api_key = 'AIzaSyA53kF9uuQwx3uV4_du_LyYueo3rSBlq6E';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authChange = new Subject<boolean>();
  user = new BehaviorSubject<User>(null);
  userData: UserData;
  private tokenExpirationTimer: any;
  private userId: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private uiService: UIService
  ) {}

  registerUser(authData: AuthData): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(api_path_signup + api_key, {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true,
      })
      .pipe(
        catchError((err) => {
          this.handleError(err);
          return throwError(err);
        }),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
          this.creatUserData(resData.localId);
        })
      );
  }

  login(authData: AuthData): Observable<AuthResponseData> {
    console.log(authData);
    return this.http
      .post<AuthResponseData>('', {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true,
      })
      .pipe(
        catchError((err) => {
          this.handleError(err);
          return throwError(err);
        }),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  fetchUserData(id: string) {
    this.http.get('').pipe(
      catchError((err) => {
        this.handleError(err);
        return throwError(err);
      }),
      tap((resData: User) => {
        // this.user = resData;
        localStorage.setItem('marketData', JSON.stringify(this.userData));
        this.authSuccessfully();
      })
    );
  }

  creatUserData(id: string) {
    console.log(id);
    const uData = localStorage.getItem('marketData');
    console.log(uData);
    console.log(api_path + 'users/' + id + '/marketData.json');
    return this.http
      .put(api_path + 'users/' + id + '/marketData.json', uData)
      .pipe(
        catchError((err) => {
          this.handleError(err);
          return throwError(err);
        }),
        tap((res) => {
          console.log(res);
          this.uiService.openSnackBar(
            'Added user succsessfull!',
            'close',
            3000
          );
          this.authSuccessfully();
        })
      );
  }

  updateUserData(userData: UserData) {
    console.log('update');
    localStorage.setItem('marketData', JSON.stringify(userData));
    return this.http
      .put(api_path + 'users/' + this.userId + '.json', userData)
      .pipe(
        catchError((err) => {
          this.handleError(err);
          return throwError(err);
        })
      );
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.authChange.next(true);
      this.user.next(loadedUser);
      const expDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expDuration, userData.id);
    }
  }

  logout() {
    this.user.next(null);
    this.authChange.next(false);
    this.router.navigate(['/login']);
    localStorage.removeItem('userData');
    localStorage.removeItem('marketData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
  }

  autoLogout(expirationDuration: number, userId: string) {
    this.userId = userId;
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private authSuccessfully() {
    this.authChange.next(true);
    this.router.navigate(['/market']);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000, user.id);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse): void {
    let errorMessage = 'An unknow error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return this.uiService.openSnackBar(errorMessage, 'close', 3000);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists arledy';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct';
        break;
    }
    return this.uiService.openSnackBar(errorMessage, 'close', 3000);
  }
}
