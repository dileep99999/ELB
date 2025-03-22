# Employee Lunch Booking System (ELBS)

This is a full-stack application for booking employee lunches, built with the MERN stack (MongoDB, Express, React, Node.js).

## Project Structure

- `/client` - React frontend built with Vite
- `/server.js` - Express backend server
- `/models` - MongoDB models
- `/routes` - API routes

## Local Development

### Prerequisites

- Node.js and npm installed
- MongoDB account (using MongoDB Atlas in this project)

### Setting Up the Project

1. Install server dependencies:
   ```
   npm install
   ```

2. Install client dependencies:
   ```
   cd client
   npm install
   cd ..
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5001
   ```

4. Start the development server (both backend and frontend):
   ```
   npm run dev
   ```

## Deployment

### Frontend (GitHub Pages)

The frontend can be deployed to GitHub Pages. See detailed instructions in [client/README.md](client/README.md).

### Backend

The backend needs to be deployed to a hosting service that can run Node.js applications. Some options include:

- Heroku
- Render
- Vercel
- DigitalOcean
- AWS

After deploying the backend, update the API URL in the frontend configuration:
- Update `client/src/config/api.js` with your backend URL

## GitHub Pages Limitations

Note that GitHub Pages is a static site hosting service and doesn't support server-side code. When deploying to GitHub Pages:

1. Only the frontend will be hosted on GitHub Pages
2. You'll need to host the backend separately
3. The API URL in the frontend code must point to your hosted backend

For a full-stack production deployment, consider using a service that can host both frontend and backend together, such as Vercel, Render, or Heroku.

# Context and Rules for Lunch Booking System

## Context
- **Purpose**: Allow employees to book lunches and admins to manage bookings.
- **Users**:
  - Employees: Submit bookings via a public form.
  - Admins: Access a secure dashboard to view, analyze, and download bookings.
- **Environment**: Web-based, accessible on desktop and mobile.

## Rules
1. **Employee Form**:
   - All fields (Name, PS Number, Dept Code, Date) are mandatory.
   - PS Number must be unique per date.
   - Date cannot be in the past.
2. **Admin Panel**:
   - Requires login with valid credentials.
   - Default date filter is the current day (2025-03-17 as of now).
   - PDF includes all bookings for the filtered date.
3. **Security**:
   - Admin routes are protected with JWT.
   - Passwords are hashed before storage.
4. **Data**:
   - Bookings are stored indefinitely in MongoDB.
   - Duplicate bookings are rejected with an error message.

## Assumptions
- Employees know their PS Number and Dept Code.
- Admin credentials are pre-set in the database.
- One lunch per employee per day.