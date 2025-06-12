# TaskMaster - Modern Task Management App

A modern, responsive task management application built with React, TypeScript, and Tailwind CSS.

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/your-site-name/deploys)

## Features

- 🔐 User authentication (login/register)
- 📝 Create, read, update, and delete tasks
- 🏷️ Task categorization with priorities
- 📅 Due date management
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS
- 🔄 Real-time updates
- 🔒 Protected routes
- 📊 Task status tracking

## Tech Stack

- React 18
- TypeScript
- Redux Toolkit
- React Router
- Tailwind CSS
- Axios
- React Toastify

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/task-master.git
   cd task-master
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```
   VITE_API_URL=your_api_url_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── tasks/
│   │   ├── TaskForm.tsx
│   │   ├── TaskItem.tsx
│   │   └── TaskList.tsx
│   ├── dashboard/
│   │   └── Dashboard.tsx
│   └── layout/
│       └── Navbar.tsx
├── store/
│   ├── slices/
│   │   ├── authSlice.ts
│   │   └── taskSlice.ts
│   └── index.ts
├── services/
│   └── api.ts
├── types/
│   └── index.ts
├── App.tsx
└── main.tsx
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Router](https://reactrouter.com/)
- [React Toastify](https://fkhadra.github.io/react-toastify/) 