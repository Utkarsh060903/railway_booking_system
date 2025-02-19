# Railway Reservation System

A full-stack web application for railway ticket booking. Users can register, search for trains, check availability, book tickets, and manage their reservations.

## Screenshots
![Authentication page](https://github.com/user-attachments/assets/61c2d1b8-bad0-4313-b5c5-ce8a5d062012)
![Home page](https://github.com/user-attachments/assets/3cf54534-ede0-485f-834c-4d9ffb3d781e)
![Booking Confirmation](https://github.com/user-attachments/assets/d148e54e-14f4-4ffd-bf02-c4842c0ec4b8)
![Booking Cancellation](https://github.com/user-attachments/assets/e9641b8e-b26f-44ce-aaf9-d1ef50d4ff02)

## Features
- User authentication (Register/Login)
- Train search and availability check
- Ticket booking and reservation management
- View booking status and cancel tickets

---

## Getting Started

Follow these steps to set up and run the project on your local system.


### Installation

#### 1. Clone the Repository
```sh
git clone https://github.com/your-username/railway-reservation-system.git
cd railway-reservation-system
```

#### 2. Install Dependencies
For both client and server, install the required packages:
```sh
cd server
npm install
cd ../vite-project
npm install
```

#### 3. Configure Environment Variables
Create a `.env` file in the `server` directory and add the following:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

#### 4. Start the Application
Run both server and client:
```sh
cd server
npm start
```
_Open a new terminal_
```sh
cd vite-project
npm start
```

The application should now be running at `http://localhost:5173/`.

---

## How to Use the Website

### 1. User Registration and Login
- Register by providing your details.
- Login with your registered credentials.

### 2. Train Selection & Booking
- Select a train and check its availability.
- Book your ticket and receive a **Booking ID**.

### 3. Manage Your Booking
- Copy the Booking ID to check the status.
- Cancel the ticket if needed.

---

## Technologies Used
- **Frontend**: React.js, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT

---

