# 🏦 Modern Banking API

A robust and secure banking API built with NestJS, featuring account management, transactions, and role-based access control.

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-v11-red.svg" alt="NestJS Version" />
  <img src="https://img.shields.io/badge/TypeScript-v5-blue.svg" alt="TypeScript Version" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License" />
</p>

## ✨ Features

- 👤 **User Management**
  - Registration and authentication
  - Role-based access control (RBAC)
  - JWT authentication
  
- 💰 **Account Management**
  - Create and manage bank accounts
  - Account balance tracking
  - Account status management
  
- 💸 **Transactions**
  - Secure money transfers
  - Transaction history
  - Real-time transaction processing
  
- 🔒 **Security**
  - JWT-based authentication
  - Password hashing with bcrypt
  - Role-based authorization
  - Helmet security headers

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/KianJanloo/bank.git
cd bank
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# Create a .env file in the root directory and add:
DATABASE_URL=postgresql://user:password@localhost:5432/bankdb
JWT_SECRET=your_jwt_secret
```

4. Start the development server:
```bash
pnpm run start:dev
```

The API will be available at `http://localhost:3000`

## 🛠️ Tech Stack

- **Framework**: NestJS v11
- **Language**: TypeScript v5
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Security**: Helmet, bcrypt

## 📚 API Documentation

Once the server is running, visit `http://localhost:3000/api` to access the Swagger documentation.

### Main Endpoints

- `POST /auth/register` - Register a new user
- `POST /auth/login` - User login
- `GET /accounts` - List user accounts
- `POST /transactions` - Create a new transaction
- `GET /users/profile` - Get user profile

## 🧪 Testing

Run the test suite:

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

## 🛣️ Project Structure

```
src/
├── auth/           # Authentication & authorization
├── users/          # User management
├── accounts/       # Account management
├── transactions/   # Transaction handling
├── guards/         # Security guards
└── entities/       # Database entities
```

## 🔧 Development

```bash
# Format code
pnpm run format

# Lint code
pnpm run lint

# Build for production
pnpm run build
```

## 🚀 Deployment

1. Build the application:
```bash
pnpm run build
```

2. Start in production mode:
```bash
pnpm run start:prod
```

### 🌐 Live Deployment

The API is deployed on Railway and available here: https://bank-production-7646.up.railway.app/

## 📝 License

This project is [MIT licensed](LICENSE).

## 👥 Author

Kian Janloo
- GitHub: [@KianJanloo](https://github.com/KianJanloo)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/KianJanloo/bank/issues).
