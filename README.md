# Dairy Flat Airways - Online Booking System

A boutique airline booking system built with Next.js, TypeScript, Tailwind CSS, and MongoDB.

## Features
- **Landing Page**: Modern entry point with search capabilities.
- **Flight Search**: Search for flights by origin, destination, and date.
- **Booking System**: Select flights and make bookings (with unique references and overbooking protection).
- **Invoice Generation**: View and print/download booking summaries.
- **Manage Bookings**: Search for bookings by passenger name and cancel existing bookings.
- **Recurring Schedule**: Automatic generation of weekly flights across multiple timezones (NZ, Sydney, Chatham Islands).

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB Atlas with Mongoose
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns & date-fns-tz

## Getting Started

### 1. Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 2. Setup Environment
Copy the example environment file and fill in your MongoDB URI:
```bash
cp .env.local.example .env.local
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Seed Data
Before using the application, you must seed the database with flights for the next 4 weeks.
Run the development server:
```bash
npm run dev
```
Then visit: `http://localhost:3000/api/seed` in your browser.

### 5. Deployment
This application is ready to be deployed on Vercel. Ensure you add the `MONGODB_URI` environment variable in the Vercel project settings.

## Routes & Aircraft
- **Sydney (YSSY)**: Weekly service (Fri/Sun) using SyberJet SJ30i (6 pax).
- **Rotorua (NZRO)**: Twice daily weekday shuttle using Cirrus SF50 (4 pax).
- **Great Barrier (NZGB)**: Thrice weekly service using Cirrus SF50 (4 pax).
- **Chatham Islands (NZCI)**: Twice weekly service using HondaJet Elite (5 pax).
- **Lake Tekapo (NZTL)**: Weekly service (Mon/Tue) using HondaJet Elite (5 pax).
