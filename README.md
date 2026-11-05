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
---

## Getting Started with Docker
 
This section describes how to download and run the EventCalendar project locally using Docker.
 
### Required Tools
 
- WSL (Windows Subsystem for Linux) with Ubuntu installed
- Docker (available inside WSL)
- pgAdmin 4 (to create the PostgreSQL server)
### 1. Create the PostgreSQL Server
 
On your machine, create a PostgreSQL server (you can use pgAdmin 4 for this) with the following parameters:
 
| Tab | Parameter | Value |
|---|---|---|
| General | Name | `Event-Calendar` |
| Connection | Host name / address | `localhost` |
| Connection | Port | `5002` |
| Connection | Username | `admin` |
| Connection | Password | `adminpass` |
 
### 2. Prepare the Project Folders

Link to the backend repository: <https://github.com/OleksandrBasanko/EventCalendar-backend-public>
 
1. Create an empty folder on your disk and name it `EventCalendar`.
2. Inside this folder, create two more empty folders: `event-calendar-frontend` and `event-calendar-backend`.
3. Download the files from each repository into the corresponding folder:
   - `EventCalendar-backend-public` → `event-calendar-backend`
   - `EventCalendar-frontend-public` → `event-calendar-frontend`
4. Move the `docker-compose.yaml` file from the `event-calendar-backend` folder into the project root folder (`EventCalendar`).
The resulting structure should look like this:
 
```
EventCalendar/
├── docker-compose.yaml
├── event-calendar-backend/
└── event-calendar-frontend/
```
 
### 3. Build the Docker Images
 
Open the WSL console and navigate to the project root folder:
 
```bash
cd /mnt/{full path to the folder}
```
 
Example:
 
```bash
cd /mnt/d/EventCalendar/
```
 
Go into the `event-calendar-backend` folder and build the backend image:
 
```bash
cd event-calendar-backend
sudo docker build -t event-calendar-backend .
```
 
Go back to the root folder, then go into the `event-calendar-frontend` folder and build the frontend image:
 
```bash
cd ..
cd event-calendar-frontend
sudo docker build -t event-calendar-frontend .
```
 
### 4. Run the Project
 
Return to the project root folder and start the containers:
 
```bash
cd ..
sudo docker compose up -d
```
 
If everything was done correctly, you should see the following output:
 
```
 ✔ Container event_calendar_postgres Running
 ✔ Container event_calendar_api      Running
 ✔ Container event_calendar_ui       Running
```
 
You can now view the project in your browser at: <http://localhost:5005/>
 
---
 
## Seeding Test Data
 
To populate the website with test data, first **register** an account on the site, then run the following commands in order.
 
> **Note:** In the commands below, replace `your@email.com` with the email address you used during registration.
 
### 1. Make Your User an Admin
 
```bash
sudo docker compose exec -T postgres psql -U admin -d Event_Calendar -v email="your@email.com" < event-calendar-backend/scripts/make_admin.sql
```

After running this script, you need to **log in again** for the admin role to take effect. To do this, go to <http://localhost:5005/login>.
 
### 2. Create Test Users
 
```bash
bash event-calendar-backend/scripts/seed_users.sh
```
 
### 3. Create Events
 
```bash
sudo docker compose exec -T postgres psql -U admin -d Event_Calendar -v email="your@email.com" < event-calendar-backend/scripts/seed_events.sql
```
 
### 4. Subscribe Test Users to Events
 
```bash
sudo docker compose exec -T postgres psql -U admin -d Event_Calendar < event-calendar-backend/scripts/subscribe_users.sql
```
 
That's it — everything is ready!
 
### Testing as a Regular User
 
To test the website as a regular user rather than an admin, you can log in as one of the previously created test users. Go to <http://localhost:5005/login> and use one of the following accounts:
 
| Email | Password |
|---|---|
| `anna@test.com` | `Test123!` |
| `ivan@test.com` | `Test123!` |
| `olena@test.com` | `Test123!` |

---
 
## Stopping the Project
 
To end the session, use the following command:
 
```bash
sudo docker compose down
```
