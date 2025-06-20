# Todo App Frontend

A modern, professional, and fully-featured Todo application frontend built with React, TypeScript, Vite, and Material-UI.

## Features
- User authentication (email/password & Google sign-in)
- Registration with optional photo upload
- Dashboard with:
  - Task list, create, edit, delete, and status toggle
  - Color-coded status, priority, and category chips
  - Task image upload
  - Sorting, filtering (status, priority, category), and search
- Task categories (select, filter, and display)
- User settings (update name, email, and photo)
- Responsive, mobile-friendly, and polished UI
- Error and success feedback (alerts, toasts)

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm

### Setup
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm run dev
   ```
3. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173)

### Environment
- The frontend is pre-configured to use the backend at:
  `https://todo-full-stack-1-9ewe.onrender.com`
- Google OAuth client ID is already set up in the code.

## Build for Production
```bash
npm run build
```
The output will be in the `dist/` folder.

## Deployment
You can deploy the `dist/` folder to any static hosting (Vercel, Netlify, GitHub Pages, etc).

## Customization
- To change the backend URL or Google OAuth client, update the relevant values in the code.
- The color palette and theme can be customized in `src/main.tsx`.

## Deployment Checklist (Netlify/Vercel)

1. **Set Environment Variable:**
   - `VITE_API_URL` should be set to your backend API endpoint (e.g. `https://todo-full-stack-1-9ewe.onrender.com/api`).
   - In Netlify: Go to Site Settings > Environment Variables > Add `VITE_API_URL`.
   - In Vercel: Go to Project Settings > Environment Variables > Add `VITE_API_URL`.

2. **SPA Routing:**
   - Ensure you have a `public/_redirects` file with the following content:
     ```
     /*    /index.html   200
     ```
   - This ensures client-side routing works on refresh.

3. **Build Command:**
   - `npm run build`

4. **Publish Directory:**
   - `dist`

5. **Redeploy:**
   - After setting the environment variable and building, redeploy your site.

## Environment Variables
- `VITE_API_URL` (required): The base URL of your backend API (must include `/api` at the end).

## License
MIT
