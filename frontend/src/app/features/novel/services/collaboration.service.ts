import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  CollaborationMessageRequest,
  CollaborationMessageResponse,
} from '../models/collaboration-api.models';

@Injectable({
  providedIn: 'root',
})
export class CollaborationService {
  private socket: WebSocket;
  private isSocketOpen = false;
  private messageSubject = new Subject<any>();

  constructor() {
    this.socket = new WebSocket('ws://localhost:3000');

    this.socket.onopen = () => {
      this.isSocketOpen = true;
    };

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data) as CollaborationMessageResponse;
      this.messageSubject.next(message);
    };
  }

  private waitForSocketToOpen(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.isSocketOpen) {
        resolve();
      } else {
        const checkOpen = () => {
          if (this.isSocketOpen) {
            clearInterval(interval);
            resolve();
          }
        };

        const interval = setInterval(checkOpen, 100);
      }
    });
  }

  async send(message: CollaborationMessageRequest): Promise<void> {
    await this.waitForSocketToOpen();
    // console.log(`Sending message ${message.type}`);
    this.socket.send(JSON.stringify(message));
  }

  onMessage(): Observable<CollaborationMessageResponse> {
    return this.messageSubject.asObservable();
  }
}
