# Test Credentials — Clifford Santos Portfolio

## Admin Console
- **URL:** `/admin`
- **Email:** `clifforddapogi@gmail.com`
- **Password:** `Clifford2026!`
- **Role:** admin

## Auth Endpoints
- POST `/api/auth/login`
- POST `/api/auth/logout`
- GET  `/api/auth/me`

## Public Endpoints
- GET  `/api/site`
- GET  `/api/projects`
- GET  `/api/experience`
- GET  `/api/education`
- GET  `/api/skills`
- POST `/api/contact`

## Admin Endpoints (require Bearer token or access_token cookie)
- PUT  `/api/admin/site`
- POST/PUT/DELETE `/api/admin/projects[/{id}]`
- POST/PUT/DELETE `/api/admin/experience[/{id}]`
- POST/PUT/DELETE `/api/admin/education[/{id}]`
- PUT  `/api/admin/skills`
- GET/DELETE/PUT-read `/api/admin/messages[/{id}]`
