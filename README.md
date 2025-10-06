# 🚗 Sparkle Drive Car Wash Booking System

A modern, full-stack car wash booking management system built with React, Node.js, and MongoDB. This application provides a complete solution for managing car wash bookings with advanced features like filtering, searching, invoice generation, and QR code sharing.

## 📋 Table of Contents

- [Description](#description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Live Demo](#live-demo)
- [Issues & Limitations](#issues--limitations)
- [Contributing](#contributing)
- [License](#license)

## 📖 Description

Sparkle Drive is a comprehensive car wash booking management system designed to streamline the booking process for car wash services. The application allows customers to book car wash services, while administrators can manage bookings, generate invoices, and track service history.

The system features a modern, responsive interface built with React and TypeScript, backed by a robust Node.js API with MongoDB for data persistence. It includes advanced features like real-time filtering, PDF invoice generation, QR code sharing, and comprehensive booking management.

## ✨ Features

### 🎯 Core Functionality
- **Complete CRUD Operations**: Create, read, update, and delete bookings
- **Advanced Filtering**: Filter by service type, car type, status, and date range
- **Real-time Search**: Search by customer name and car details
- **Pagination**: Efficient pagination with 8-10 bookings per page
- **Booking Details**: Comprehensive detail view for each booking

### 🎨 User Interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Built with Shadcn UI components and Tailwind CSS
- **Intuitive Navigation**: Easy-to-use interface with clear navigation
- **Real-time Updates**: Instant feedback and updates

### 📊 Booking Management
- **Service Types**: Basic Wash, Premium Wash, Deluxe Wash, Interior Cleaning, Full Detailing
- **Car Types**: Sedan, SUV, Truck, Van, Sports Car, Luxury
- **Status Tracking**: Pending, Confirmed, Completed, Cancelled
- **Rating System**: 1-5 star rating system for service quality
- **Add-ons**: Additional services like interior cleaning, polishing, etc.

### 📄 Invoice & Sharing
- **PDF Generation**: Download booking details as PDF invoices
- **Print Functionality**: Optimized print styles for invoices
- **QR Code Sharing**: Generate QR codes for easy booking sharing
- **URL Sharing**: Shareable booking confirmation URLs

### 🔧 Technical Features
- **Type Safety**: Full TypeScript implementation
- **Input Validation**: Comprehensive form validation with Zod
- **Error Handling**: Centralized error handling and user feedback
- **Data Persistence**: MongoDB with Mongoose ODM
- **API Documentation**: RESTful API with proper status codes

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Modern, accessible component library
- **React Query** - Data fetching and caching
- **React Router DOM** - Client-side routing
- **Date-fns** - Date manipulation and formatting
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Zod** - Schema validation
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

### Bonus Features
- **html2canvas** - HTML to canvas conversion
- **jsPDF** - PDF generation
- **qrcode** - QR code generation

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or pnpm package manager

### 1. Clone the Repository
```bash
git clone https://github.com/Moulirichards/CAR-WASH-SYSTEM.git
cd CAR-WASH-SYSTEM
```

### 2. Install Dependencies
```bash
# Using npm
npm install

# Using pnpm (recommended)
pnpm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/carwash-bookings
```

### 4. Start the Development Servers
```bash
# Start both frontend and backend
pnpm dev

# Or start individually:
pnpm dev:frontend  # Frontend on http://localhost:8080
pnpm dev:backend   # Backend on http://localhost:3001
```

### 5. Access the Application
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/bookings

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### Get All Bookings
```http
GET /api/bookings
```
**Query Parameters:**
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 10, max: 50)
- `q` - Search query (customer name or car details)
- `serviceType` - Filter by service type
- `carType` - Filter by car type
- `status` - Filter by status
- `dateFrom` - Filter from date (YYYY-MM-DD)
- `dateTo` - Filter to date (YYYY-MM-DD)
- `sort` - Sort by field (date, price, duration, customerName)

#### Get Single Booking
```http
GET /api/bookings/:id
```

#### Create Booking
```http
POST /api/bookings
Content-Type: application/json

{
  "customerName": "John Doe",
  "carDetails": {
    "make": "Toyota",
    "model": "Camry",
    "year": 2020,
    "type": "sedan"
  },
  "serviceType": "Basic Wash",
  "date": "2024-01-15",
  "timeSlot": "10:00 AM",
  "duration": 30,
  "price": 25.00,
  "status": "Pending",
  "rating": 5,
  "addOns": ["Interior Cleaning", "Waxing"]
}
```

#### Update Booking
```http
PUT /api/bookings/:id
Content-Type: application/json

{
  // Same structure as create
}
```

#### Delete Booking
```http
DELETE /api/bookings/:id
```

### Response Format
```json
{
  "success": true,
  "data": { /* booking data */ },
  "message": "Operation successful"
}
```

### Error Format
```json
{
  "success": false,
  "error": "Error message",
  "details": { /* validation details */ }
}
```

## 🌐 Live Demo

### Production Deployment
- **Live Application**: https://car-wash-system-ten.vercel.app/
- **API Endpoint**: [Coming Soon]

### Development
- **Local Frontend**: http://localhost:8080
- **Local Backend**: http://localhost:3001

## ⚠️ Issues & Limitations

### Current Limitations
1. **Authentication**: No user authentication system implemented
2. **Payment Integration**: No payment processing capabilities
3. **Email Notifications**: No email confirmation system
4. **Real-time Updates**: No WebSocket implementation for real-time updates
5. **File Uploads**: No image upload for car photos
6. **Multi-language**: Single language support (English only)
7. **Admin Panel**: No separate admin dashboard
8. **Reporting**: No analytics or reporting features

### Known Issues
1. **Date Handling**: Some edge cases with date formatting in different timezones
2. **Large Datasets**: Performance may degrade with very large booking datasets
3. **Mobile Safari**: Some minor styling issues on older iOS versions
4. **PDF Generation**: Complex layouts may not render perfectly in PDF

### Planned Improvements
- [ ] User authentication and authorization
- [ ] Payment gateway integration
- [ ] Email notification system
- [ ] Real-time booking updates
- [ ] Image upload functionality
- [ ] Multi-language support
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Mobile app (React Native)
- [ ] API rate limiting
- [ ] Database indexing optimization

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Moulirichards** - *Initial work* - [GitHub](https://github.com/Moulirichards)

## 🙏 Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [React](https://reactjs.org/) for the amazing frontend library
- [MongoDB](https://www.mongodb.com/) for the flexible database solution

---

⭐ **Star this repository if you found it helpful!**

For questions or support, please open an issue on GitHub.