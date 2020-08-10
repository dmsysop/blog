import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

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
}
