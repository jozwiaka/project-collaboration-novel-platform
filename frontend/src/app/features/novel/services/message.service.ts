import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { MessageDTO, MessagesResponse } from '../models/message-api.models';
import { UserService } from 'src/app/core/services/user.service';
import { Message } from '../models/message.model';
import { User } from 'src/app/core/models/user.model';
import { NovelService } from './novel.service';
import { UserDTO } from 'src/app/core/models/user-api.models';
import { Novel } from '../models/novel.model';
import { Sort } from 'src/app/core/models/api.models';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private baseUrl = 'http://localhost:8080/api/messages';

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private novelService: NovelService
  ) {}

  findOne(id: number): Observable<MessageDTO> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<MessageDTO>(url).pipe(catchError(this.handleError));
  }

  create(message: MessageDTO): Observable<MessageDTO> {
    const { id, ...payload } = message;
    return this.http
      .post<any>(this.baseUrl, payload)
      .pipe(catchError(this.handleError));
  }

  remove(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url).pipe(catchError(this.handleError));
  }

  findAll(
    totalNumberOfPages: number,
    sort: Sort
  ): Observable<MessagesResponse> {
    const url = `${this.baseUrl}`;
    return this.find(url, totalNumberOfPages, sort);
  }

  findByNovelId(
    novelId: number,
    totalNumberOfPages: number,
    sort: Sort
  ): Observable<MessagesResponse> {
    const url = `${this.baseUrl}/search/findByNovelId?novelId=${novelId}`;
    return this.find(url, totalNumberOfPages, sort);
  }

  private find(
    urlStr: string,
    totalNumberOfPages: number,
    sort: Sort
  ): Observable<MessagesResponse> {
    const url = new URL(urlStr);
    url.searchParams.set('sort', `${sort.sortBy},${sort.direction}`);

    const requests: Observable<MessagesResponse>[] = [];
    for (let pageNumber = 0; pageNumber < totalNumberOfPages; pageNumber++) {
      url.searchParams.set('page', `${pageNumber}`);
      requests.push(
        this.http
          .get<MessagesResponse>(url.toString())
          .pipe(catchError(this.handleError))
      );
    }
    return forkJoin(requests).pipe(
      map((responses: MessagesResponse[]) => {
        const latestPage =
          responses.length > 0
            ? responses[responses.length - 1].page
            : { size: 0, totalElements: 0, totalPages: 0, number: 0 };
        const allMessages: MessageDTO[] = responses.reduce(
          (acc: MessageDTO[], curr: MessagesResponse) => {
            return acc.concat(curr._embedded.messages);
          },
          []
        );
        return { _embedded: { messages: allMessages }, page: latestPage };
      })
    );
  }

  public build(messageData: MessageDTO): Observable<Message> {
    return forkJoin([
      this.userService.findOne(messageData.userId),
      this.novelService.buildWithId(messageData.novelId),
    ]).pipe(
      mergeMap(([userData, novel]: [UserDTO, Novel]) => {
        const user = new User(userData);
        const message = new Message(messageData, user, novel);
        return of(message);
      })
    );
  }

  public buildWithId(messageId: number): Observable<Message> {
    return this.findOne(messageId).pipe(
      mergeMap((messageData: MessageDTO) => {
        return this.build(messageData);
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
