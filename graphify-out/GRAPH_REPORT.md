# Graph Report - frontend  (2026-10-08)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 131 nodes · 267 edges · 10 communities (8 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2f44978a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- Signup.jsx
- Landing.jsx
- App.jsx
- Dashboard.jsx
- AuthContext.jsx
- dependencies
- .oxlintrc.json
- Toast.jsx
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `Signup()` - 15 edges
2. `useAuth()` - 15 edges
3. `react` - 13 edges
4. `react-router-dom` - 12 edges
5. `Button()` - 11 edges
6. `Dashboard()` - 10 edges
7. `Input()` - 9 edges
8. `Landing()` - 8 edges
9. `App()` - 8 edges
10. `Signin()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `Signup()`  [EXTRACTED]
  src/App.jsx → src/pages/Signup.jsx
- `Signup()` --calls--> `AuthLayout()`  [EXTRACTED]
  src/pages/Signup.jsx → src/components/AuthLayout.jsx
- `Signup()` --calls--> `Button()`  [EXTRACTED]
  src/pages/Signup.jsx → src/components/Button.jsx
- `Signup()` --calls--> `Input()`  [EXTRACTED]
  src/pages/Signup.jsx → src/components/Input.jsx
- `Signup()` --calls--> `useAuth()`  [EXTRACTED]
  src/pages/Signup.jsx → src/context/AuthContext.jsx

## Import Cycles
- None detected.

## Communities (10 total, 2 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.09
Nodes (22): devDependencies, oxlint, @types/react, @types/react-dom, vite, @vitejs/plugin-react, name, private (+14 more)

### Community 1 - "Signup.jsx"
Cohesion: 0.19
Nodes (11): react, register(), sendOtp(), verifyOtp(), OtpInput(), formatTime(), useCountdown(), getErrorMessage() (+3 more)

### Community 2 - "Landing.jsx"
Cohesion: 0.14
Nodes (15): AlertDemo(), OTHER_MAIL, WITH, WITHOUT, Faq(), FAQS, EXAMPLES, Guide() (+7 more)

### Community 3 - "App.jsx"
Cohesion: 0.24
Nodes (12): react-router-dom, googleAuthUrl, App(), AuthLayout(), HEIGHTS, ProtectedRoute(), SIZES, Spinner() (+4 more)

### Community 4 - "Dashboard.jsx"
Cohesion: 0.27
Nodes (11): addInterests(), INTEREST_MAX, INTEREST_MIN, Button(), styles, Input(), InterestChips(), Navbar() (+3 more)

### Community 5 - "AuthContext.jsx"
Cohesion: 0.24
Nodes (6): axios, react-dom, api, setAccessToken(), AuthContext, AuthProvider()

### Community 6 - "dependencies"
Cohesion: 0.29
Nodes (7): dependencies, axios, react, react-dom, react-router-dom, tailwindcss, @tailwindcss/vite

### Community 7 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

## Knowledge Gaps
- **45 isolated node(s):** `oxlint`, `@types/react`, `@types/react-dom`, `vite`, `@vitejs/plugin-react` (+40 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 55 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Signup.jsx` to `package.json`, `Landing.jsx`, `App.jsx`, `Dashboard.jsx`, `AuthContext.jsx`, `Toast.jsx`?**
  _High betweenness centrality (0.226) - this node is a cross-community bridge._
- **What connects `oxlint`, `@types/react`, `@types/react-dom` to the rest of the system?**
  _45 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09057971014492754 - nodes in this community are weakly interconnected._
- **Why does `react-router-dom` connect `App.jsx` to `package.json`, `Signup.jsx`, `Landing.jsx`, `Dashboard.jsx`, `AuthContext.jsx`?**
  _High betweenness centrality (0.196) - this node is a cross-community bridge._
- **Should `Landing.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14210526315789473 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._