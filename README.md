# User Management Dashboard

A production-ready User Management Dashboard built with React (Create React App), Material UI, and Axios. Supports full CRUD operations against the JSONPlaceholder REST API with optimistic UI updates.

---

## Features

- **User List** — Material UI Table with sortable columns (First Name, Last Name, Email, Department), avatar initials, and department color chips
- **Add User** — Dialog with full form validation; POST to API + immediate UI update
- **Edit User** — Pre-filled dialog; PUT to API + optimistic update
- **Delete User** — Confirmation dialog; DELETE to API + immediate removal
- **Global Search** — 300ms debounced search across name, email, and department
- **Advanced Filter** — Popup with per-field filters and Apply/Reset buttons
- **Sort** — Ascending/descending on sortable columns
- **Pagination** — 10 / 25 / 50 / 100 rows per page
- **Loading Skeleton** — Skeleton rows while data loads
- **Empty State** — Illustrated empty state for no results
- **Snackbar Notifications** — Success, error, and info feedback for every action
- **Dark Mode Toggle** — Full dark/light theme via MUI ThemeProvider
- **Responsive** — Mobile card view, tablet/desktop table view; no horizontal scroll
- **Department Stats** — Live count cards per department at the top of the dashboard
- **Error Handling** — Alert banner with retry button on API failure

---

## Folder Structure

```
user-management-dashboard/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── api/
│   │   └── axios.js            # Axios instance with interceptors
│   ├── components/
│   │   ├── DeleteDialog.jsx    # Delete confirmation dialog
│   │   ├── FilterDialog.jsx    # Advanced filter popup
│   │   ├── Loading.jsx         # Centered spinner
│   │   ├── SearchBar.jsx       # Debounced search input
│   │   ├── SnackbarAlert.jsx   # Slide-up snackbar
│   │   ├── UserForm.jsx        # Add/Edit dialog with validation
│   │   └── UserTable.jsx       # Table + skeleton + pagination + empty state
│   ├── pages/
│   │   └── Dashboard.jsx       # Main page; all state & orchestration
│   ├── services/
│   │   └── userService.js      # API calls (fetch, create, update, delete)
│   ├── utils/
│   │   ├── helpers.js          # Department map, name split, debounce, etc.
│   │   └── validation.js       # Form validation rules
│   ├── App.js                  # Theme provider + dark mode
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

---

## Installation & Running

```bash
# 1. Clone or unzip the project
cd user-management-dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app opens at `http://localhost:3000`.

---

## API Details

**Base URL:** `https://jsonplaceholder.typicode.com`

| Method | Endpoint       | Purpose        |
|--------|----------------|----------------|
| GET    | /users         | Fetch all users |
| POST   | /users         | Create a user  |
| PUT    | /users/:id     | Update a user  |
| DELETE | /users/:id     | Delete a user  |

JSONPlaceholder does **not** persist data. All CRUD operations use optimistic UI updates — the UI reflects changes immediately without waiting for server confirmation.

---

## Assumptions

1. The `Department` field is assigned locally from `['HR', 'IT', 'Finance', 'Marketing', 'Sales', 'Support']` using `(id - 1) % 6` so every user always has the same deterministic department.
2. JSONPlaceholder returns `id: 11` for every POST. A `Date.now()` temp ID is used as a fallback to avoid collisions.
3. The API mock always succeeds for write operations; the error path is exercised by network failure or timeout.
4. Names from the API (`name: "Leanne Graham"`) are split on the first space into `firstName` and `lastName`.

---

## Challenges

- **Optimistic UI with JSONPlaceholder:** Because the API doesn't save state, all mutations are applied locally after the API call succeeds, rather than re-fetching.
- **Responsive table:** Mobile devices get a card-based layout to avoid horizontal scrolling; the full table is shown on ≥600 px screens.
- **Debounce without external library:** A hand-rolled `debounce` util is used to avoid adding `lodash` as a dependency.

---

## Future Improvements

- Add React Query or SWR for caching and background refetch
- Add unit tests (React Testing Library + Jest)
- Add bulk-select and bulk-delete
- Export to CSV / Excel
- Add role-based access control (admin vs. viewer)
- Replace JSONPlaceholder with a real backend (Node/Express + PostgreSQL)
- Add virtualized table (react-window) for very large datasets
