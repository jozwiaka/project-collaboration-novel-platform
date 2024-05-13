import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, throwError } from 'rxjs';
import { UserDTO, UsersResponse } from '../api/user.api';
import { Page, Sort } from '../api/util.api';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  findOne(id: number): Observable<UserDTO> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<UserDTO>(url);
  }

  findByEmail(email: string): Observable<UserDTO> {
    const url = `${this.baseUrl}/search/findByEmail?email=${email}`;
    return this.http.get<UserDTO>(url);
  }

  update(userData: UserDTO): Observable<UserDTO> {
    const url = `${this.baseUrl}/${userData.id}`;
    return this.http.put<UserDTO>(url, userData);
  }

  remove(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}
