# Full Stack Authentication App

A Full stack application demonstrating user authentication and authorization. Users can sign up, sign in, and access protected resources. The application uses **HTTP-only cookies for authentication**, implements **single session per account**, and enforces **role-based authorization** via custom guards in the backend and custom hooks in the frontend. The backend also features a **TransactionInterceptor for Mongoose**, allowing transaction management to be attached to any controller.

Frontend is fully integrated with React Query, custom hooks, and wrapper components for handling authentication, authorization, token management, and caching.

⚠️ Note: This application currently includes one pre-configured admin user for demonstration purposes. Any additional users created through the app will be treated as regular users.

- **Email:** test@test.com
- **Password:** Test\@123

## Live Deployments

[![Frontend Live](https://img.shields.io/badge/Live%20Demo-Click%20Here-blue?style=for-the-badge&logo=react)](https://authflow-v1.netlify.app/)

[![Swagger Docs](https://img.shields.io/badge/Swagger%20API-Explore%20Docs-orange?style=for-the-badge&logo=swagger)](https://fullstack-auth-app-production-73c9.up.railway.app/docs)

⚠️ Note: Make sure to select from the top of Swagger API documentation the server to be Production Environment.

## Table of Contents

1. [Technologies Used](#technologies-used)
2. [Features](#features)
3. [Folder Structure](#folder-structure)
4. [Getting Started](#getting-started)
5. [Authentication & Authorization Flow](#authentication--authorization-flow)

---

## Technologies Used

- **Frontend:** Vite, React, TypeScript, React Router, Axios, TailwindCSS, React Query, React Hook Form, Yup
- **Backend:** NestJS, Passport, Cookie Parser, Helmet, Bcrypt, Mongoose, Swagger
- **Authentication:** HTTP-only cookies, refresh tokens, single session per account
- **Authorization:** Role-based guards, custom decorators
- **Database:** MongoDB

---

## Features

**Backend:**

1. Authentication using **HTTP-only cookies** with a single session per account.
2. Authorization handled via **role-based guards** using custom decorators.
3. **TransactionInterceptor** for Mongoose: can be attached to any controller to handle database transactions atomically, ensuring consistency across operations.
4. User module with **paginated responses** for endpoints that return lists.
5. Server logs

**Frontend:**

1. Authentication and authorization using **custom decorators** and **wrapper protection components**.
2. Client-side interceptor for handling **token expiration**.
3. React Query used for caching responses.
4. Management of access and refresh tokens **in-memory** for security.
5. Layouts for auth and root views based on user authentication status.
6. TypeScript declaration file for standardizing API responses, pagination, and errors.

---

## Folder Structure

**Backend:**

```
backend/
├─ dist/
├─ src/
│  ├─ auth/
│  │  ├─ controllers/
│  │  ├─ dtos/
│  │  │  ├─ requests/
│  │  │  └─ responses/
│  │  ├─ interfaces/
│  │  ├─ repositories/
│  │  ├─ schemas/
│  │  ├─ services/
│  │  ├─ strategies/
│  │  └─ auth.module.ts
│  ├─ global/
│  │  ├─ constants/
│  │  ├─ decorators/
│  │  ├─ dtos/
│  │  ├─ enums/
│  │  ├─ filters/
│  │  ├─ guards/
│  │  ├─ interceptors/
│  │  ├─ interfaces/
│  │  ├─ types/
│  │  └─ utilities/
│  ├─ users/
│  │  ├─ controllers/
│  │  ├─ dtos/
│  │  ├─ enum/
│  │  ├─ interfaces/
│  │  ├─ repositories/
│  │  ├─ schemas/
│  │  ├─ services/
│  │  └─ users.module.ts
│  ├─ app.module.ts
│  └─ main.ts
├─ .env
├─ .env.example
├─ .prettierrc
├─ eslint.config.mjs
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ README.md
├─ tsconfig.build.json
└─ tsconfig.json
```

**Frontend:**

```
frontend/
├─ dist/
├─ src/
│  ├─ api/
│  │  ├─ auth/
│  │  │  ├─ auth.api.ts
│  │  │  ├─ auth.hooks.ts
│  │  │  └─ auth.types.ts
│  │  ├─ users/
│  │  │  ├─ users.api.ts
│  │  │  ├─ users.hooks.ts
│  │  │  └─ users.types.ts
│  │  ├─ api.d.ts
│  │  └─ axiosConfig.ts
│  ├─ assets/
│  ├─ components/
│  ├─ constants/
│  ├─ hooks/
│  ├─ layouts/
│  ├─ pages/
│  ├─ routers/
│  ├─ utils/
│  ├─ App.tsx
│  ├─ index.css
│  ├─ main.tsx
│  └─ vite-env.d.ts
├─ .env
├─ .env.example
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ README.md
├─ tailwind.config.js
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts
```

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```
NODE_ENV=local
PORT=5000
MONGODB_URI=your_mongodb_connection_string

JWT_ACCESS_TOKEN_SECRET=your_access_token_secret
JWT_ACCESS_TOKEN_EXPIRE_TIME_STRING=15m
JWT_REFRESH_TOKEN_EXPIRE_TIME_STRING=7d

SWAGGER_PRODUCTION_PREFIX=your_backend_url
FRONTEND_URL=your_frontend_url
```

Run the backend in development mode:

```bash
npm run start:dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```
VITE_API_BASE=your_backend_url
```

Run the frontend in development mode:

```bash
npm run dev
```

---

## Authentication & Authorization Flow

1. **Signup:** User provides email, name, password → hashed in DB → sets **HTTP-only refresh token cookie** + returns access token.
2. **Signin:** Backend verifies credentials → sets **HTTP-only refresh token cookie** + returns access token.
3. **Protected Routes:**

   - Backend uses **role-based guards and custom decorators**.
   - Frontend uses **wrapper components** to restrict access based on user role for routes and components.

4. **Token Management:** Access and refresh tokens handled **in-memory** for security; automatic token refresh handled via client-side interceptor.
5. **TransactionInterceptor:** Ensures atomic operations for Mongoose controllers; attachable per controller to wrap operations in a transaction.
6. **Logout:** Clears token and refresh token from the server (Clearing cookie).
