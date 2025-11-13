# Blog Admin & Editor - Front End

## Description

This React application provides a dashboard for **admins and editors** to manage blog content and access.  
Admins can view and manage all users, roles and permissions, while editors can create, edit, and publish their own posts.

It consumes the [Blog API](https://github.com/josednl/blog-backend).

---

## Features

- **Role-based access**: admin and editor dashboards.
- Create, edit, delete, publish, and unpublish posts.
- Dark mode support.
- JWT authentication via API.
- Responsive interface built with TailwindCSS.

---

## Technologies Used

- **Framework**: React + Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Context API / React Hooks
- **Auth**: JWT stored in `cookies`
- **Tools**: dotenv, Axios, Prettier

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://docs.npmjs.com/)

---

1. Clone the repository

```bash
git clone https://github.com/josednl/blog-author-frontend.git
cd blog-author-frontend
```

2. Install dependencies

```bash
npm install
```

3. Create a .env file in the root directory with the following variables:

```bash
VITE_API_URL=http://localhost:3000
```

4. Start the development server:

```bash
npm run dev
```

6. Open the app:

```bash
Open http://localhost:5173 or use Postman
```
