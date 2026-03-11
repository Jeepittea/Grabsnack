GrabSnack – Google OAuth2 Login Integration

Project Title

GrabSnack Web Application – Google OAuth2 Authentication

---

Overview

GrabSnack is a web application that demonstrates user authentication using both traditional email/password login and Google OAuth2 login. The system integrates a React.js frontend with a Spring Boot backend and a MySQL database.

The Google Login feature allows users to securely sign in using their Google account without needing to manually register in the system.

---

How Google Login Works

1. The user clicks the Login with Google button on the React frontend.
2. The frontend redirects the user to the Spring Boot OAuth2 authorization endpoint.
3. The backend redirects the user to the Google authentication page.
4. After successful login, Google sends the user information (email and name) back to the backend.
5. The backend checks if the user already exists in the database.
6. If the user does not exist, a new account is automatically created.
7. The system generates a JWT token for the authenticated user.
8. The user is redirected back to the frontend application with the authentication token.

---

Backend Technologies

The backend was implemented using:

- Spring Boot
- Spring Security
- Spring Security OAuth2 Client
- Spring Data JPA
- Hibernate
- JWT Authentication
- MySQL Database
- Maven

These technologies handle authentication, database operations, and secure API communication.

---

Frontend Technologies

The frontend was developed using:

- React.js
- Axios for API communication
- React Router for navigation
- CSS styling

The frontend provides the login interface and communicates with the backend authentication endpoints.

---

Project Structure

Backend

src/main/java/com/grabsnack/backend
│
├── config # Security and application configuration
├── controller # API endpoints
├── dto # Data transfer objects
├── handler # OAuth2 success handler
├── model # Database entities
├── repository # JPA repositories
├── security # JWT authentication classes
└── service # Business logic

Frontend

src
│
├── pages
│ ├── Login.jsx
│ ├── Register.jsx
│ └── Dashboard.jsx
│
├── Style2.css
├── App.jsx
└── main.jsx

---

Database

The application uses MySQL to store user information including:

- User ID
- Full Name
- Email
- Password
- Role

Users authenticated through Google are automatically stored in the database if they do not already exist.

---

Challenges Encountered

Several challenges were encountered during implementation:

- Configuring Google OAuth2 credentials in Google Cloud Console
- Setting the correct OAuth redirect URI
- Fixing Spring Security configuration issues
- Implementing AuthenticationProvider for login authentication
- Handling JWT token generation after OAuth login
- Ensuring proper communication between React frontend and Spring Boot backend

These challenges were resolved through debugging Spring Security configuration and proper OAuth setup.

---

How to Run the Project

Backend

mvn spring-boot:run

Backend runs at:

http://localhost:8080

---

Frontend

npm install
npm run dev

Frontend runs at:

http://localhost:5173

---

Google OAuth2 Login Endpoint

http://localhost:8080/oauth2/authorization/google

---

Author

Justin Wolfe
