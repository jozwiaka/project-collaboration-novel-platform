import { LoginRequest, RegisterRequest } from '../../../../core/api/auth.api';
// login.component.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, forkJoin, of, tap } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  errorMessage = '';
  private _registerRequests: RegisterRequest[] = [
    {
      name: 'a',
      email: 'a',
      password: 'a',
    },
    {
      name: 'b',
      email: 'b',
      password: 'b',
    },
    {
      name: 'c',
      email: 'c',
      password: 'c',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    const registerObservables = this._registerRequests.map((request) =>
      this.authService.register(request)
    );

    forkJoin(registerObservables).subscribe({
      next: () => {
        // this._login();
      },
    });
  }

  private _login() {
    const loginRequest: LoginRequest = {
      email: this._registerRequests[0].email,
      password: this._registerRequests[0].password,
    };
    this.authService
      .login(loginRequest)
      .pipe(
        tap(() => {
          this.router.navigate(['/novel']);
        }),
        catchError(() => {
          this.errorMessage = 'Invalid email or password. Please try again.';
          return of(null);
        })
      )
      .subscribe();
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    const loginRequest: LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.authService
      .login(loginRequest)
      .pipe(
        tap(() => {
          this.router.navigate(['/novel']);
        }),
        catchError(() => {
          this.errorMessage = 'Invalid email or password. Please try again.';
          return of(null);
        })
      )
      .subscribe();
  }
}
