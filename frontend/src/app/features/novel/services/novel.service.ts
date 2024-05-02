import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { NovelDTO, NovelsResponse } from '../models/novel-api.models';
import { UserService } from 'src/app/core/services/user.service';
import { Novel } from '../models/novel.model';
import { User } from 'src/app/core/models/user.model';
import { Sort } from 'src/app/shared/models/api.models';

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

  findAll(totalNumberOfPages: number, sort: Sort): Observable<NovelsResponse> {
    const url = `${this.baseUrl}`;
    return this.find(url, totalNumberOfPages, sort);
  }

  findByAuthorId(
    authorId: number,
    totalNumberOfPages: number,
    sort: Sort
  ): Observable<NovelsResponse> {
    const url = `${this.baseUrl}/search/findByAuthorId?authorId=${authorId}`;
    return this.find(url, totalNumberOfPages, sort);
  }

  findSharedWithUserId(
    userId: number,
    totalNumberOfPages: number,
    sort: Sort
  ): Observable<NovelsResponse> {
    const url = `${this.baseUrl}/search/findSharedWithUserId?userId=${userId}`;
    return this.find(url, totalNumberOfPages, sort);
  }

  findByCollaboratorsUserId(
    userId: number,
    totalNumberOfPages: number,
    sort: Sort
  ): Observable<NovelsResponse> {
    const url = `${this.baseUrl}/search/findByCollaborators_User_Id?userId=${userId}`;
    return this.find(url, totalNumberOfPages, sort);
  }

  findByTagId(
    tagId: number,
    totalNumberOfPages: number,
    sort: Sort
  ): Observable<NovelsResponse> {
    const url = `${this.baseUrl}/search/findByNovelTags_Tag_Id?tagId=${tagId}`;
    return this.find(url, totalNumberOfPages, sort);
  }

  findByAuthorIdAndTitleContaining(
    authorId: number,
    totalNumberOfPages: number,
    sort: Sort,
    title: string
  ): Observable<NovelsResponse> {
    const url = `${this.baseUrl}/search/findByAuthorIdAndTitleContainingIgnoreCase?authorId=${authorId}&title=${title}`;
    return this.find(url, totalNumberOfPages, sort);
  }

  findSharedWithUserIdAndTitleContaining(
    userId: number,
    totalNumberOfPages: number,
    sort: Sort,
    title: string
  ): Observable<NovelsResponse> {
    const url = `${this.baseUrl}/search/findSharedWithUserIdAndTitleContainingIgnoreCase?userId=${userId}&title=${title}`;
    return this.find(url, totalNumberOfPages, sort);
  }

  findByCollaboratorsUserIdAndTitleContaining(
    userId: number,
    totalNumberOfPages: number,
    sort: Sort,
    title: string
  ): Observable<NovelsResponse> {
    const url = `${this.baseUrl}/search/findByCollaborators_User_IdAndTitleContainingIgnoreCase?userId=${userId}&title=${title}`;
    return this.find(url, totalNumberOfPages, sort);
  }

  findByTagIdAndTitleContaining(
    tagId: number,
    totalNumberOfPages: number,
    sort: Sort,
    title: string
  ): Observable<NovelsResponse> {
    const url = `${this.baseUrl}/search/findByNovelTags_Tag_IdAndTitleContainingIgnoreCase?tagId=${tagId}&title=${title}`;
    return this.find(url, totalNumberOfPages, sort);
  }

  private find(
    urlStr: string,
    totalNumberOfPages: number,
    sort: Sort
  ): Observable<NovelsResponse> {
    const url = new URL(urlStr);
    url.searchParams.set('sort', `${sort.sortBy},${sort.direction}`);

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
