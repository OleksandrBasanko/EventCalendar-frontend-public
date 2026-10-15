import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { EventDto } from '../models/event.model';
import { EventSubscriberDto } from '../models/eventSubscriber.model';
import { AuthService } from '../services/auth.service';
import { BackendApiService } from '../services/backend-api.service';

@Component({
  selector: 'app-event-details',
  standalone: false,
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css',
})
export class EventDetailsComponent implements OnInit {
  private eventSubject = new BehaviorSubject<EventDto | null>(null);
  // Завдяки .asObservable() ми перетворюємо BehaviorSubject на звичайний Observable. HTML-шаблон підписується на event$, але не може випадково змінити чи зіпсувати дані всередині нього
  // event$ посилається на eventSubject.asObservable(), оновлення в eventSubject миттєво з'являється у змінній event$
  event$: Observable<EventDto | null> = this.eventSubject.asObservable();

  private subscribersSubject = new BehaviorSubject<EventSubscriberDto[]>([]);
  subscribers$ = this.subscribersSubject.asObservable();
  eventId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private backendApiService: BackendApiService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventId = params['id'];

      this.backendApiService.getEventById(this.eventId).subscribe(event => {
        this.eventSubject.next(event);
      }); // дані записуються у eventSubject а звідти до event$

      if (this.isAdmin()) {
        this.loadSubscribers();
      }
    });
  }

  private loadSubscribers(): void {
    this.backendApiService.getEventSubscribersById(this.eventId)
      .subscribe(subscribers => this.subscribersSubject.next(subscribers));
  }

  isAdmin(): boolean {
    return this.authService.hasRole('admin');
  }

  handleSubscription(event: EventDto): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const action$ = event.isSubscribed
      ? this.backendApiService.unsubscribeFromEvent(this.eventId)
      : this.backendApiService.subscribeForEvent(this.eventId);

    // subscribe ініціалізує запит на бекенд unsubscribeFromEvent чи subscribeForEvent
    action$.subscribe(() => {
      // {} — створюється абсолютно новий об'єкт в оперативній пам'яті.
      // ...event (Spread-оператор) — розпаковує та копіює всі існуючі поля зі старого об'єкта event (id, eventName, startDate, ownerId тощо) у новий об'єкт
      // isSubscribed: !event.isSubscribed — инвертує значення (якщо було true, стає false, і навпаки) та перезаписує тільки це одне поле у новому об'єкті
      this.eventSubject.next({ ...event, isSubscribed: !event.isSubscribed });
    });
  }

  removeUserFromEvent(event: EventDto, targetUserId: string): void {
    if (targetUserId === event.ownerId) {
      alert('It is not possible to remove the event owner.');
      return;
    }

    this.backendApiService.removeUserFromEvent(this.eventId, targetUserId).subscribe(() => {
      const updated = this.subscribersSubject.value.filter(s => s.userId !== targetUserId);
      this.subscribersSubject.next(updated);
    });
  }

  isOwner(event: EventDto): boolean {
    return this.authService.getUserId() === event.ownerId;
  }

  deleteEvent(): void {
    this.backendApiService.softDeleteEventById(this.eventId).subscribe(() => {
      this.router.navigate(['/events']);
    });
  }

  navigateEditEvent(): void {
    this.router.navigate(['/events', this.eventId, 'edit-event']);
  }

  navigateBackToEvents(): void {
    this.router.navigate(['/events']);
  }
}
