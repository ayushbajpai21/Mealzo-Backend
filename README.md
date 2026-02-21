# Cloud Kitchen Backend

Node.js + Express + MongoDB backend for Cloud Kitchen application with Admin Panel and REST API.

## Features

### Admin Panel (Server-Side Rendered with EJS)
- **Admin Login**: Secure authentication for admin users
- **Dashboard**: Statistics, charts, and recent orders overview
- **Dish Management**: Add new dishes with image upload (Cloudinary)
- **Order Management**: View and update order status

### REST API (for React Frontend)
- **Firebase Authentication**: Secure user authentication
- **Dish API**: Fetch all dishes with filters (type, category)
- **Order API**: Create orders, view order history
- **User Profile**: Update user information

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **View Engine**: EJS
- **Authentication**: 
  - Admin: Session-based
  - API: Firebase Admin SDK
- **File Upload**: Multer + Cloudinary
- **Session Management**: express-session

## Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment Variables**
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/clouddb
JWT_SECRET=your_jwt_secret_key_here
ADMIN_EMAIL=bajpai21ayush@gmail.com
ADMIN_PASSWORD=ayush123
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. **Firebase Setup (Optional for API)**
- Download your Firebase service account JSON from Firebase Console
- Save it as `config/serviceAccount.json`
- OR set `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable

4. **Start MongoDB**
Ensure MongoDB is running on `mongodb://localhost:27017`

5. **Run the Server**
```bash
# Development mode with nodemon
npm run server

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## Admin Panel Routes

| Route | Description |
|-------|-------------|
| `GET /admin/login` | Admin login page |
| `POST /admin/login` | Handle login |
| `GET /admin/dashboard` | Dashboard with stats and charts |
| `GET /admin/add-dish` | Add dish form |
| `POST /admin/add-dish` | Create new dish |
| `GET /admin/orders` | View all orders |
| `POST /admin/orders/:id/status` | Update order status |
| `GET /admin/logout` | Logout |

**Admin Credentials:**
- Email: `bajpai21ayush@gmail.com`
- Password: `ayush123`

## API Routes

### Authentication
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/api/auth/profile` | Required | Get user profile |
| `PUT` | `/api/auth/profile` | Required | Update user profile |

### Dishes
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/api/dishes` | Public | Get all dishes (supports ?type=Veg&category=Starter) |
| `GET` | `/api/dishes/:id` | Public | Get single dish |

### Orders
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/api/orders` | Required | Create new order |
| `GET` | `/api/orders/my-orders` | Required | Get user's orders |
| `GET` | `/api/orders/:id` | Required | Get single order |

**API Authentication:**
Include Firebase ID token in Authorization header:
```
Authorization: Bearer <firebase_id_token>
```

## Project Structure

```
backend/
├── config/
│   ├── db.js              # MongoDB connection
│   ├── cloudinary.js      # Cloudinary config
│   └── firebase.js        # Firebase Admin SDK
├── controllers/
│   ├── adminController.js # Admin panel logic
│   ├── dishController.js  # Dish API logic
│   └── orderController.js # Order API logic
├── middleware/
│   ├── adminAuth.js       # Admin session auth
│   ├── firebaseAuth.js    # Firebase token verification
│   └── upload.js          # Multer file upload
├── models/
│   ├── User.js            # User schema
│   ├── Dish.js            # Dish schema
│   └── Order.js           # Order schema
├── routes/
│   ├── adminRoutes.js     # Admin panel routes
│   ├── authRoutes.js      # Auth API routes
│   ├── dishRoutes.js      # Dish API routes
│   └── orderRoutes.js     # Order API routes
├── views/
│   └── admin/
│       ├── login.ejs      # Admin login page
│       ├── dashboard.ejs  # Admin dashboard
│       ├── add-dish.ejs   # Add dish form
│       └── orders.ejs     # Orders management
├── .env                   # Environment variables
├── .gitignore
├── package.json
└── server.js              # Entry point
```

## Database Models

### User
- `firebaseUid`: String (unique)
- `email`: String (unique)
- `displayName`: String
- `photoURL`: String
- `role`: String (customer/admin)
- `phoneNumber`: String
- `address`: Object

### Dish
- `name`: String
- `type`: String (Veg/Non-Veg)
- `price`: Number
- `description`: String
- `image`: String (URL)
- `category`: String
- `available`: Boolean

### Order
- `user`: ObjectId (ref: User)
- `items`: Array of { dish, quantity, price }
- `totalAmount`: Number
- `paymentMethod`: String (COD/Online)
- `paymentStatus`: String
- `status`: String (Pending/Preparing/Out for Delivery/Completed/Cancelled)

## Notes

- Admin panel uses session-based authentication
- API uses Firebase token authentication
- Images are uploaded to Cloudinary
- CORS is enabled for `http://localhost:5173` (React frontend)
