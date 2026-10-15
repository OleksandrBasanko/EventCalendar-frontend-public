export enum EventRole {
  EventOwner = 0,
  EventSubscriber = 1,
}

export interface EventSubscriberDto {
  userId: string;
  userName: string;
  firstName: string;
  secondName: string;
  eventId: string;
  eventRole: EventRole;
}
