import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { BackendApiService } from '../services/backend-api.service';
import { EventDto } from '../models/event.model';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-events',
  standalone: false,
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})
export class EventsComponent implements OnInit {
  year = 0;
  month = 0;
  day = 0;

  daysInCurrentMonth = 0;
  daysInPreviousMonth = 0;
  leadingStartDay = 0;

  eventsOfMonth$: Observable<EventDto[]> = of([]);

  readonly monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  constructor(
    private backendApiService: BackendApiService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Читаємо початковий стан з URL лише один раз, при вході на сторінку
    const params = this.route.snapshot.queryParams;
    const today = new Date();

    this.year = params['year'] ? Number(params['year']) : today.getFullYear();
    this.month = params['month'] ? Number(params['month']) : today.getMonth() + 1;
    this.day = params['day'] ? Number(params['day']) : today.getDate();

    this.calculateCalendarLayout();
    this.loadEventsForMonth();
    this.syncUrl();
  }

  previousMonth(): void {
    const newMonth = this.month - 1 === 0 ? 12 : this.month - 1;
    const newYear = this.month - 1 === 0 ? this.year - 1 : this.year;

    this.year = newYear;
    this.month = newMonth;

    this.calculateCalendarLayout();
    this.loadEventsForMonth();
    this.syncUrl();
  }

  nextMonth(): void {
    const newMonth = this.month + 1 === 13 ? 1 : this.month + 1;
    const newYear = this.month + 1 === 13 ? this.year + 1 : this.year;

    this.year = newYear;
    this.month = newMonth;

    this.calculateCalendarLayout();
    this.loadEventsForMonth();
    this.syncUrl();
  }

  selectDay(day: number): void {
    this.day = day;
    this.syncUrl();
  }

  selectEvent(event: EventDto): void {
    this.router.navigate(['/events', event.id]);
  }

  getDots(count: number): number[][] {
    if (count === 1) return [[1]];
    if (count === 2) return [[1, 2]];
    return [[1], [2, 3]];
  }

  get currentMonthDays(): number[] {
    return Array.from({ length: this.daysInCurrentMonth }, (_, i) => i + 1);
  }

  get leadingDays(): number[] {
    if (this.leadingStartDay === 0) return [];
    const days: number[] = [];
    for (let d = this.leadingStartDay; d <= this.daysInPreviousMonth; d++) {
      days.push(d);
    }
    return days;
  }

  private loadEventsForMonth(): void {
    this.eventsOfMonth$ = this.backendApiService.getEventsByMonth(this.year, this.month);
  }

  private calculateCalendarLayout(): void {
    this.daysInCurrentMonth = new Date(this.year, this.month, 0).getDate();
    this.daysInPreviousMonth = new Date(this.year, this.month - 1, 0).getDate();

    const firstDayOfMonth = new Date(this.year, this.month - 1, 1).getDay();
    const leadingDaysCount = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    this.leadingStartDay = leadingDaysCount === 0
      ? 0
      : this.daysInPreviousMonth - leadingDaysCount + 1;
  }

  /**
   * Оновлює URL (для можливості поділитись посиланням / оновити сторінку
   * з тим самим станом), але БЕЗ проходження через Angular Router —
   * тому ngOnInit не викликається повторно і компонент не перестворюється.
   */
  private syncUrl(): void {
    const url = this.router
      .createUrlTree([], {
        relativeTo: this.route,
        queryParams: { year: this.year, month: this.month, day: this.day },
      })
      .toString();

    this.location.replaceState(url);
  }

  getEventsForDay(events: EventDto[], day: number): EventDto[] {
    return events.filter(e => new Date(e.startDate).getDate() === day);
  }

  getSelectedDayEvents(events: EventDto[]): EventDto[] {
    return this.getEventsForDay(events, this.day);
  }

  isAdmin(): boolean {
    return this.authService.hasRole('admin');
  }

  createNewEvent(): void {
    this.router.navigate(['create-new-event']);
  }
}
