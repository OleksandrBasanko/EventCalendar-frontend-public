import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EventDto } from '../models/event.model';
import { EventSubscriberDto } from '../models/eventSubscriber.model';
import { UpdateEventRequest } from '../models/updateEventRequest.model';
import { CreateEventRequest } from '../models/createEventRequest.model';

@Injectable({
  providedIn: 'root',
})
export class BackendApiService {
  private readonly baseUrl = '/api';

  constructor(private http: HttpClient) {}

  getEventsByMonth(year: number, month: number): Observable<EventDto[]> {
    const params = new HttpParams().set('year', year).set('month', month);
    return this.http.get<EventDto[]>(`${this.baseUrl}/Events`, { params });
  }

  getEventById(id: string): Observable<EventDto> {
    return this.http.get<EventDto>(`${this.baseUrl}/Events/${id}`);
  }

  getEventSubscribersById(id: string): Observable<EventSubscriberDto[]> {
    return this.http.get<EventSubscriberDto[]>(`${this.baseUrl}/Events/${id}/subscribers`);
  }

  createEvent(request: CreateEventRequest): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/Events`, request);
  }

  updateEventById(request: UpdateEventRequest): Observable<boolean> {
    return this.http.put<boolean>(`${this.baseUrl}/Events/${request.eventId}/edit_event`, request);
  }

  softDeleteEventById(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/Events/${id}`);
  }

  subscribeForEvent(id: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/Events/${id}/subscribe`, {});
  }

  unsubscribeFromEvent(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/Events/${id}/unsubscribe`);
  }

  removeUserFromEvent(eventId: string, targetUserId: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/Events/${eventId}/participants/${targetUserId}`);
  }
}
