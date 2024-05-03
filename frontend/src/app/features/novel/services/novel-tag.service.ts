import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { NovelTagDTO } from '../models/novel-tag-api';

@Injectable({
  providedIn: 'root',
})
export class NovelTagService {
  private baseUrl = 'http://localhost:8080/api/novelTags';

  constructor(private http: HttpClient) {}

  create(novelTagData: NovelTagDTO): Observable<NovelTagDTO> {
    return this.http
      .post<NovelTagDTO>(this.baseUrl, novelTagData)
      .pipe(catchError(this.handleError));
  }

  remove(id: number | undefined): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url).pipe(catchError(this.handleError));
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
