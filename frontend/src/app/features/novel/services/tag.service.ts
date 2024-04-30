import { Sort, SortDirection } from './../../../shared/models/api.models';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { TagDTO, TagsResponse } from '../models/tag-api.models';
import { UserService } from 'src/app/core/services/user.service';
import { NovelService } from './novel.service';
import { UserDTO } from 'src/app/core/models/user-api.models';
import { User } from 'src/app/core/models/user.model';
import { Tag } from '../models/tag.model';
import { NovelDTO, NovelsResponse } from '../models/novel-api.models';

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

  update(tag: TagDTO): Observable<TagDTO> {
    const url = `${this.baseUrl}/${tag.id}`;
    return this.http.put<TagDTO>(url, tag).pipe(catchError(this.handleError));
  }

  remove(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url).pipe(catchError(this.handleError));
  }

  findByUserId(userId: number, sort: Sort): Observable<TagDTO[]> {
    const urlStr = `${this.baseUrl}/search/findByUserId`;
    const url = new URL(urlStr);
    url.searchParams.set('userId', `${userId}`);
    url.searchParams.set('sort', `${sort.sortBy},${sort.direction}`);
    return this.http
      .get<TagDTO[]>(url.toString())
      .pipe(catchError(this.handleError));
  }

  public build(tagData: TagDTO): Observable<Tag> {
    return forkJoin([
      this.userService.findOne(tagData.userId),
      this.novelService.findByTagId(tagData.id ? tagData.id : 0, 1, {
        sortBy: '',
        direction: SortDirection.Desc,
      }),
    ]).pipe(
      mergeMap(([userData, novelsResponse]: [UserDTO, NovelsResponse]) => {
        const user = new User(userData);
        const tag = new Tag(tagData, user, novelsResponse.page.totalElements);
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
