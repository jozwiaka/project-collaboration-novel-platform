import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, throwError } from 'rxjs';
import { UserDTO, UsersResponse } from '../models/user-api.models';
import { Page, Sort } from '../models/api.models';

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

  findAll(totalNumberOfPages: number, sort: Sort): Observable<UsersResponse> {
    const url = `${this.baseUrl}`;
    return this.find(url, totalNumberOfPages, sort);
  }

  findByCollaboratorsNovelId(
    novelId: number,
    totalNumberOfPages: number,
    sort: Sort
  ): Observable<UsersResponse> {
    const url = `${this.baseUrl}/search/findByCollaborators_Novel_Id?novelId=${novelId}`;
    return this.find(url, totalNumberOfPages, sort);
  }

  private find(
    urlStr: string,
    totalNumberOfPages: number,
    sort: Sort
  ): Observable<UsersResponse> {
    const url = new URL(urlStr);
    url.searchParams.set('sort', `${sort.sortBy},${sort.direction}`);

    const requests: Observable<UsersResponse>[] = [];
    for (let pageNumber = 0; pageNumber < totalNumberOfPages; pageNumber++) {
      url.searchParams.set('page', `${pageNumber}`);
      requests.push(
        this.http
          .get<UsersResponse>(url.toString())
          .pipe(catchError(this.handleError))
      );
    }
    return forkJoin(requests).pipe(
      map((responses: UsersResponse[]) => {
        const latestPage =
          responses.length > 0
            ? responses[responses.length - 1].page
            : { size: 0, totalElements: 0, totalPages: 0, number: 0 };
        const allUsers: UserDTO[] = responses.reduce(
          (acc: UserDTO[], curr: UsersResponse) => {
            return acc.concat(curr._embedded.users);
          },
          []
        );
        return { _embedded: { users: allUsers }, page: latestPage };
      })
    );
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
