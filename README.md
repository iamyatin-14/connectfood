# 🍽️ ConnectFood - Food Donation Platform

A modern, full-stack web application that connects food donors with recipient organizations to reduce food waste and combat hunger. Built with React, Spring Boot, and MongoDB.

## 🌟 Features

### For Food Donors

- **Easy Donation Posting** - Share surplus food with location, quantity, and expiry details
- **Real-time Tracking** - Monitor donation status and collection progress
- **Profile Management** - Complete profile with contact information
- **Dashboard Analytics** - View donation history and impact statistics

### For Recipient Organizations

- **Browse Donations** - Search and filter available food donations by location
- **Collection Management** - Initiate and track collection process
- **Verified Access** - FSSAI license verification for food safety
- **Real-time Updates** - Instant notifications for new donations

### Core Features

- **Google OAuth Authentication** - Secure, passwordless login
- **JWT Token Management** - Stateless authentication with automatic refresh
- **Responsive Design** - Modern dark theme with mobile-first approach
- **Real-time Updates** - Live status updates and notifications
- **Data Validation** - Comprehensive input validation and error handling

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern UI library with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Vite** - Fast build tool and dev server

### Backend

- **Spring Boot 3** - Java-based microservices framework
- **Spring Security** - Authentication and authorization
- **Spring Data MongoDB** - NoSQL database integration
- **JWT** - JSON Web Token authentication
- **Google OAuth** - Third-party authentication

### Database

- **MongoDB** - NoSQL document database
- **MongoDB Compass** - Database management tool

### DevOps

- **Docker** - Containerization
- **Environment Variables** - Secure configuration management
- **Git** - Version control

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Java 17+ and Maven
- MongoDB 6+
- Google Cloud Console account (for OAuth)

### Environment Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/iamyatin-14/connectfood.git
   cd connectfood
   ```

2. **Backend Setup**

   ```bash
   cd backend
   cp env.example .env
   # Edit .env with your configuration
   mvn spring-boot:run
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env with your configuration
   npm install
   npm run dev
   ```

### Environment Variables

#### Backend (.env)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/connectfood

# JWT
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
JWT_EXPIRATION_MS=86400000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Server
SERVER_PORT=8080
```

#### Frontend (.env)

```env
# API
VITE_API_BASE_URL=http://localhost:8080/api

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## 📁 Project Structure

```
connectfood/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   ├── context/        # React context providers
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Spring Boot backend application
│   ├── src/main/java/
│   │   └── com/connectfood/backend/
│   │       ├── controller/  # REST API controllers
│   │       ├── service/     # Business logic services
│   │       ├── repository/  # Data access layer
│   │       ├── model/       # Data models
│   │       ├── dto/         # Data transfer objects
│   │       ├── security/    # Security configuration
│   │       └── config/      # Application configuration
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── README.md
└── PROJECT_COMPLETE_GUIDE.md
```

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Google OAuth** - Passwordless authentication with Google
- **Input Validation** - Comprehensive server-side validation
- **CORS Configuration** - Cross-origin resource sharing setup
- **Environment Variables** - Secure configuration management
- **HTTPS Ready** - Production-ready security headers

## 🎨 UI/UX Features

- **Dark Theme** - Modern dark navy blue design
- **Responsive Design** - Mobile-first responsive layout
- **Smooth Animations** - CSS animations and transitions
- **Loading States** - User-friendly loading indicators
- **Error Handling** - Comprehensive error messages
- **Accessibility** - WCAG compliant design

## 📊 API Endpoints

### Authentication

- `POST /api/auth/google` - Google OAuth authentication
- `GET /api/auth/validate` - Validate JWT token

### User Profile

- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `GET /api/profile/stats` - Get user statistics

### Donations

- `GET /api/donations` - Get user's donations (donor)
- `GET /api/donations/available` - Get available donations (recipient)
- `POST /api/donations` - Create new donation
- `PUT /api/donations/{id}/initiate` - Initiate collection
- `PUT /api/donations/{id}/collect` - Mark as collected


```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google OAuth** - For secure authentication
- **Spring Boot** - For robust backend framework
- **React** - For modern frontend development
- **Tailwind CSS** - For beautiful UI components
- **MongoDB** - For flexible data storage


**Made with ❤️ for a better world**
