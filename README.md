GrabSnack 🍔A Full-Stack Food Ordering Application📌 Project OverviewGrabSnack is a food ordering application developed as part of the IT342 System Integration and Architecture course at Cebu Institute of Technology - University. The system consists of a React web frontend, a Spring Boot backend API, and an Android mobile application, all integrated together to provide a seamless food ordering experience.🏗️ System ArchitectureAndroid Mobile App (Kotlin)
          ↓
React Web App (Vite)
          ↓
Spring Boot REST API (port 8080)
          ↓
MySQL Database🛠️ Technologies UsedFrontend (Web)
React.js (Vite)
React Router DOM
Axios
CSS (Custom dark gradient theme)
Backend
Java 17
Spring Boot 3.x
Spring Security
JWT Authentication
Google OAuth2 Login
Spring Data JPA
MySQL Database
Maven
Mobile (Android)
Kotlin
XML Layout
Retrofit 2.9.0
OkHttp 4.12.0
Material Design Components
Android API 24 (minimum)
📂 Project StructureGrabsnack
│
├── grabsnack-backend
│   └── src/main/java/com/grabsnack/backend
│       ├── controller
│       │     └── AuthController.java
│       ├── dto
│       │     ├── LoginRequest.java
│       │     └── RegisterRequest.java
│       ├── handler
│       │     └── OAuth2LoginSuccessHandler.java
│       ├── model
│       │     └── User.java
│       ├── repository
│       │     └── UserRepository.java
│       ├── security
│       │     ├── JwtService.java
│       │     └── JwtAuthenticationFilter.java
│       ├── service
│       │     └── AuthService.java
│       └── config
│             └── SecurityConfig.java
│
├── grabsnack-frontend
│   └── src
│       ├── pages
│       │     ├── Login.jsx
│       │     ├── Register.jsx
│       │     └── Dashboard.jsx
│       ├── App.jsx
│       └── Style2.css
│
└── grabsnack-mobile
    └── app/src/main/java/com/grabsnack/mobile
        ├── network
        │     ├── ApiService.kt
        │     ├── AuthModels.kt
        │     └── RetrofitClient.kt
        ├── LoginActivity.kt
        ├── RegisterActivity.kt
        ├── DashboardActivity.kt
        └── MainActivity.kt✨ FeaturesWeb Application
User registration and login
Google OAuth2 login
JWT authentication
Dashboard and profile pages
Protected routes
Mobile Application
User registration
User login
Dashboard/Home screen with food grid
Food categories and search bar
Bottom navigation
Backend API integration
Backend
RESTful API
JWT token authentication
Google OAuth2 integration
User management
MySQL database persistence
▶️ Steps to Run Backend
Make sure MySQL is running (XAMPP)
Create database:
sqlCREATE DATABASE grabsnack_db;
Open grabsnack-backend in IntelliJ
Run GrabsnackBackendApplication.java
Backend runs at:
http://localhost:8080▶️ Steps to Run Web App
Open terminal in grabsnack-frontend
Install dependencies:
bashnpm install
Run the app:
bashnpm run dev
Open browser:
http://localhost:5173▶️ Steps to Run Mobile App
Open grabsnack-mobile in Android Studio
Connect Android device via USB or Wireless ADB
Make sure backend is running at http://YOUR_PC_IP:8080
Update RetrofitClient.kt with your PC's IP address
Click ▶ Run in Android Studio
📡 API EndpointsMethodEndpointDescriptionPOST/api/auth/registerRegister new userPOST/api/auth/loginUser loginPOST/api/auth/logoutUser logoutGET/productsGet all productsPOST/cart/itemsAdd to cartPOST/ordersPlace order🗄️ Database Tables
users - User accounts and authentication
products - Product catalog
carts - Shopping cart per user
cart_items - Items in cart
orders - Customer orders
order_items - Items in each order
refresh_tokens - JWT refresh tokens
🔐 Environment VariablesCreate application.properties with:propertiesspring.datasource.url=jdbc:mysql://localhost:3306/grabsnack_db
spring.datasource.username=root
spring.datasource.password=
spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET📱 Mobile Screenshots(Screenshots of Login, Register, and Dashboard screens)🔗 RepositoryGitHub: https://github.com/Jeepittea/GrabsnackPrepared by: Wolfe, Justin Larena
Course: IT342 - System Integration and Architecture
School: Cebu Institute of Technology - University
