import { LoginRequest, RegisterResponse } from '../api/auth.api';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserDTO } from '../api/user.api';
import { LoginResponse, RegisterRequest } from '../api/auth.api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient, private router: Router) {}

  register(registerRequest: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.apiUrl}/register`,
      registerRequest
    );
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        tap((response: LoginResponse) => {
          if (response) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  get currentUser(): UserDTO | null {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      return this.convertToUserDTO(JSON.parse(userData));
    }
    return null;
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  private convertToUserDTO(user: any): UserDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }
}
