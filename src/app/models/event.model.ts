export interface EventDto {
  id: string;
  eventName: string;
  shortDescription: string;
  detailedDescription: string;
  startDate: string;
  endDate: string;
  ownerId: string;
  isSubscribed: boolean;
}

export interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  events: EventDto[];
}
