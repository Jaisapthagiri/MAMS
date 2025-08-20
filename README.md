# Military Asset Management System (MERN + Tailwind v4)

A secure, role-based logistics app for tracking **purchases, transfers, assignments, and expenditures** of critical assets across multiple bases.

- **Stack**: React (Vite) + Tailwind CSS v4, Node.js/Express, MongoDB (Mongoose), JWT RBAC
- **Key Features**:
  - Dashboard with **Opening Balance, Closing Balance, Net Movement, Assigned, Expended**
  - Filters by **Date range, Base, Equipment Type**
  - Detailed Net Movement modal (**Purchases / Transfers In / Transfers Out**)
  - CRUD APIs for **Purchases, Transfers, Assignments, Expenditures**
  - **Transfers between bases** with immutable history
  - **RBAC**: Admin (all), Base Commander (their base), Logistics Officer (purchases, transfers)
  - **API Logging** for auditing (method, path, user, request body, timestamp)
  - Secure RESTful APIs

---

## Quick Start

### 1) Server
```bash
cd server
cp .env.example .env
# Edit .env and add your MongoDB connection string + JWT secret
npm install
npm run dev
```
Server runs at `http://localhost:5000`.

### 2) Client
```bash
cd client
npm install
npm run dev
```
Client runs at `http://localhost:5173` (Vite default).

> Default seed users (run server once; seed runs automatically if DB is empty):
- **Admin**: `admin@mil.gov` / `Admin@123`
- **Commander (Base Alpha)**: `alpha.cmd@mil.gov` / `Alpha@123`
- **Logistics Officer (Base Alpha)**: `alpha.log@mil.gov` / `Alpha@123`

### Notes
- Tailwind v4 requires **no tailwind.config.js**. We use the `@tailwindcss/vite` plugin and `@import "tailwindcss"` in CSS.
- All API calls require Bearer JWT after login.
- The **logger** writes to `ApiLog` collection for audits.
- RBAC middleware enforces role permissions and (for Commanders) scoping to their base.

---

## API Overview (selected)

- `POST /api/auth/login` → `{email, password}` → `{token, role, baseId?}`
- `GET /api/dashboard?start=ISO&end=ISO&baseId=&equipmentTypeId=`
- Purchases: `POST /api/purchases`, `GET /api/purchases`
- Transfers: `POST /api/transfers`, `GET /api/transfers`
- Assignments: `POST /api/assignments`, `GET /api/assignments`
- Expenditures: `POST /api/expenditures`, `GET /api/expenditures`
- Reference: `GET /api/bases`, `GET /api/equipment-types`

See code comments for payload schemas.

---

## License
MIT
