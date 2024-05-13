import { HttpClient } from '@angular/common/http';
import { AiRequest, AiResponse } from '../api/ai.api';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private baseUrl = 'http://localhost:5000/api/ai';

  constructor(private http: HttpClient) {}

  generate(aiRequest: AiRequest): Observable<AiResponse> {
    const url = `${this.baseUrl}/generate`;
    return this.http.post<AiResponse>(url, aiRequest);
  }
}
