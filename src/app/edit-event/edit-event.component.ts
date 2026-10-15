import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BackendApiService } from '../services/backend-api.service';
import { EventDto } from '../models/event.model';
import { EventFormData } from '../event-form/event-form.component';

@Component({
  selector: 'app-edit-event',
  standalone: false,
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.css',
})
export class EditEventComponent implements OnInit {
  event$: Observable<EventDto> | null = null;
  eventId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private backendApiService: BackendApiService
  ) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id')!;
    this.event$ = this.backendApiService.getEventById(this.eventId);
  }

  navigateBackToEvent(): void {
    this.router.navigate(['/events', this.eventId]);
  }

  onFormSubmit(data: EventFormData): void {
    this.backendApiService.updateEventById({
      eventId: this.eventId,
      eventName: data.eventName,
      shortDescription: data.shortDescription,
      detailedDescription: data.detailedDescription,
      startDate: data.startDate,
      endDate: data.endDate,
    }).subscribe(() => {
      this.router.navigate(['/events', this.eventId]);
    });
  }
}
