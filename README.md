# Elite Choice Electromechanical — React Website

Full React + Tailwind CSS conversion of the ECEM website.

## Tech Stack
- React 18 (Create React App)
- Tailwind CSS v3
- React Router v6

## Pages
| Route        | Page                          |
|--------------|-------------------------------|
| `/`          | Home                          |
| `/about`     | About Us                      |
| `/services`  | Services (6 service sections) |
| `/projects`  | Projects (filterable by type) |
| `/clients`   | Clients + logo grid           |
| `/licenses`  | Licenses + image preview      |
| `/careers`   | Careers + application form    |
| `/contact`   | Contact form + info           |
| `/portal`    | Staff Portal (login → employee slip / admin panel) |

## Getting Started

```bash
npm install
npm start        # dev server → http://localhost:5173
npm run build    # production build → /build
```

## Assets
Copy your original assets into `public/`:
```
public/
  assets/
    videos/  construction.mp4
    images/  electrical.jpg  hvac.jpg  plumbing.jpg  ...
```

## Staff Portal Demo Credentials
| Role     | Username | Password  |
|----------|----------|-----------|
| Employee | john     | pass123   |
| Employee | ali      | pass123   |
| Employee | sara     | pass123   |
| Admin    | admin    | admin123  |

## Connect to Real Backend
Portal currently uses in-memory demo data.
To use the Node.js backend (`ecem-backend/`):
1. `cd ecem-backend && npm install && node server.js`
2. In `src/pages/Portal.jsx` replace demo ops with `fetch('/api/...')` calls.
