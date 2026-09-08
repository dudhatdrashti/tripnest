# ✈️ TripNest - Premium Travel Booking Platform

A production-ready, full-featured travel booking platform built with React. TripNest provides a premium, Airbnb + Booking.com + Google Travel-inspired experience for discovering destinations, browsing hotels, and booking trips.

![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8)

> **Note:** Screenshots folder placeholder - add your own screenshots to `/screenshots` and link them below.

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Installation](#-installation)
- [Available Scripts](#-available-scripts)
- [Deployment](#-deployment)
- [Environment Setup](#-environment-setup)

## 🚀 Project Overview

TripNest is a complete travel booking frontend application that simulates a real SaaS product. It includes:

- **Comprehensive hotel and destination discovery** with advanced search, filtering, and sorting
- **Full booking flow** with receipts, price calculation, and PDF download
- **Personalization** via wishlists, recently-viewed, and booking history
- **AI Trip Planner** (frontend only) that generates mock itineraries
- **Multi-language** support (English, Hindi, Gujarati)
- **Multi-currency** support (USD, INR, EUR, GBP)
- **Dark mode** with premium glassmorphism UI
- **Interactive maps** using Leaflet
- **Data visualization** with Recharts

All data is served from a mock API layer (`src/services/api.js`) backed by local data (`src/data`), making it trivial to swap in a real backend later.

## ✨ Features

### Core Features
- 🔍 **Smart Search** - Debounced search with instant suggestions, recent searches, filters (price, rating, amenities, property type), sorting, and pagination
- 🏨 **Hotel Details** - Image gallery with Swiper, thumbnails, amenities, policies, reviews, room types, price trend chart, interactive map, nearby attractions & restaurants, similar hotels
- 📍 **Destination Details** - Curated destination content with hotels
- ❤️ **Wishlist** - Persistent local storage, empty states, animations
- 🕐 **Recently Viewed** - Auto-tracked hotels shown on Home & Hotel Details
- 🧾 **Booking Engine** - Date/guest selection, promo codes, price calculation, taxes, receipt preview
- 📄 **PDF Receipt** - Download booking receipts via html2canvas + jsPDF
- 🗺️ **Interactive Maps** - Leaflet-based hotel location, attractions, and restaurants
- 📊 **Charts** - Hotel price trends, booking statistics, destination popularity, monthly travel trends
- 🤖 **AI Trip Planner** - Generate mock multi-day itineraries (destinations, hotels, restaurants, activities)
- 🌐 **Multi-language** - EN / HI / GU via react-i18next
- 💱 **Multi-currency** - USD / INR / EUR / GBP with dynamic price updates
- 🌙 **Dark Mode** - Class-based Tailwind dark mode with persistence
- 🔔 **Notifications** - Booking confirmations, offers, price-drop alerts with animated panel

### Premium UI/UX
- 🎨 Glassmorphism, gradient backgrounds, luxury cards
- 🎬 Framer Motion page transitions, micro-interactions, scroll reveal
- 🔢 Animated counters and floating elements
- 📱 Fully responsive (mobile → ultra-wide)
- ♿ Semantic HTML, ARIA labels, keyboard navigation
- ⚡ Lazy loading & code splitting for performance

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 18 (Vite) |
| Language | JavaScript (ES6+) |
| Styling | Tailwind CSS 3 |
| Routing | React Router DOM 6 |
| State | Context API + useReducer |
| Forms | React Hook Form |
| Animations | Framer Motion |
| Carousels | Swiper.js |
| Charts | Recharts |
| Icons | Lucide React |
| Toasts | react-hot-toast |
| i18n | react-i18next |
| Maps | Leaflet + react-leaflet |
| PDF | html2canvas + jsPDF |

## 📁 Folder Structure

```
📦 src
├── 📂 animations/       # Framer motion variants & animation helpers
├── 📂 assets/           # Images, fonts, icons
├── 📂 components/
│   ├── 📂 cards/        # HotelCard, DestinationCard, ReviewCard, OfferCard, TestimonialCard
│   ├── 📂 charts/       # Recharts wrappers
│   ├── 📂 common/       # Shared/common components
│   ├── 📂 forms/        # Form components
│   ├── 📂 layout/       # Navbar, Footer
│   ├── 📂 loaders/      # PageLoader, Skeleton loaders
│   ├── 📂 maps/         # HotelMap (Leaflet)
│   ├── 📂 modals/       # Modal components
│   └── 📂 ui/           # Button, Input, Badge, Tabs, Modal, Pagination, etc.
├── 📂 constants/        # App constants (currencies, storage keys, etc.)
├── 📂 context/          # AppContext (global state)
├── 📂 data/             # Mock data (hotels, destinations, etc.)
├── 📂 hooks/            # Custom hooks (useDebounce, useFetch, useAnimatedCounter)
├── 📂 pages/            # All route pages
├── 📂 routes/           # Centralized routing with lazy loading
├── 📂 services/         # Mock API layer
├── 📂 styles/           # Global CSS / Tailwind
├── 📂 utils/            # Helpers, i18n config
├── App.jsx
└── main.jsx
```

## 💻 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/tripnest.git
cd tripnest

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Create an optimized production build in `/dist` |
| `npm run preview` | Preview the production build locally |

## 🚀 Deployment

### Deploy to Vercel

1. Push this repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Vercel auto-detects Vite. Ensure build settings are:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. The included `vercel.json` handles SPA routing so all routes work on refresh.

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Deploy to GitHub Pages

```bash
npm run build
# Configure your GitHub Pages source to the /dist folder
```

## 🔧 Environment Setup

No API keys are required - the app runs fully on mock data. If you later integrate a real backend, simply update the methods in `src/services/api.js` to make real HTTP calls while keeping the same interface.

---

Built with ❤️ as a showcase of modern React frontend engineering.
