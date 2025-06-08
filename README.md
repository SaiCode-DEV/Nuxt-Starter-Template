# SaiCode's Nuxt Starter Template

A modern, full-stack starter template built with cutting-edge technologies. Everything you need to build amazing web applications with Nuxt 3, Vuetify, and authentication out of the box.

## 🚀 Features

- **Modern Tech Stack**: Built with Nuxt 3, Vuetify, and TypeScript for a robust development experience
- **Authentication System**: Secure user authentication and session management
- **Responsive Design**: Beautiful Material Design interface that works on all devices
- **Type Safety**: Full TypeScript support for enhanced developer experience
- **Database Integration**: Prisma ORM for type-safe database operations
- **Modern Tooling**: ESLint, hot reloading, and optimized build process

## 🛠️ Technologies

- **[Nuxt 3](https://nuxt.com/)** - The intuitive Vue framework with SSR and static generation
- **[Vuetify](https://vuetifyjs.com/)** - Beautiful Material Design components for Vue.js
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety and enhanced developer experience
- **[Prisma ORM](https://www.prisma.io/)** - Type-safe database access with modern ORM capabilities
- **Authentication** - Secure user management system
- **Docker** - Containerized deployment support

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Docker (optional, for database)

### Installation

1. **Clone & Install Dependencies**

   ```bash
   git clone <repository-url>
   cd your-project-name
   npm install
   ```

2. **Configure Environment**

   Copy the environment template and configure your variables:

   ```bash
   cp .env.example .env
   ```

   Set up your environment variables for database and authentication.

3. **Database Setup**

   This template uses **PostgreSQL** as the database. You have several options:

   **Option A: Using Docker (Recommended)**

   ```bash
   docker-compose up -d
   ```

   **Option B: Local PostgreSQL Installation**

   - Install PostgreSQL locally on your machine
   - Create a database named `nuxt`
   - Update your `.env` file with your local database credentials

   After setting up PostgreSQL, run database migrations:

   ```bash
   npx prisma migrate dev
   ```

4. **Start Development Server**

   ```bash
   npm run dev
   ```

   Navigate to `http://localhost:3000` to see your application running.

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Building
npm run build        # Build for production
npm run preview      # Preview production build locally

# Database
npx prisma studio    # Open Prisma Studio database GUI
npx prisma migrate dev    # Run database migrations

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

## 🐳 Docker Deployment

The project includes Docker configuration for easy deployment:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📁 Project Structure

```
your-project-name/
├── components/          # Reusable Vue components
├── composables/         # Vue composables and utilities
├── layouts/            # Application layouts
├── pages/              # File-based routing pages
├── prisma/             # Database schema and migrations
├── server/             # Server-side API routes
├── stores/             # Pinia state management
└── public/             # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📖 Documentation

For more detailed information:

- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Vuetify Documentation](https://vuetifyjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by SaiCode
