import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { LoginResponseInterface } from '../interfaces/login.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router) {}

  isLoggedIn() {
    const user = sessionStorage.getItem('user');
    if (user) {
      return true;
    }

    this.router.navigate(['login']);
    return false;
  }

  canActivate(): boolean {
    return this.isLoggedIn();
  }

  getUser(): string {
    const infoUser = sessionStorage.getItem('user');
    if (infoUser) {
      const userInfo: LoginResponseInterface = JSON.parse(infoUser);
      return userInfo.email;
    }
    return '';
  }

  getToken(): string {
    const infoUser = sessionStorage.getItem('user');
    if (infoUser) {
      const userInfo: LoginResponseInterface = JSON.parse(infoUser);
      return userInfo.token;
    }
    return '';
  }
}
