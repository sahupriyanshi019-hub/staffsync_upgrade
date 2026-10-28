# StaffSync - HR Management (MERN)

Roles: HR, Manager, Employee (JWT auth + role based access).

## Setup

### 1. Backend
```
cd backend
npm install
npm run dev      # http://localhost:5000
# .env me MONGO_URI khali hai -> embedded MongoDB chalega (MongoDB install nahi chahiye)
# demo users pehli baar apne aap ban jate hain; data backend/data/db me save hota hai
```

### 2. Frontend
```
cd frontend
npm install
npm run dev      # http://localhost:3000
```

## Deployment
Production me embedded DB use mat karo. MongoDB Atlas ka URI `MONGO_URI` env variable me daalo,
`NODE_ENV=production` aur `JWT_SECRET` set karo, phir ek baar `npm run seed` chalao (demo users ke liye).
Frontend deploy ke liye `npm run build` aur API proxy/URL ko backend ke URL pe point karo.

## Demo logins
| Role | Email | Password |
|------|-------|----------|
| HR | hr@staffsync.com | hr1234 |
| Manager | manager@staffsync.com | manager1234 |
| Employee | employee@staffsync.com | employee1234 |

## API summary
- POST /api/auth/login, GET /api/auth/me, PUT /api/auth/profile, PUT /api/auth/change-password
- /api/users (HR CRUD; manager sees own team)
- /api/leaves (apply, my, list, PUT /:id/review)
- /api/attendance (check-in, check-out, my, HR list)
- /api/announcements (all read, HR post/delete)
- /api/trainings (manager/HR CRUD, employee sees assigned)
