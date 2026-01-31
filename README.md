# Expense Tracker - Full-Stack CRUD Application

🚀 **Live Demo**: [https://expense-tracker-vercel-lilac.vercel.app/auth](https://expense-tracker-vercel-lilac.vercel.app/auth)

A modern, full-stack **CRUD (Create, Read, Update, Delete)** expense tracking application built with React, TypeScript, Express.js, and MongoDB. This application demonstrates complete CRUD operations for managing expenses, income, and user data with a beautiful UI, dark mode support, comprehensive RESTful API, and production-ready deployment configurations.

## 🏗️ Architecture Overview

### Tech Stack
- **Frontend**: React 18 + TypeScript + TailwindCSS + Vite
- **Backend**: Express.js + Node.js + TypeScript
- **Database**: MongoDB + Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **State Management**: React Query for API state
- **Deployment**: Vercel (Frontend) + Render/AWS (Backend)

### Project Structure
```
expense-tracker/
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── features/         # Feature-based modules
│   │   ├── services/         # API client & utilities
│   │   └── styles/           # Global styles & Tailwind
│   └── package.json
├── backend/                  # Express API server
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, validation, error handling
│   │   └── config/          # Database, environment config
│   └── package.json
├── shared/                   # Shared TypeScript types
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense-tracker
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   **Backend (.env)**
   ```bash
   cd backend
   cp env.example .env
   # Edit .env with your configuration
   ```

   **Frontend (.env.local)**
   ```bash
   cd ../frontend
   # Create .env.local
   echo "VITE_API_URL=http://localhost:5000/api" > .env.local
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Seed categories (optional)**
   ```bash
   cd backend
   npm run dev
   # Then make a POST request to /api/categories/seed with admin auth
   ```

6. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   npm run dev:backend

   # Terminal 2 - Frontend
   npm run dev:frontend
   ```

7. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔧 Configuration

### Environment Variables

#### Backend
| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/expense-tracker` |
| `JWT_SECRET` | JWT signing secret | *Required* |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |

#### Frontend
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/auth/login
Authenticate user and return JWT token.
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /api/auth/profile
Get current user profile (requires authentication).

#### PUT /api/auth/profile
Update user profile (requires authentication).

### Expense Endpoints

#### GET /api/expenses
Get paginated list of user expenses.
Query parameters: `page`, `limit`, `category`, `startDate`, `endDate`

#### POST /api/expenses
Create a new expense (requires authentication).
```json
{
  "amount": 50.00,
  "description": "Lunch at restaurant",
  "category": "60f1b2b5c8f9a1b2c3d4e5f6",
  "date": "2024-01-15"
}
```

#### GET /api/expenses/:id
Get single expense by ID.

#### PUT /api/expenses/:id
Update expense by ID.

#### DELETE /api/expenses/:id
Delete expense by ID.

### Dashboard Endpoints

#### GET /api/dashboard/stats
Get dashboard statistics including totals, balance, and category breakdown.

### Category Endpoints

#### GET /api/categories
Get all available categories.

#### POST /api/categories/seed
Seed default categories (admin only).

## 🎨 Design Decisions

### Frontend Architecture
- **Component-Driven**: Atomic design with reusable UI components
- **Feature-Based**: Organized by features (auth, dashboard, expenses)
- **Type-Safe**: Full TypeScript coverage with shared types
- **Responsive**: Mobile-first design with TailwindCSS
- **Accessible**: ARIA labels, keyboard navigation, focus management

### Backend Architecture
- **Layered Architecture**: Controllers → Services → Models
- **RESTful API**: Standard HTTP methods and status codes
- **Authentication**: JWT-based with secure password hashing
- **Validation**: Zod schemas for runtime type validation
- **Error Handling**: Centralized error handling with proper HTTP codes
- **Security**: Helmet, CORS, rate limiting, input validation

### Database Design
- **Normalized Schema**: Proper relationships with references
- **Indexed Fields**: Optimized queries with strategic indexes
- **Validation**: Schema-level validation with Mongoose
- **Timestamps**: Automatic createdAt/updatedAt fields

## 🚀 Deployment

### Frontend (Vercel)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure build settings:
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

3. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url/api
   ```

4. **Deploy**
   - Vercel will automatically deploy on every push to main

### Backend (Render)

1. **Create Render Account**
   - Sign up at [render.com](https://render.com)

2. **Create Web Service**
   - Connect your GitHub repository
   - Configure:
     - Runtime: Node
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-production-jwt-secret
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   ```

4. **Deploy**
   - Render will build and deploy automatically

### Backend (AWS)

1. **EC2 Instance**
   ```bash
   # Install Node.js and PM2
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2

   # Clone and setup
   git clone your-repo
   cd expense-tracker/backend
   npm install
   npm run build
   ```

2. **Environment Configuration**
   ```bash
   cp env.example .env
   # Edit .env with production values
   ```

3. **Process Management**
   ```bash
   pm2 start dist/server.js --name expense-tracker-api
   pm2 startup
   pm2 save
   ```

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests (if implemented)
cd ../frontend
npm test
```

### API Testing
Use tools like Postman or Insomnia to test API endpoints. Import the provided collection for pre-configured requests.

## 🔒 Security Features

- **Password Hashing**: bcrypt with configurable rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Comprehensive validation with Zod
- **CORS Protection**: Configured allowed origins
- **Helmet Security Headers**: Security headers middleware
- **Data Sanitization**: Mongoose built-in sanitization

## 📈 Performance Optimizations

- **Database Indexing**: Strategic indexes for fast queries
- **Compression**: Response compression middleware
- **Caching**: React Query for frontend API caching
- **Lazy Loading**: Code splitting and lazy component loading
- **Optimized Builds**: Tree shaking and minification

## 🚀 Future Enhancements

- [ ] Email notifications for expense alerts
- [ ] Export expenses to CSV/PDF
- [ ] Recurring expenses
- [ ] Budget planning and tracking
- [ ] Multi-currency support
- [ ] Data visualization improvements
- [ ] Mobile app (React Native)
- [ ] Real-time notifications with WebSockets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Your Name - [Your GitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Express.js](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS
- [Vercel](https://vercel.com/) - Frontend deployment
- [Render](https://render.com/) - Backend deployment


