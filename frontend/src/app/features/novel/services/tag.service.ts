import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { TagDTO, TagsResponse } from '../models/tag-api.models';
import { UserService } from 'src/app/core/services/user.service';
import { NovelService } from './novel.service';
import { Sort } from 'src/app/shared/models/api.models';
import { UserDTO } from 'src/app/core/models/user-api.models';
import { User } from 'src/app/core/models/user.model';
import { Tag } from '../models/tag.model';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private baseUrl = 'http://localhost:8080/api/tags';

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private novelService: NovelService
  ) {}

  findOne(id: number): Observable<TagDTO> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<TagDTO>(url).pipe(catchError(this.handleError));
  }

  create(tag: TagDTO): Observable<TagDTO> {
    const { id, ...payload } = tag;
    return this.http
      .post<any>(this.baseUrl, payload)
      .pipe(catchError(this.handleError));
  }

  remove(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url).pipe(catchError(this.handleError));
  }

  findAll(totalNumberOfPages: number, sort: Sort): Observable<TagsResponse> {
    const url = `${this.baseUrl}`;
    return this.find(url, totalNumberOfPages, sort);
  }

  findByUserId(
    userId: number,
    totalNumberOfPages: number,
    sort: Sort
  ): Observable<TagsResponse> {
    const url = `${this.baseUrl}/search/findByUserId?userId=${userId}`;
    return this.find(url, totalNumberOfPages, sort);
  }

  private find(
    urlStr: string,
    totalNumberOfPages: number,
    sort: Sort
  ): Observable<TagsResponse> {
    const url = new URL(urlStr);
    url.searchParams.set('sort', `${sort.sortBy},${sort.direction}`);

    const requests: Observable<TagsResponse>[] = [];
    for (let pageNumber = 0; pageNumber < totalNumberOfPages; pageNumber++) {
      url.searchParams.set('page', `${pageNumber}`);
      requests.push(
        this.http
          .get<TagsResponse>(url.toString())
          .pipe(catchError(this.handleError))
      );
    }
    return forkJoin(requests).pipe(
      map((responses: TagsResponse[]) => {
        const latestPage =
          responses.length > 0
            ? responses[responses.length - 1].page
            : { size: 0, totalElements: 0, totalPages: 0, number: 0 };
        const allTags: TagDTO[] = responses.reduce(
          (acc: TagDTO[], curr: TagsResponse) => {
            return acc.concat(curr._embedded.tags);
          },
          []
        );
        return { _embedded: { tags: allTags }, page: latestPage };
      })
    );
  }

  public build(tagData: TagDTO): Observable<Tag> {
    return forkJoin([this.userService.findOne(tagData.userId)]).pipe(
      mergeMap(([userData]: [UserDTO]) => {
        const user = new User(userData);
        const tag = new Tag(tagData, user);
        return of(tag);
      })
    );
  }

  public buildWithId(tagId: number): Observable<Tag> {
    return this.findOne(tagId).pipe(
      mergeMap((tagData: TagDTO) => {
        return this.build(tagData);
      })
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nTag: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}
