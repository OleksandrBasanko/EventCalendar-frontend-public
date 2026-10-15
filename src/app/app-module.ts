import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UrlSerializer } from '@angular/router';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { EventsComponent } from './events/events.component';
import { CaseInsensitiveUrlSerializer } from './case-insensitive-url-serializer';

import { AuthInterceptor } from './interceptors/auth.interceptor';
import { CreateEventComponent } from './create-event/create-event.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { EditEventComponent } from './edit-event/edit-event.component';
import { EventFormComponent } from './event-form/event-form.component';

@NgModule({
  declarations: [
    App,
    LoginComponent,
    RegisterComponent,
    EventsComponent,
    CreateEventComponent,
    EventDetailsComponent,
    EditEventComponent,
    EventFormComponent,
  ],
  imports: [CommonModule, FormsModule, BrowserModule, AppRoutingModule],
  providers: [
    { provide: UrlSerializer, useClass: CaseInsensitiveUrlSerializer },
    provideBrowserGlobalErrorListeners(),

    // Вмикаємо підтримку Class-based інтерцепторів для provideHttpClient
    provideHttpClient(withInterceptorsFromDi()),

    // Реєструємо сам AuthInterceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true, // дозволяє використовувати кілька інтерцепторів у системі
    },
  ],
  bootstrap: [App],
})
export class AppModule {}
