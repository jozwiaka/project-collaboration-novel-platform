import { Sort, SortDirection } from '../../../core/api/util.api';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { TagDTO, TagsResponse } from '../api/tag.api';
import { UserService } from 'src/app/core/services/user.service';
import { NovelService } from './novel.service';
import { UserDTO } from 'src/app/core/api/user.api';
import { User } from 'src/app/core/models/user.model';
import { Tag } from '../models/tag.model';
import { NovelDTO, NovelsResponse } from '../api/novel.api';
import { Novel } from '../models/novel.model';
import { ColorService } from 'src/app/core/services/color.service';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private novelService: NovelService,
    private colorService: ColorService
  ) {}

  findOne(id: number): Observable<TagDTO> {
    const url = `${this.apiUrl}/tags/${id}`;
    return this.http.get<TagDTO>(url).pipe(catchError(this.handleError));
  }

  create(tag: TagDTO): Observable<TagDTO> {
    // const url = `${this.apiUrl}/users/${tag.userId}/tags`;
    const url = `${this.apiUrl}/users/${tag.userId}/tags`;
    const { id, ...payload } = tag;
    return this.http.post<any>(url, payload).pipe(catchError(this.handleError));
  }

  update(tag: TagDTO): Observable<TagDTO> {
    const url = `${this.apiUrl}/tags/${tag.id}`;
    return this.http.put<TagDTO>(url, tag).pipe(catchError(this.handleError));
  }

  remove(userId: number, id: number): Observable<void> {
    const url = `${this.apiUrl}/users/${userId}/tags/${id}`;
    return this.http.delete<void>(url).pipe(catchError(this.handleError));
  }

  findByUserId(
    userId: number,
    totalNumberOfPages: number,
    sort: Sort
  ): Observable<TagsResponse> {
    const urlStr = `${this.apiUrl}/tags/search/findByUserId`;
    const url = new URL(urlStr);
    url.searchParams.set('userId', `${userId}`);
    url.searchParams.set('sort', `${sort.sortBy},${sort.direction}`);
    return this.find(url, totalNumberOfPages);
  }

  findByUserIdAndNovelId(
    userId: number,
    novelId: number,
    totalNumberOfPages: number,
    sort: Sort
  ): Observable<TagsResponse> {
    const url = new URL(
      `${this.apiUrl}/tags/search/findByUserIdAndNovelTags_Novel_Id`
    );
    url.searchParams.set('userId', `${userId}`);
    url.searchParams.set('novelId', `${novelId}`);
    url.searchParams.set('sort', `${sort.sortBy},${sort.direction}`);
    return this.find(url, totalNumberOfPages);
  }

  private find(url: URL, totalNumberOfPages: number): Observable<TagsResponse> {
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
    return forkJoin([
      this.novelService
        .findByTagId(tagData.id ? tagData.id : 0, 1, {
          sortBy: '',
          direction: SortDirection.Desc,
        })
        .pipe(
          mergeMap((novelsResponse: NovelsResponse) => {
            if (!novelsResponse._embedded.novels.length) {
              return of([]);
            }
            return forkJoin(
              novelsResponse._embedded.novels.map((novelData) =>
                this.novelService.build(novelData)
              )
            );
          })
        ),
    ]).pipe(
      mergeMap(([novels]: [Novel[]]) => {
        const tag = new Tag(
          tagData,
          novels,
          this.colorService.getRandomColor()
        );
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
