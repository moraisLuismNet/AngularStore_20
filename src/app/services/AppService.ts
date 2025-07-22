import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/Environmet';
import {
  LoginInterface,
  LoginResponseInterface,
} from '../interfaces/LoginInterface';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  urlAPI: string;

  constructor(private http: HttpClient) {
    this.urlAPI = environment.urlAPI;
  }

  login(credentials: LoginInterface): Observable<LoginResponseInterface> {
    return this.http.post<LoginResponseInterface>(
      `${this.urlAPI}users/login`,
      credentials
    );
  }
}
