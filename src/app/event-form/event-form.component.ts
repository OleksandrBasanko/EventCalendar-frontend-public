import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface EventFormData {
  eventName: string;
  shortDescription: string;
  detailedDescription: string;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-event-form',
  standalone: false,
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css',
})
export class EventFormComponent implements OnInit {
  @Input() buttonText: string = 'Submit';

  @Input() currentEventName = '';
  @Input() currentShortDescription = '';
  @Input() currentDetailedDescription = '';
  @Input() currentStartDate = '';
  @Input() currentEndDate = '';

  @Output() formSubmit = new EventEmitter<EventFormData>();

  eventName: string = '';
  shortDescription: string = '';
  detailedDescription: string = '';
  startDate: string = '';
  endDate: string = '';

  ngOnInit(): void {
    this.eventName = this.currentEventName;
    this.shortDescription = this.currentShortDescription;
    this.detailedDescription = this.currentDetailedDescription;

    if (this.currentStartDate) {
      const start = new Date(this.currentStartDate);
      this.startDate = `${start.toISOString().slice(0, 10)} ${start.toISOString().slice(11, 16)}`;
    }

    if (this.currentEndDate) {
      const end = new Date(this.currentEndDate);
      this.endDate = `${end.toISOString().slice(0, 10)} ${end.toISOString().slice(11, 16)}`;
    }
  }

  private formatDate(dateStr: string): string {
    return new Date(dateStr).toISOString().slice(0, 19);
  }

  onButtonClicked(): void {
    this.formSubmit.emit({
      eventName: this.eventName,
      shortDescription: this.shortDescription,
      detailedDescription: this.detailedDescription,
      startDate: this.formatDate(this.startDate),
      endDate: this.formatDate(this.endDate),
    });
  }
}
