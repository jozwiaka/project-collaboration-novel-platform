import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { NovelDTO, NovelsResponse } from '../models/novel-api.models';
import { UserService } from 'src/app/core/services/user.service';
import { Novel } from '../models/novel.model';
import { User } from 'src/app/core/models/user.model';
import { Sort } from 'src/app/core/models/api.models';

@Injectable({
  providedIn: 'root',
})
export class NovelService {
  private baseUrl = 'http://localhost:8080/api/novels';

  constructor(private http: HttpClient, private userService: UserService) {}

  findOne(id: number): Observable<NovelDTO> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<NovelDTO>(url).pipe(catchError(this.handleError));
  }

  create(novel: NovelDTO): Observable<NovelDTO> {
    const { id, ...payload } = novel;
    return this.http
      .post<any>(this.baseUrl, payload)
      .pipe(catchError(this.handleError));
  }

  update(novel: NovelDTO): Observable<NovelDTO> {
    const url = `${this.baseUrl}/${novel.id}`;
    return this.http
      .put<NovelDTO>(url, novel)
      .pipe(catchError(this.handleError));
  }

  remove(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url).pipe(catchError(this.handleError));
  }

  findByAuthorId(
    authorId: number,
    totalNumberOfPages: number,
    sort: Sort
  ): Observable<NovelsResponse> {
    const url = new URL(`${this.baseUrl}/search/findByAuthorId`);
    url.searchParams.set('authorId', `${authorId}`);
    url.searchParams.set('sort', `${sort.sortBy},${sort.direction}`);
    return this.find(url, totalNumberOfPages);
  }

  findSharedWithUserId(
    userId: number,
    totalNumberOfPages: number,
    sort: Sort
  ): Observable<NovelsResponse> {
    const url = new URL(`${this.baseUrl}/search/findSharedWithUserId`);
    url.searchParams.set('userId', `${userId}`);
    url.searchParams.set('sort', `${sort.sortBy},${sort.direction}`);
    return this.find(url, totalNumberOfPages);
  }

  findByCollaboratorsUserId(
    userId: number,
    totalNumberOfPages: number,
    sort: Sort
  ): Observable<NovelsResponse> {
    const url = new URL(`${this.baseUrl}/search/findByCollaborators_User_Id`);
    url.searchParams.set('userId', `${userId}`);
    url.searchParams.set('sort', `${sort.sortBy},${sort.direction}`);
    return this.find(url, totalNumberOfPages);
  }

  findByTagId(
    tagId: number,
    totalNumberOfPages: number,
    sort: Sort
  ): Observable<NovelsResponse> {
    const url = new URL(`${this.baseUrl}/search/findByNovelTags_Tag_Id`);
    url.searchParams.set('tagId', `${tagId}`);
    url.searchParams.set('sort', `${sort.sortBy},${sort.direction}`);
    return this.find(url, totalNumberOfPages);
  }

  findByAuthorIdAndTitleContaining(
    authorId: number,
    totalNumberOfPages: number,
    sort: Sort,
    title: string
  ): Observable<NovelsResponse> {
    const url = new URL(
      `${this.baseUrl}/search/findByAuthorIdAndTitleContainingIgnoreCase`
    );
    url.searchParams.set('authorId', `${authorId}`);
    url.searchParams.set('sort', `${sort.sortBy},${sort.direction}`);
    url.searchParams.set('title', `${title}`);
    return this.find(url, totalNumberOfPages);
  }

  findSharedWithUserIdAndTitleContaining(
    userId: number,
    totalNumberOfPages: number,
    sort: Sort,
    title: string
  ): Observable<NovelsResponse> {
    const url = new URL(
      `${this.baseUrl}/search/findSharedWithUserIdAndTitleContainingIgnoreCase`
    );
    url.searchParams.set('userId', `${userId}`);
    url.searchParams.set('sort', `${sort.sortBy},${sort.direction}`);
    url.searchParams.set('title', `${title}`);
    return this.find(url, totalNumberOfPages);
  }

  findByCollaboratorsUserIdAndTitleContaining(
    userId: number,
    totalNumberOfPages: number,
    sort: Sort,
    title: string
  ): Observable<NovelsResponse> {
    const url = new URL(
      `${this.baseUrl}/search/findByCollaborators_User_IdAndTitleContainingIgnoreCase`
    );
    url.searchParams.set('userId', `${userId}`);
    url.searchParams.set('sort', `${sort.sortBy},${sort.direction}`);
    url.searchParams.set('title', `${title}`);
    return this.find(url, totalNumberOfPages);
  }

  findByTagIdAndTitleContaining(
    tagId: number,
    totalNumberOfPages: number,
    sort: Sort,
    title: string
  ): Observable<NovelsResponse> {
    const url = new URL(
      `${this.baseUrl}/search/findByNovelTags_Tag_IdAndTitleContainingIgnoreCase`
    );
    url.searchParams.set('tagId', `${tagId}`);
    url.searchParams.set('sort', `${sort.sortBy},${sort.direction}`);
    url.searchParams.set('title', `${title}`);
    return this.find(url, totalNumberOfPages);
  }

  private find(
    url: URL,
    totalNumberOfPages: number
  ): Observable<NovelsResponse> {
    const requests: Observable<NovelsResponse>[] = [];
    for (let pageNumber = 0; pageNumber < totalNumberOfPages; pageNumber++) {
      url.searchParams.set('page', `${pageNumber}`);
      requests.push(
        this.http
          .get<NovelsResponse>(url.toString())
          .pipe(catchError(this.handleError))
      );
    }
    return forkJoin(requests).pipe(
      map((responses: NovelsResponse[]) => {
        const latestPage =
          responses.length > 0
            ? responses[responses.length - 1].page
            : { size: 0, totalElements: 0, totalPages: 0, number: 0 };
        const allNovels: NovelDTO[] = responses.reduce(
          (acc: NovelDTO[], curr: NovelsResponse) => {
            return acc.concat(curr._embedded.novels);
          },
          []
        );
        return { _embedded: { novels: allNovels }, page: latestPage };
      })
    );
  }

  public build(novelData: NovelDTO): Observable<Novel> {
    return this.userService.findOne(novelData.authorId).pipe(
      mergeMap((authorData) => {
        const author = new User(authorData);
        const novel = new Novel(novelData, author, []);
        return of(novel);
      })
    );
  }

  public buildWithId(novelId: number): Observable<Novel> {
    return this.findOne(novelId).pipe(
      mergeMap((novelData: NovelDTO) => {
        return this.build(novelData);
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
