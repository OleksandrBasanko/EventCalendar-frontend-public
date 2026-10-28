# EventsCalendar Frontend

**EventsCalendar Frontend** is the client side of the event calendar web service, built with **Angular 21**. The application integrates with the backend (ASP.NET Core Web API) via a REST API and provides full user interaction with the system using JWT authentication.

---

## Features

* **Interactive Calendar** — convenient month navigation, day selection, and visual highlighting of days with events (dot indicators: up to 3 dots, then a numeric indicator / `+` sign).
* **Daily Event View** — a list of events for the selected date with short descriptions and a subscription status indicator (`✓` / `✗`).
* **Authentication** — user registration and login with secure storage of the JWT token in `localStorage`.
* **Role Model** — access rights are read directly from the token; the event creation panel is available only to users with the administrator role (`admin`).
* **Event Management** — creating and editing events through a universal form component.
* **URL State Persistence** — query parameters (`year`, `month`, `day`) are automatically synchronized with the address bar without reloading the page, which makes it easy to share links or refresh the page without losing context.

---

## Tech Stack

* **Framework:** Angular `^21.2.0` (NgModule approach, `standalone=false`)
* **Language:** TypeScript `~5.9.2`
* **Styling:** CSS
* **Reactive Programming:** RxJS `~7.8.0`
* **JWT Handling:** `jwt-decode` `^4.0.0`
* **Testing:** Vitest `^4.0.8`, JSDOM `^28.0.0`
* **Build & Development:** Angular CLI / `@angular/build` `^21.2.12`
* **Formatting:** Prettier `^3.8.1`
* **Package Manager:** npm `11.13.0`

---

## Project Structure

```text
src/app/
├── auth/                      → Authentication: login / register components and auth.models
├── events/                    → Main page: interactive calendar and the list of events for the selected day
├── event-details/             → Detailed event view page
├── create-event/              → New event creation page
├── edit-event/                → Event editing page
├── event-form/                → Shared form for creating and editing events
├── interceptors/              → HTTP interceptors (AuthInterceptor)
├── models/                    → Typed DTO models for backend requests and responses
├── services/                  → Business services (AuthService, BackendApiService)
├── case-insensitive-url-serializer.ts → Case-insensitive URL handler
├── app-routing-module.ts      → Routing module
├── app-module.ts              → Root application module (AppModule)
└── app.ts                     → Root component
proxy.conf.json                → Proxy configuration for development (/api → backend)
```

---

## Architectural Decisions and Strategies

| Decision | Description |
|---|---|
| **Modular Architecture (`standalone=false`)** | The application is built on the classic NgModule architecture. All components are explicitly declared in `AppModule` (`declarations`), while external dependencies and services are connected via the `imports` and `providers` configurations. |
| **Automatic Request Interception (`AuthInterceptor`)** | A class-based HTTP interceptor (`HttpInterceptor`) automatically intercepts outgoing requests, adds the `Authorization: Bearer <token>` header when a token is present in storage, and passes public requests (login, registration) through unchanged. |
| **Reactive Session Management (RxJS `BehaviorSubject` and `jwt-decode`)** | The token is stored in `localStorage`, and its payload is parsed using `jwt-decode`.<br><br>The authorization state and role are managed via `BehaviorSubject`, which guarantees instant delivery of the current state to new subscribers. The streams are exposed as read-only `Observable`s (`isLoggedIn$`, `role$`). |
| **Asynchronous Data Streams (`Observable` + `async`)** | Data from the backend is streamed as `Observable<T>` (for example, `Observable<EventDto[]>` for the events of a month), and templates handle it with the `async` pipe. This completely removes the need for manual subscription and unsubscription (`subscribe` / `unsubscribe`). |
| **Declarative Template Syntax** | Uses the modern built-in control flow (`@if`, `@else`, `@for` with the `track` expression) instead of the legacy structural directives. |
| **Component Encapsulation and Reuse** | The form logic is extracted into a single independent component (`EventFormComponent`), with `@Input` for incoming data and `@Output` for the form submission event. |
| **Browser State Sync Without Interrupting the Lifecycle** | The `syncUrl()` method updates the query string parameters via `Location.replaceState()`, which updates the URL bypassing the Angular Router, without calling `ngOnInit` again or recreating the component. |
| **Request Proxying for the Development Environment** | Using `proxy.conf.json` eliminates CORS issues and allows relative paths (`/api/...`) during development. |

---

## Prerequisites and Setup

Before you start, make sure the following is installed on your computer:

* **Node.js** (a version compatible with npm `11.13.0`)
* **Angular CLI** `21.2.x`:

  ```bash
  npm install -g @angular/cli
  ```

* A running **EventsCalendar API** backend service at `http://localhost:5162`.

### Installing Dependencies and Running

```bash
# Install packages
npm install

# Run in development mode
npm start
```

The application will be available at `http://localhost:4200/`. If the proxy configuration was not picked up automatically, use the following command:

```bash
ng serve --proxy-config proxy.conf.json
```
