import { AuthService } from './../../services/authentication-service/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  loginForm: FormGroup;

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.email,
        Validators.minLength(6),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.authService
      .login(this.loginForm.value)
      .pipe(map((token) => this.router.navigate(['admin'])))
      .subscribe();
  }

  // login() {
  //   this.authService
  //     .login('admin@combit.com.br', 'admin')
  //     .subscribe((data) => console.log('SUCCESS'));
  // }
}
