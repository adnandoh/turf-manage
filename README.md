# Turf Management Frontend

A React.js frontend for managing Cricket and Pickle Ball court bookings, built with Vite and Material UI.

## Features

- Clean, modern UI with Material Design
- Separate tabs for Cricket and Pickleball court management
- Interactive 24-hour slot grid with block/unblock functionality
- Date navigation with previous/next day controls
- Secure admin authentication
- Responsive design for all device sizes

## Tech Stack

- React.js - UI library
- Vite - Build tool
- Material UI - Component library
- React Router - Navigation
- Axios - API requests
- date-fns - Date manipulation

## Project Structure

```
src/
├── api/           # API services
├── components/    # Reusable UI components
├── pages/         # Page components
├── utils/         # Utility functions
└── App.jsx        # Main application component
```

## Setup Instructions

### Prerequisites

- Node.js 14.x or higher
- npm 7.x or higher
- Django backend running on http://localhost:8000

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd turf-admin
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Access the application at http://localhost:5173

## Backend Integration

This frontend connects to the Django REST API with the following endpoints:

- Authentication: `/api-token-auth/`
- Cricket Slots: `/api/cricket/slots/`
- Cricket Bookings: `/api/cricket/bookings/`
- Cricket Blocks: `/api/cricket/blocks/`
- Pickleball Slots: `/api/pickleball/slots/`
- Pickleball Bookings: `/api/pickleball/bookings/`
- Pickleball Blocks: `/api/pickleball/blocks/`

## Usage

1. Log in with admin credentials
2. Navigate to either Cricket or Pickleball tab
3. Use the date navigator to select a specific date
4. View the 24-hour slot grid
5. Click on a slot to block/unblock it

## Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory, which can be deployed to any static hosting service.
