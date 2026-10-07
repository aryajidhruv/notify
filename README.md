# created vite.config.js
-  using proxy - because when our frontend call direactly the api on different server - browser decline the request beacause of CORS .
- proxy work as a middlleman - to avoid cors.

- [React App] ──(fetch /api/login)──> [Vite Dev Server (localhost)] ──(Forward)──> [Real Backend (fastapicloud.dev)]

# client.js
- Where we are
- Every page in the app (signup, signin, dashboard) needs to talk to the backend. If each page wrote its own request code, we'd repeat the same things everywhere: the base URL, the login token, and what to do when the token expires. So we build one shared axios instance that does this for everything.

- when auth.js calls the api so the client.js work as a --  "samrt security guard or auto fixer" -- before sending request to vite.cofing.js  and after getting the response.


- [ Browser / Frontend ]                              [ Backend Server ]
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
         
- Access token - sending with the every api call to the backend for proof
- Refresh Token - after access token expires 
- 1. Login/Signup   ──>   2. Normal API Call   ──>   3. Token Expire (401 Error)   ──>   4. Auto Refresh & Retry



# auth.js

- why - we using this to avoid the messy code in login or singup  

- what - its woking as a bridge between the frontend and backend 

- [React UI Component] ──(1) Calls getMe() / signin()──> [authService.js]
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


                                            
# Authcontext.jsx
- why
- global state management - using context api - to avoid prop drilling .
- auto-login session .

- what 
- state variables - user data .
- gloabal auth action - sign in the user and save the access token

- [ App Launch / Refresh ]
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


# ProtectedRoute.jsx
- why 
 - Unauthorized Access Protection:  to avoid the accessing the - localhost:5173/dashboard .
 - Smooth User Experience (UX).
 - Prevent Page Flickering.

- what 
 - Unauthenticated User - if the user is null it will show the  sign in page.
 


- [ User visits /dashboard ]
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

# Button.jsx 
- why 
 - DRY Principle (Don't Repeat Yourself)
 - Built-in Loading State 
 - Consistent UI/Design System

# Input.jsx 
- why
 - DRY & Reusability
 - Built-in Accessibility
 - Dynamic Error Styling

# otpinput.jsx 
- why 
 - Great User Experience (UX).
 - Auto Focus Navigation.
 - Copy-Paste & Mobile Auto-Fill Support.

# useCountdown.js
- why 
 - OTP Resend Cooldown
 - No Clock Drift (Accuracy)

# interest.js 
- why 
 - Web Scraper & Notice Tracker Feature
 

# Signup.jsx
 - why 
  - Structured Multi-Step Form
  - Security & Validation
  - Seamless UX (Auto-Login)
  - [ Step 1: Email Input ] ──(requestOtp)──► [ Step 2: OTP Input (60s timer) ]
                                                        │
                                                 (verifyOtp)
                                                        │
                                                        ▼
[ Redirect to /dashboard ] ◄──(login)─── [ Step 3: Password & Confirm ]
- update the google signup 


# signinjsx 
- why 
 - User Authentication Interface
 - Smart Post-Login Redirection : if user tap on private link it will go to signin page
 - Already-Authenticated Check : if user is already logged in - going on private url - then it will bypass it to dashbaored

- what 
 - Error Formatter (getErrorMessage) : backend error 
 [ 401 -> "Incorrect email or password."429 -> "Too many attempts. Please wait a bit and try again."422/400 -> Detail array ya error string parsing.]

- [ User Action: Click Signin ]
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

# App.jsx
 - why 
  - Centralized Client-Side Routing
  -  Explicitly separate pages
  - Fallback Page (404 Handling)

 - [ main.jsx / index.js ]
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

# Main.jsx 
- why 
 - DOM Mounting
 - it will wrap react router and authentication context at the top leverl to access(Landing, Signin, Signup, Dashboard, etc)

 - what  
  - strictmode - detect bugs
  - BrowserRouter - url navigation
  - AuthProvider
  - [ StrictMode ]
     └── [ BrowserRouter ]
              └── [ AuthProvider ]
                       └── [ App ]


# spinner.jsx
- why 
 - Consistent Loading Indicator
 - Flexible Sizes
 - Full-Screen Layout Built-in

 # Navbar.jsx 
 - why 
  - Global Site Navigation
  - Context-Aware Logo Linking
  - Session Termination (Logout)

# interestedChips.jsx
- why 
 - Multi-Item Input UI
 - Real-Time Validation
 - Form Submissions Protection

# dashboared.jsx
 - why 
  - Strict URL Validation
  - Asynchronous Task Confirmation
- what 
 - Checks if sourceUrl is valid.

Ensures interests array is not empty (interests.length > 0).


# Landing.jsx
 - why 
  - First Impression & Onboarding:
  - Layout Shift Prevention
  - Smart Session Awareness:

# notfound.jsx
 - why 
  - Graceful Error Handling
  - Context-Aware Recovery (Smart Redirection)
  - Catch-All Route Integration
  - [ User enters invalid URL e.g. /unknown ]
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


# Toast.jsx
 - why 
  - Global Non-Blocking Feedback - ("Source added successfully" ya "Connection failed")
  - Auto-Dismiss & Clean Memory
  - App-Wide Custom Hook




# updates 
 - user credetials page after successfull signup


# working 
 - otp singup 
 - signin