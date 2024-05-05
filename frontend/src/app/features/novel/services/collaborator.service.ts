import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Observable,
  catchError,
  forkJoin,
  map,
  mergeMap,
  of,
  throwError,
} from 'rxjs';
import {
  CollaboratorDTO,
  CollaboratorsResponse,
} from '../models/collaborator-api.models';
import { Sort } from 'src/app/core/models/api.models';
import { User } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user.service';
import { Collaborator } from '../models/collaborator.model';
import { NovelService } from './novel.service';
import { UserDTO } from 'src/app/core/models/user-api.models';
import { Novel } from '../models/novel.model';

@Injectable({
  providedIn: 'root',
})
export class CollaboratorService {
  private baseUrl = 'http://localhost:8080/api/collaborators';

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private novelService: NovelService
  ) {}

  remove(id: number | undefined): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url).pipe(catchError(this.handleError));
  }

  create(collaboratorData: CollaboratorDTO): Observable<CollaboratorDTO> {
    return this.http
      .post<CollaboratorDTO>(this.baseUrl, collaboratorData)
      .pipe(catchError(this.handleError));
  }

  findOne(id: number): Observable<CollaboratorDTO> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .get<CollaboratorDTO>(url)
      .pipe(catchError(this.handleError));
  }

  findByNovelId(
    novelId: number,
    totalNumberOfPages: number,
    sort: Sort
  ): Observable<CollaboratorsResponse> {
    const url = new URL(`${this.baseUrl}/search/findByNovelId`);
    url.searchParams.set('novelId', `${novelId}`);
    url.searchParams.set('sort', `${sort.sortBy},${sort.direction}`);
    return this.find(url, totalNumberOfPages);
  }

  findByNovelIdAndUserId(
    novelId: number,
    userId: number
  ): Observable<CollaboratorDTO> {
    const url = `${this.baseUrl}/search/findByNovelIdAndUserId?novelId=${novelId}&userId=${userId}`;
    return this.http
      .get<CollaboratorDTO>(url)
      .pipe(catchError(this.handleError));
  }

  private find(
    url: URL,
    totalNumberOfPages: number
  ): Observable<CollaboratorsResponse> {
    const requests: Observable<CollaboratorsResponse>[] = [];
    for (let pageNumber = 0; pageNumber < totalNumberOfPages; pageNumber++) {
      url.searchParams.set('page', `${pageNumber}`);
      requests.push(
        this.http
          .get<CollaboratorsResponse>(url.toString())
          .pipe(catchError(this.handleError))
      );
    }
    return forkJoin(requests).pipe(
      map((responses: CollaboratorsResponse[]) => {
        const latestPage =
          responses.length > 0
            ? responses[responses.length - 1].page
            : { size: 0, totalElements: 0, totalPages: 0, number: 0 };
        const allCollaborators: CollaboratorDTO[] = responses.reduce(
          (acc: CollaboratorDTO[], curr: CollaboratorsResponse) => {
            return acc.concat(curr._embedded.collaborators);
          },
          []
        );
        return {
          _embedded: { collaborators: allCollaborators },
          page: latestPage,
        };
      })
    );
  }

  public build(collaboratorData: CollaboratorDTO): Observable<Collaborator> {
    return forkJoin([
      this.userService.findOne(collaboratorData.userId),
      this.novelService.buildWithId(collaboratorData.novelId),
    ]).pipe(
      mergeMap(([userData, novel]: [UserDTO, Novel]) => {
        const user = new User(userData);
        const collaborator = new Collaborator(collaboratorData, user, novel);
        return of(collaborator);
      })
    );
  }

  public buildWithId(collaboratorId: number): Observable<Collaborator> {
    return this.findOne(collaboratorId).pipe(
      mergeMap((collaboratorData: CollaboratorDTO) => {
        return this.build(collaboratorData);
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
