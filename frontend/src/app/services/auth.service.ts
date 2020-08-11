import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

export interface LoginForm {
  email: string;
  password: string;
}

export interface User {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  profileImage?: string;
  // passwordConfirm?: string;
}

export const JWT_NAME = 'blog-token';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  // tslint:disable-next-line: typedef
  login(loginForm: LoginForm) {
    return this.http
      .post<any>('/api/users/login', {
        email: loginForm.email,
        password: loginForm.password,
      })
      .pipe(
        map((token) => {
          // console.log('token', token);
  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>('/api/users/login', { email, password })
      .pipe(
        map((token) => {
          console.log('token', token)
          localStorage.setItem('blog-token', token.access_token);
          return token;
        })
      );
  }

  // tslint:disable-next-line: typedef
  register(user: User) {
    return this.http.post<any>('/api/users', user).pipe(
      // tap((user) => console.log(user)),
      map((user) => user)
    );
  }

}
