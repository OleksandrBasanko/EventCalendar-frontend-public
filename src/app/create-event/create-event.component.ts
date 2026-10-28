import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendApiService } from '../services/backend-api.service';
import { EventFormData } from '../event-form/event-form.component';

@Component({
  selector: 'app-create-event',
  standalone: false,
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css',
})
export class CreateEventComponent {
  constructor(
    private backendApiService: BackendApiService,
    private router: Router
  ) {}

  navigateBackToEvents(): void {
    this.router.navigate(['/events']);
  }

  onFormSubmit(data: EventFormData): void {
    this.backendApiService.createEvent({
      eventName: data.eventName,
      shortDescription: data.shortDescription,
      detailedDescription: data.detailedDescription,
      startDate: data.startDate,
      endDate: data.endDate,
    }).subscribe((id) => {
      this.router.navigate(['/events', id]);
    });
  }
}
