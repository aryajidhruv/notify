# Notify (Frontend)

Notify lets people add a web page (a notice board, announcements page, and so on) and describe in plain English what they are waiting for. When something on the page matches, they get an email.

This repo is the React frontend. The backend is a separate FastAPI service.

## Contents

- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Notes on each file](#notes-on-each-file)
  - [1. Foundation: proxy and API layer](#1-foundation-proxy-and-api-layer)
  - [2. Auth state and routing](#2-auth-state-and-routing)
  - [3. Reusable components](#3-reusable-components)
  - [4. Pages](#4-pages)
- [Status](#status)

---

## Tech stack

- React with Vite
- Tailwind CSS v4
- React Router
- Axios
- Backend: FastAPI (`https://notifyme.fastapicloud.dev`, base path `/api/v1`)

## Getting started

```bash
npm install
npm run dev
```

Create a `.env` file next to `package.json`:

```
VITE_API_URL=/api/v1
```

Restart `npm run dev` after any change to `.env` or `vite.config.js`. Vite only reads them at startup.

## Project structure

```text
.
├── vite.config.js            proxy: /api -> backend
├── .env                      VITE_API_URL=/api/v1
└── src
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── api
    │   ├── client.js         shared axios instance
    │   ├── auth.js           signin, signup, refresh, logout
    │   └── interests.js      add interests
    ├── context
    │   └── AuthContext.jsx
    ├── hooks
    │   └── useCountdown.js
    ├── components
    │   ├── ProtectedRoute.jsx
    │   ├── Button.jsx
    │   ├── Input.jsx
    │   ├── OtpInput.jsx
    │   ├── Spinner.jsx
    │   ├── Navbar.jsx
    │   ├── InterestChips.jsx
    │   ├── Toast.jsx
    │   ├── AuthLayout.jsx
    │   ├── Hero.jsx
    │   ├── AlertDemo.jsx
    │   ├── Guide.jsx
    │   └── Faq.jsx
    └── pages
        ├── Landing.jsx
        ├── Signup.jsx
        ├── Signin.jsx
        ├── Dashboard.jsx
        └── NotFound.jsx
```

---

## Notes on each file

## 1. Foundation: proxy and API layer

### created vite.config.js

- using proxy - because when our frontend call direactly the api on different server - browser decline the request beacause of CORS .
- proxy work as a middlleman - to avoid cors.

```text
[React App] ──(fetch /api/login)──> [Vite Dev Server (localhost)] ──(Forward)──> [Real Backend (fastapicloud.dev)]
```

### client.js

- Where we are
- Every page in the app (signup, signin, dashboard) needs to talk to the backend. If each page wrote its own request code, we'd repeat the same things everywhere: the base URL, the login token, and what to do when the token expires. So we build one shared axios instance that does this for everything.
- when auth.js calls the api so the client.js work as a --  "samrt security guard or auto fixer" -- before sending request to vite.cofing.js  and after getting the response.

```text
[ Browser / Frontend ]                              [ Backend Server ]
         │                                                  │
         │─── 1. Login (Email + Password) ─────────────────>│
         │                                                  │
         │<── 2. Returns Access Token (JSON) ───────────────│
         │    + Sets Refresh Token (HTTP-Only Cookie)      │
         │                                                  │
         │   (15 Minutes Pass... Access Token Expires)      │
         │                                                  │
         │─── 3. Get Data (/usr/me + Expired Access Token)─>│
         │<── 4. Error 401 Unauthorized ────────────────────│
         │                                                  │
         │─── 5. Auto Call (/auth/refresh + Cookie) ───────>│
         │<── 6. Returns New Access Token ──────────────────│
         │                                                  │
         │─── 7. Retry Get Data (/usr/me + New Token) ─────>│
         │<── 8. Success 200 OK (User Data) ────────────────│
```

- Access token - sending with the every api call to the backend for proof
- Refresh Token - after access token expires

```text
1. Login/Signup   ──>   2. Normal API Call   ──>   3. Token Expire (401 Error)   ──>   4. Auto Refresh & Retry




```



### auth.js

- why - we using this to avoid the messy code in login or singup
- what - its woking as a bridge between the frontend and backend

```text
[React UI Component] ──(1) Calls getMe() / signin()──> [authService.js]
                                                              │
                                                     (2) Runs api.get() / api.post()
                                                              │
                                                              ▼
                                                        [client.js]
                                                              │
                                                 (3) Attaches Bearer Token & Cookies
                                                              │
                                                              ▼
                                                      [Backend Server]
```

### interest.js

- why
  - Web Scraper & Notice Tracker Feature

---

## 2. Auth state and routing

### Authcontext.jsx

- why
  - global state management - using context api - to avoid prop drilling .
  - auto-login session .
- what
  - state variables - user data .
  - gloabal auth action - sign in the user and save the access token

```text
[ App Launch / Refresh ]
           │
           ▼
[ AuthProvider useEffect ] ──> Calls authApi.refresh()
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
          (Session Valid)                               (Session Expired)
                 │                                               │
  1. setAccessToken(token)                                1. setUser(null)
  2. setUser(getMe())                                     2. setLoading(false)
  3. setLoading(false)                                           │
                 │                                               ▼
                 ▼                                      [ Protected Routes ]
        [ Render React App ] ───(useAuth Hook)───>     (Redirect to /login)
```

### ProtectedRoute.jsx

- why
  - Unauthorized Access Protection:  to avoid the accessing the - localhost:5173/dashboard .
  - Smooth User Experience (UX).
  - Prevent Page Flickering.
- what
  - Unauthenticated User - if the user is null it will show the  sign in page.

```text
[ User visits /dashboard ]
           │
           ▼
   [ ProtectedRoute ] ───(is loading true?)───► [ Render "Loading..." ]
           │
  (loading = false)
           │
 ┌─────────┴─────────┐
 ▼                   ▼
[ user exists ]    [ user is null ]
 │                   │
 ▼                   ▼
[ Render Dashboard ] [ Redirect to /signin with state: { from: /dashboard } ]
```

### App.jsx

- why
  - Centralized Client-Side Routing
  - Explicitly separate pages
  - Fallback Page (404 Handling)

```text
[ main.jsx / index.js ]
                                     │
                                     ▼
                            [ AuthProvider ]  (AuthContext.jsx)
                                     │
                                     ▼
                             [ BrowserRouter ]
                                     │
                                     ▼
                                [ App.jsx ]
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
  [ Public Pages ]          [ ProtectedRoute ]            [ 404 Page ]
(/, /signin, /signup)                │                     (NotFound.jsx)
                                     ▼
                              [ Dashboard ]
                                     │
                                     ▼
                          [ authService / interests ]
                                     │
                                     ▼
                            [ client.js (Axios) ]
                                     │
                                     ▼
                           [ vite.config.js Proxy ]
                                     │
                                     ▼
                             [ Backend Server ]
```

### Main.jsx

- why
  - DOM Mounting
  - it will wrap react router and authentication context at the top leverl to access(Landing, Signin, Signup, Dashboard, etc)
- what
  - strictmode - detect bugs
  - BrowserRouter - url navigation
  - AuthProvider

```text
[ StrictMode ]
     └── [ BrowserRouter ]
              └── [ AuthProvider ]
                       └── [ App ]
```

---

## 3. Reusable components

### Button.jsx

- why
  - DRY Principle (Don't Repeat Yourself)
  - Built-in Loading State
  - Consistent UI/Design System

### Input.jsx

- why
  - DRY & Reusability
  - Built-in Accessibility
  - Dynamic Error Styling

### otpinput.jsx

- why
  - Great User Experience (UX).
  - Auto Focus Navigation.
  - Copy-Paste & Mobile Auto-Fill Support.

- updates
  - otp box error solved
### useCountdown.js

- why
  - OTP Resend Cooldown
  - No Clock Drift (Accuracy)

### spinner.jsx

- why
  - Consistent Loading Indicator
  - Flexible Sizes
  - Full-Screen Layout Built-in

### Navbar.jsx

- why
  - Global Site Navigation
  - Context-Aware Logo Linking
  - Session Termination (Logout)

### interestedChips.jsx

- why
  - Multi-Item Input UI
  - Real-Time Validation
  - Form Submissions Protection

### Toast.jsx

- why
  - Global Non-Blocking Feedback - ("Source added successfully" ya "Connection failed")
  - Auto-Dismiss & Clean Memory
  - App-Wide Custom Hook

### Landing page components

The landing page is split into small components, and `Landing.jsx` puts them together.

- Hero.jsx - dark hero with the animated columns, title and main call to action
- AlertDemo.jsx - example of what you add and the email you get, plus the before/after comparison
- Guide.jsx - "How it works" steps and example interests
- Faq.jsx - questions and the final call to action

### AuthLayout.jsx

- why
  - Shared dark background (the same columns as the landing hero) for the signup and signin pages

---

## 4. Pages

### Signup.jsx

- why
  - Structured Multi-Step Form
  - Security & Validation
  - Seamless UX (Auto-Login)

```text
[ Step 1: Email Input ] ──(requestOtp)──► [ Step 2: OTP Input (60s timer) ]
                                                        │
                                                 (verifyOtp)
                                                        │
                                                        ▼
[ Redirect to /dashboard ] ◄──(login)─── [ Step 3: Password & Confirm ]
```

- update the google signup


### signinjsx

- why
  - User Authentication Interface
  - Smart Post-Login Redirection : if user tap on private link it will go to signin page
  - Already-Authenticated Check : if user is already logged in - going on private url - then it will bypass it to dashbaored
- what
  - Error Formatter (getErrorMessage) : backend error
    - 401 -> "Incorrect email or password."
    - 429 -> "Too many attempts. Please wait a bit and try again."
    - 422/400 -> Detail array ya error string parsing.

```text
[ User Action: Click Signin ]
              │
              ▼
    [ handleSubmit() ]
              │
              ▼
   [ AuthContext.login() ] ───► Calls authService.signin()
              │
              ▼
     [ client.js Axios ] ───► Memory mein setAccessToken()
              │
              ▼
 [ navigate(redirectTo) ] ───► Lands on /dashboard or saved route
```

### dashboared.jsx

- why
  - Strict URL Validation
  - Asynchronous Task Confirmation
- what
  - Checks if sourceUrl is valid.
  - Ensures interests array is not empty (interests.length > 0).

### Landing.jsx

- why
  - First Impression & Onboarding:
  - Layout Shift Prevention
  - Smart Session Awareness:

### notfound.jsx

- why
  - Graceful Error Handling
  - Context-Aware Recovery (Smart Redirection)
  - Catch-All Route Integration

```text
[ User enters invalid URL e.g. /unknown ]
                   │
                   ▼
       [ App.jsx Route Match ]
                   │
                   ▼
      [ Wildcard Route: path="*" ]
                   │
                   ▼
           [ NotFound.jsx ]
                   │
      ┌────────────┴────────────┐
      ▼                         ▼
(If logged in)           (If logged out)
      │                         │
      ▼                         ▼
[ Back to dashboard ]    [ Back to home ]
  (/dashboard)                  (/)
```

---

## Updates log

### 2026-10-08

Setup fixes

- `.env` was empty, so requests went to `/auth/refresh` instead of `/api/v1/auth/refresh` and Vite answered 404. Fixed with `VITE_API_URL=/api/v1` (restart `npm run dev` after editing `.env`).
- Installed `react-router-dom`, which `main.jsx` needed.
- Backend paths checked against `/docs`: `usr` (not `user`) routes, and `logout` is a `GET`.

Landing page

- Landing split into small components: `Hero.jsx`, `AlertDemo.jsx`, `Guide.jsx`, `Faq.jsx`. `Landing.jsx` only puts them together.
- New dark hero (stepped columns that rise on load, title, subtitle, call to action) based on the reference designs.
- Removed the fake testimonials, stock photos and the "1,000+ users" badge.
- Copy changed from college notices to any public page, for anyone in any country.
- Email mock is now an inbox view: the new Notify email on top, older mails blurred, with the opened message below.
- FAQ answers and the contact email still have `TODO` markers to fill in.

Navbar

- `Navbar.jsx` now takes a `variant` prop (`light` or `dark`) and a `links` prop for section links.
- Sticky header with a blur, section links (How it works, Examples, FAQ), and Sign in / Get started for logged-out visitors.

Auth pages

- New `AuthLayout.jsx` (same columns and glow as the hero) used by `Signup.jsx` and `Signin.jsx`.
- Both pages use a see-through glass card and white pill buttons; the logic is unchanged.
- Signup has a progress bar and a heading for each step.
- Added `type="button"` to the Google and Resend buttons so they never submit the form.
- "Continue with Google" is wired on both pages. It does a full-page redirect to `/auth/google`.

Still needed for Google sign-in

- The backend callback must create the user if new, set the refresh cookie (same name `/auth/refresh` reads), and redirect to the frontend instead of returning JSON.
- Add the redirect URI `http://localhost:5173/api/v1/auth/google/callback` in the Google Cloud console for development.

## Status

### working

- otp singup
- signin

### updates

- user credetials page after successfull signup
- add this url - auth/callback - refresh token from coockie -> access token -> redirect to dashboared


- AuthCallback.jsx
 - [ User clicks "Continue with Google" ]
                  │
                  ▼
   [ Redirects to Google Consent ]
                  │
                  ▼
[ FastApi Backend: Sets HTTP-Only Refresh Cookie ]
                  │
                  ▼
[ Browser redirected to /auth/callback (AuthCallback.jsx) ]
                  │
                  ▼
 [ AuthProvider fires silent refresh /auth/refresh ]
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
    (Success)           (Failure)
        │                   │
        ▼                   ▼
 Navigate to        Navigate to /signin
 /dashboard        with state.error message