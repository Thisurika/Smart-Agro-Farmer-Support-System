# 🌾 Smart Agro System
<div align="center">
![Smart Agro System](https://img.shields.io/badge/Smart%20Agro-System-brightgreen?style=for-the-badge&logo=leaf&logoColor=white)
![MERN](https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**A comprehensive full-stack agricultural management platform built with the MERN stack.**

*Empowering farmers and administrators with smart tools for crop management, chemical & fertilizer tracking, financial oversight, weather monitoring, and community feedback.*
</div>

---

## 📑 Table of Contents

1. [Project Overview](#-project-overview)
2. [Tech Stack & Dependencies](#-tech-stack--dependencies)
3. [Project Architecture](#-project-architecture)
4. [Complete Folder Structure](#-complete-folder-structure)
5. [Database Schemas](#-database-schemas)
6. [API Endpoints (RESTful)](#-api-endpoints-restful)
7. [Frontend Routes & Pages](#-frontend-routes--pages)
8. [Module Breakdown & CRUD Operations](#-module-breakdown--crud-operations)
9. [UI/UX Design System](#-uiux-design-system)
10. [Assets & Media Plan](#-assets--media-plan)
11. [Animations & Transitions](#-animations--transitions)
12. [Authentication & Authorization Flow](#-authentication--authorization-flow)
13. [Environment Variables](#-environment-variables)
14. [Installation & Setup](#-installation--setup)
15. [Development Timeline & Milestones](#-development-timeline--milestones)
16. [Testing Strategy](#-testing-strategy)
17. [Deployment Strategy](#-deployment-strategy)
18. [Contributing](#-contributing)

---

## 🌐 Project Overview

**Smart Agro System** is a role-based (User & Admin) agricultural management web application. It centralizes six core management modules into a single, elegant platform:

| # | Module | Description |
|----|------------------------------------|---------------------------------------------------------------------|
| 1 | **User Management** | Registration, authentication, profile management, role control |
| 2 | **Crop Management** | Full crop inventory with stock tracking, categorization, and purchasing |
| 3 | **Chemical & Fertilizer Mgmt.** | Chemical/fertilizer catalog with auto stock status and purchasing |
| 4 | **Financial Management** | Payments, purchasing flow, refund request & processing |
| 5 | **Feedback Management** | Reviews, star ratings, anonymous mode, support tickets |
| 6 | **Weather Monitoring** | Real-time weather forecasts, location management, rainfall records |

---

## 🛠 Tech Stack & Dependencies

### Frontend

| Technology | Purpose |
|-----------------------|----------------------------------------------|
| React 18+ | UI library |
| React Router DOM v6 | Client-side routing |
| Redux Toolkit | Global state management |
| Axios | HTTP client for API calls |
| Tailwind CSS 3+ | Utility-first CSS framework |
| Framer Motion | Page transitions & micro-animations |
| Lottie React | JSON-based vector animations |
| React Icons | Icon library (Fi, Hi, Bs, Ai icon sets) |
| React Hot Toast | Toast notifications |
| Recharts | Dashboard charts & analytics graphs |
| React Star Ratings | Star rating component for feedback |
| Swiper.js | Hero section & testimonial carousels |
| AOS (Animate On Scroll) | Scroll-based reveal animations |
| React Hook Form | Performant form handling |
| Yup | Schema validation |
| Day.js | Lightweight date formatting |
| React Leaflet | Interactive weather maps |
| React Skeleton Loader | Loading skeleton placeholders |

### Backend

| Technology | Purpose |
|------------------|---------------------------------------------|
| Node.js 18+ | Server runtime |
| Express.js 4+ | Web framework |
| MongoDB 7+ | NoSQL database |
| Mongoose 7+ | ODM for MongoDB |
| JSON Web Token | Authentication tokens (Access + Refresh) |
| bcryptjs | Password hashing |
| dotenv | Environment variable management |
| cors | Cross-Origin Resource Sharing |
| multer | File/image upload handling |
| cloudinary | Cloud image storage & CDN |
| express-validator | Request validation middleware |
| helmet | HTTP security headers |
| morgan | HTTP request logger |
| nodemailer | Transactional emails |
| express-rate-limit| API rate limiting |
| node-cron | Scheduled tasks (auto stock status update) |

### Dev Tools

| Tool | Purpose |
|-------------------|----------------------------------|
| Vite | Frontend build tool |
| Nodemon | Auto-restart dev server |
| Concurrently | Run frontend + backend together |
| ESLint + Prettier | Code quality & formatting |
| Jest + Supertest | Backend testing |
| React Testing Lib | Frontend testing |
| Postman | API testing & documentation |

---

## 🏗 Project Architecture

```text
┌───────────────────────────────────────────────────────────────────┐
│ CLIENT (React + Vite)                                             │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐      │
│ │ Pages    │ │Components│ │ Redux    │ │ Services (Axios) │      │
│ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────────┬─────────┘      │
│      └─────────────┴────────────┴────────────────┘                │
│                           │ HTTP/HTTPS                            │
└───────────────────────────┼───────────────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────────────┐
│ SERVER (Node.js + Express)                                        │
│ ┌──────────┐ ┌────────────┐ ┌────────────┐ ┌──────────────┐       │
│ │ Routes   │ │ Controllers│ │ Middleware │ │ Models       │       │
│ └────┬─────┘ └─────┬──────┘ └─────┬──────┘ └──────┬───────┘       │
│      └──────────────┴──────────────┴───────────────┘              │
│                           │ Mongoose ODM                          │
└───────────────────────────┼───────────────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────────────┐
│ DATABASE (MongoDB Atlas)                                          │
│ ┌────────┐ ┌──────┐ ┌───────────┐ ┌────────┐ ┌────────────┐       │
│ │ Users  │ │Crops │ │ Chemicals │ │Payments│ │ Feedbacks  │       │
│ └────────┘ └──────┘ └───────────┘ └────────┘ └────────────┘       │
│ ┌────────┐ ┌──────────┐ ┌─────────────┐                           │
│ │Tickets │ │ Weather  │ │RefundRequests│                          │
│ └────────┘ └──────────┘ └─────────────┘                           │
└───────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌───────────────────────────────────────────────────────────────────┐
│ EXTERNAL SERVICES                                                 │
│ ┌────────────┐ ┌──────────────┐ ┌────────────────────────┐        │
│ │ Cloudinary │ │ OpenWeather  │ │ Nodemailer (SMTP/Gmail)│        │
│ │ (Images)   │ │ API          │ │ (Email Notifications)  │        │
│ └────────────┘ └──────────────┘ └────────────────────────┘        │
└───────────────────────────────────────────────────────────────────┘
```

---

## 📁 Complete Folder Structure

```text
smart-agro-system/
│
├── 📄 README.md
├── 📄 .gitignore
├── 📄 package.json                       # Root package.json (concurrently scripts)
│
├── 📂 server/                            # ===== BACKEND =====
│   ├── 📄 package.json
│   ├── 📄 server.js                      # Entry point – Express app bootstrap
│   ├── 📄 .env                           # Environment variables (gitignored)
│   │
│   ├── 📂 config/
│   │   ├── 📄 db.js                      # MongoDB connection (Mongoose)
│   │   ├── 📄 cloudinary.js              # Cloudinary SDK configuration
│   │   └── 📄 email.js                   # Nodemailer transporter config
│   │
│   ├── 📂 models/
│   │   ├── 📄 User.js                    # User schema & model
│   │   ├── 📄 Crop.js                    # Crop schema & model
│   │   ├── 📄 Chemical.js                # Chemical/Fertilizer schema & model
│   │   ├── 📄 Payment.js                 # Payment schema & model
│   │   ├── 📄 RefundRequest.js           # Refund request schema & model
│   │   ├── 📄 Feedback.js                # Feedback schema & model
│   │   ├── 📄 Ticket.js                  # Support ticket schema & model
│   │   ├── 📄 Weather.js                 # Weather record schema & model
│   │   └── 📄 Location.js                # User location schema & model
│   │
│   ├── 📂 controllers/
│   │   ├── 📄 authController.js          # Login, signup, token refresh
│   │   ├── 📄 userController.js          # User CRUD (profile, admin ops)
│   │   ├── 📄 cropController.js          # Crop CRUD
│   │   ├── 📄 chemicalController.js      # Chemical/Fertilizer CRUD
│   │   ├── 📄 paymentController.js       # Payment CRUD & purchase flow
│   │   ├── 📄 refundController.js        # Refund request & processing
│   │   ├── 📄 feedbackController.js      # Feedback CRUD, ratings
│   │   ├── 📄 ticketController.js        # Ticket CRUD & admin replies
│   │   └── 📄 weatherController.js       # Weather & location CRUD
│   │
│   ├── 📂 routes/
│   │   ├── 📄 authRoutes.js              # /api/auth/*
│   │   ├── 📄 userRoutes.js              # /api/users/*
│   │   ├── 📄 cropRoutes.js              # /api/crops/*
│   │   ├── 📄 chemicalRoutes.js          # /api/chemicals/*
│   │   ├── 📄 paymentRoutes.js           # /api/payments/*
│   │   ├── 📄 refundRoutes.js            # /api/refunds/*
│   │   ├── 📄 feedbackRoutes.js          # /api/feedbacks/*
│   │   ├── 📄 ticketRoutes.js            # /api/tickets/*
│   │   └── 📄 weatherRoutes.js           # /api/weather/*
│   │
│   ├── 📂 middleware/
│   │   ├── 📄 authMiddleware.js          # JWT verification, protect routes
│   │   ├── 📄 adminMiddleware.js         # Admin role check
│   │   ├── 📄 errorHandler.js            # Global error handling middleware
│   │   ├── 📄 uploadMiddleware.js        # Multer + Cloudinary upload
│   │   └── 📄 rateLimiter.js             # API rate limiting
│   │
│   ├── 📂 utils/
│   │   ├── 📄 generateToken.js           # JWT token generation utility
│   │   ├── 📄 sendEmail.js               # Email sending utility
│   │   ├── 📄 apiError.js                # Custom error class
│   │   └── 📄 cronJobs.js                # Scheduled tasks (stock status auto-update)
│   │
│   ├── 📂 validators/
│   │   ├── 📄 authValidator.js           # Auth request validation rules
│   │   ├── 📄 userValidator.js           # User request validation rules
│   │   ├── 📄 cropValidator.js           # Crop request validation rules
│   │   ├── 📄 chemicalValidator.js       # Chemical request validation rules
│   │   ├── 📄 paymentValidator.js        # Payment request validation rules
│   │   ├── 📄 feedbackValidator.js       # Feedback request validation rules
│   │   ├── 📄 ticketValidator.js         # Ticket request validation rules
│   │   └── 📄 weatherValidator.js        # Weather request validation rules
│   │
│   └── 📂 seeds/
│       ├── 📄 adminSeed.js               # Default admin account seeder
│       └── 📄 dataSeed.js                # Sample data seeder (dev only)
│
├── 📂 client/                            # ===== FRONTEND =====
│   ├── 📄 package.json
│   ├── 📄 vite.config.js                 # Vite configuration
│   ├── 📄 tailwind.config.js             # Tailwind CSS configuration
│   ├── 📄 postcss.config.js              # PostCSS configuration
│   ├── 📄 index.html                     # HTML entry point
│   │
│   ├── 📂 public/
│   │   ├── 📄 favicon.ico                # App favicon (leaf/agro icon)
│   │   ├── 📄 logo192.png                # PWA icon 192x192
│   │   ├── 📄 logo512.png                # PWA icon 512x512
│   │   ├── 📄 manifest.json              # PWA manifest
│   │   └── 📄 robots.txt                 # SEO robots
│   │
│   └── 📂 src/
│       ├── 📄 main.jsx                   # React DOM render entry
│       ├── 📄 App.jsx                    # Root component, route definitions
│       ├── 📄 index.css                  # Global styles, Tailwind directives
│       │
│       ├── 📂 assets/                    # ===== STATIC ASSETS =====
│       │   ├── 📂 images/
│       │   │   ├── 📂 hero/
│       │   │   │   ├── 🖼 hero-banner-1.webp       # Main hero – aerial farm
│       │   │   │   ├── 🖼 hero-banner-2.webp       # Hero – golden wheat field
│       │   │   │   ├── 🖼 hero-banner-3.webp       # Hero – smart technology in farm
│       │   │   │   └── 🖼 hero-overlay.png         # Dark gradient overlay
│       │   │   │
│       │   │   ├── 📂 logo/
│       │   │   │   ├── 🖼 logo-full.svg            # Full logo with text
│       │   │   │   ├── 🖼 logo-icon.svg            # Icon-only logo (navbar compact)
│       │   │   │   ├── 🖼 logo-white.svg           # White version for dark bg
│       │   │   │   └── 🖼 logo-dark.svg            # Dark version for light bg
│       │   │   │
│       │   │   ├── 📂 backgrounds/
│       │   │   │   ├── 🖼 auth-bg.webp             # Login/Signup background
│       │   │   │   ├── 🖼 dashboard-pattern.svg    # Subtle pattern for dashboards
│       │   │   │   ├── 🖼 cta-bg.webp              # Call-to-action section bg
│       │   │   │   └── 🖼 footer-bg.webp           # Footer background
│       │   │   │
│       │   │   ├── 📂 crops/
│       │   │   │   ├── 🖼 crop-placeholder.webp    # Default crop image
│       │   │   │   ├── 🖼 rice.webp
│       │   │   │   ├── 🖼 wheat.webp
│       │   │   │   ├── 🖼 corn.webp
│       │   │   │   └── 🖼 vegetables.webp
│       │   │   │
│       │   │   ├── 📂 chemicals/
│       │   │   │   ├── 🖼 chemical-placeholder.webp # Default chemical image
│       │   │   │   ├── 🖼 fertilizer-bag.webp
│       │   │   │   └── 🖼 pesticide-bottle.webp
│       │   │   │
│       │   │   ├── 📂 weather/
│       │   │   │   ├── 🖼 sunny.webp
│       │   │   │   ├── 🖼 cloudy.webp
│       │   │   │   ├── 🖼 rainy.webp
│       │   │   │   └── 🖼 weather-map-bg.webp
│       │   │   │
│       │   │   ├── 📂 illustrations/
│       │   │   │   ├── 🖼 empty-state.svg          # No data illustration
│       │   │   │   ├── 🖼 success.svg              # Success state illustration
│       │   │   │   ├── 🖼 error-404.svg            # 404 page illustration
│       │   │   │   ├── 🖼 farming-illustration.svg # About/features section
│       │   │   │   └── 🖼 smart-farming.svg        # Technology + farming
│       │   │   │
│       │   │   └── 📂 avatars/
│       │   │       ├── 🖼 default-avatar.webp      # Default user avatar
│       │   │       └── 🖼 admin-avatar.webp        # Default admin avatar
│       │   │
│       │   ├── 📂 animations/               # Lottie JSON animations
│       │   │   ├── 📄 loading-spinner.json       # Global loading spinner
│       │   │   ├── 📄 success-checkmark.json     # Success action animation
│       │   │   ├── 📄 farm-tractor.json          # Hero section tractor
│       │   │   ├── 📄 growing-plant.json         # Crop section plant growth
│       │   │   ├── 📄 weather-sun.json           # Weather sunny animation
│       │   │   ├── 📄 weather-rain.json          # Weather rain animation
│       │   │   ├── 📄 payment-success.json       # Payment completed
│       │   │   ├── 📄 empty-box.json             # Empty state animation
│       │   │   ├── 📄 error-warning.json         # Error state animation
│       │   │   └── 📄 welcome-wave.json          # Dashboard welcome animation
│       │   │
│       │   ├── 📂 icons/
│       │   │   ├── 🖼 crop-icon.svg
│       │   │   ├── 🖼 chemical-icon.svg
│       │   │   ├── 🖼 weather-icon.svg
│       │   │   ├── 🖼 payment-icon.svg
│       │   │   ├── 🖼 feedback-icon.svg
│       │   │   └── 🖼 user-icon.svg
│       │   │
│       │   └── 📂 fonts/
│       │       ├── 📄 Inter-Variable.woff2       # Primary font
│       │       └── 📄 Poppins-Variable.woff2     # Heading font
│       │
│       ├── 📂 components/                # ===== REUSABLE COMPONENTS =====
│       │   ├── 📂 common/
│       │   │   ├── 📄 Navbar.jsx               # Main navigation bar
│       │   │   ├── 📄 Footer.jsx               # Site footer
│       │   │   ├── 📄 Sidebar.jsx              # Admin dashboard sidebar
│       │   │   ├── 📄 Button.jsx               # Reusable button component
│       │   │   ├── 📄 Modal.jsx                # Reusable modal dialog
│       │   │   ├── 📄 ConfirmDialog.jsx        # Delete/action confirmation
│       │   │   ├── 📄 Loader.jsx               # Lottie loading animation
│       │   │   ├── 📄 SkeletonCard.jsx         # Skeleton loading placeholder
│       │   │   ├── 📄 EmptyState.jsx           # No data display
│       │   │   ├── 📄 Breadcrumb.jsx           # Page breadcrumb navigation
│       │   │   ├── 📄 Pagination.jsx           # Table/list pagination
│       │   │   ├── 📄 SearchBar.jsx            # Global search input
│       │   │   ├── 📄 Badge.jsx                # Status badge (In Stock, etc.)
│       │   │   ├── 📄 Avatar.jsx               # User avatar component
│       │   │   ├── 📄 StarRating.jsx           # Star rating display/input
│       │   │   ├── 📄 StatsCard.jsx            # Dashboard statistics card
│       │   │   ├── 📄 DataTable.jsx            # Reusable data table
│       │   │   ├── 📄 FileUpload.jsx           # Drag & drop image upload
│       │   │   ├── 📄 Tooltip.jsx              # Hover tooltip
│       │   │   ├── 📄 Dropdown.jsx             # Custom dropdown select
│       │   │   ├── 📄 Tabs.jsx                 # Tab navigation component
│       │   │   ├── 📄 Alert.jsx                # Inline alert messages
│       │   │   └── 📄 ScrollToTop.jsx          # Scroll restoration
│       │   │
│       │   ├── 📂 layout/
│       │   │   ├── 📄 MainLayout.jsx           # Public pages layout (Navbar + Footer)
│       │   │   ├── 📄 DashboardLayout.jsx      # Dashboard layout (Sidebar + TopBar)
│       │   │   ├── 📄 AuthLayout.jsx           # Auth pages layout (centered card)
│       │   │   └── 📄 AdminLayout.jsx          # Admin panel layout
│       │   │
│       │   ├── 📂 home/
│       │   │   ├── 📄 HeroSection.jsx          # Animated hero with carousel
│       │   │   ├── 📄 FeaturesSection.jsx      # Feature cards grid
│       │   │   ├── 📄 AboutSection.jsx         # About the platform
│       │   │   ├── 📄 HowItWorksSection.jsx    # Step-by-step process
│       │   │   ├── 📄 TestimonialsSection.jsx  # User testimonials carousel
│       │   │   ├── 📄 StatsCounterSection.jsx  # Animated counters
│       │   │   ├── 📄 CTASection.jsx           # Call to action
│       │   │   └── 📄 NewsletterSection.jsx    # Newsletter signup
│       │   │
│       │   ├── 📂 auth/
│       │   │   ├── 📄 LoginForm.jsx            # Login form component
│       │   │   ├── 📄 SignupForm.jsx           # Signup form component
│       │   │   ├── 📄 ForgotPasswordForm.jsx   # Forgot password form
│       │   │   └── 📄 SocialAuthButtons.jsx    # Google/GitHub OAuth (optional)
│       │   │
│       │   ├── 📂 user/
│       │   │   ├── 📄 ProfileCard.jsx          # User profile display card
│       │   │   ├── 📄 ProfileEditForm.jsx      # Edit profile form
│       │   │   ├── 📄 ChangePasswordForm.jsx   # Change password form
│       │   │   └── 📄 DeleteAccountModal.jsx   # Account deletion confirmation
│       │   │
│       │   ├── 📂 crops/
│       │   │   ├── 📄 CropCard.jsx             # Individual crop card
│       │   │   ├── 📄 CropGrid.jsx             # Grid display of crops
│       │   │   ├── 📄 CropFilter.jsx           # Category filter sidebar
│       │   │   ├── 📄 CropDetailView.jsx       # Crop detail modal/page
│       │   │   ├── 📄 CropForm.jsx             # Add/Edit crop form (Admin)
│       │   │   └── 📄 CropStockBadge.jsx       # In/Out stock indicator
│       │   │
│       │   ├── 📂 chemicals/
│       │   │   ├── 📄 ChemicalCard.jsx         # Chemical/Fertilizer card
│       │   │   ├── 📄 ChemicalGrid.jsx         # Grid display
│       │   │   ├── 📄 ChemicalFilter.jsx       # Category filter
│       │   │   ├── 📄 ChemicalDetailView.jsx   # Detail view
│       │   │   ├── 📄 ChemicalForm.jsx         # Add/Edit form (Admin)
│       │   │   └── 📄 ChemicalStockBadge.jsx   # Stock status indicator
│       │   │
│       │   ├── 📂 financial/
│       │   │   ├── 📄 CartItem.jsx             # Shopping cart item
│       │   │   ├── 📄 CartSummary.jsx          # Cart total summary
│       │   │   ├── 📄 CheckoutForm.jsx         # Payment checkout form
│       │   │   ├── 📄 PaymentCard.jsx          # Payment history card
│       │   │   ├── 📄 RefundRequestForm.jsx    # Refund request form
│       │   │   ├── 📄 RefundStatusBadge.jsx    # Refund status indicator
│       │   │   └── 📄 InvoiceTemplate.jsx      # Printable invoice
│       │   │
│       │   ├── 📂 feedback/
│       │   │   ├── 📄 FeedbackCard.jsx         # Feedback display card
│       │   │   ├── 📄 FeedbackForm.jsx         # Create/edit feedback form
│       │   │   ├── 📄 FeedbackList.jsx         # Feedback listing
│       │   │   ├── 📄 RatingSummary.jsx        # Average rating display
│       │   │   ├── 📄 TicketCard.jsx           # Support ticket card
│       │   │   ├── 📄 TicketForm.jsx           # Create/edit ticket form
│       │   │   ├── 📄 TicketTimeline.jsx       # Ticket status timeline
│       │   │   └── 📄 AdminReplyForm.jsx       # Admin ticket/feedback reply
│       │   │
│       │   ├── 📂 weather/
│       │   │   ├── 📄 WeatherWidget.jsx        # Current weather display
│       │   │   ├── 📄 WeatherForecast.jsx      # Multi-day forecast
│       │   │   ├── 📄 LocationSelector.jsx     # Add/select location
│       │   │   ├── 📄 WeatherMap.jsx           # Leaflet weather map
│       │   │   ├── 📄 RainfallChart.jsx        # Rainfall data chart
│       │   │   └── 📄 WeatherRecordForm.jsx    # Admin weather record form
│       │   │
│       │   └── 📂 dashboard/
│       │       ├── 📄 UserDashboardOverview.jsx  # User dashboard overview
│       │       ├── 📄 AdminDashboardOverview.jsx # Admin dashboard overview
│       │       ├── 📄 RevenueChart.jsx          # Revenue line/bar chart
│       │       ├── 📄 OrdersChart.jsx           # Orders pie/doughnut chart
│       │       ├── 📄 RecentActivities.jsx      # Recent activity feed
│       │       ├── 📄 TopSellingCrops.jsx       # Top crops widget
│       │       ├── 📄 UserGrowthChart.jsx       # User registration chart
│       │       └── 📄 QuickActions.jsx          # Quick action buttons
│       │
│       ├── 📂 pages/                     # ===== PAGE COMPONENTS =====
│       │   ├── 📂 public/
│       │   │   ├── 📄 HomePage.jsx            # Landing page
│       │   │   ├── 📄 AboutPage.jsx           # About Smart Agro
│       │   │   ├── 📄 ContactPage.jsx         # Contact form page
│       │   │   ├── 📄 NotFoundPage.jsx        # 404 error page
│       │   │   └── 📄 ServerErrorPage.jsx     # 500 error page
│       │   │
│       │   ├── 📂 auth/
│       │   │   ├── 📄 LoginPage.jsx           # Login page
│       │   │   ├── 📄 SignupPage.jsx          # Registration page
│       │   │   ├── 📄 ForgotPasswordPage.jsx  # Password recovery
│       │   │   └── 📄 ResetPasswordPage.jsx   # Reset password (via email link)
│       │   │
│       │   ├── 📂 user/
│       │   │   ├── 📄 UserDashboardPage.jsx   # User dashboard home
│       │   │   ├── 📄 UserProfilePage.jsx     # Profile view & edit
│       │   │   ├── 📄 ChangePasswordPage.jsx  # Change password
│       │   │   ├── 📄 CropBrowsePage.jsx      # Browse all crops
│       │   │   ├── 📄 CropDetailPage.jsx      # Single crop details
│       │   │   ├── 📄 ChemicalBrowsePage.jsx  # Browse chemicals & fertilizers
│       │   │   ├── 📄 ChemicalDetailPage.jsx  # Single chemical details
│       │   │   ├── 📄 CartPage.jsx            # Shopping cart
│       │   │   ├── 📄 CheckoutPage.jsx        # Checkout & payment
│       │   │   ├── 📄 PaymentHistoryPage.jsx  # Past payments
│       │   │   ├── 📄 RefundRequestPage.jsx   # Request refund
│       │   │   ├── 📄 FeedbackPage.jsx        # View/create feedback
│       │   │   ├── 📄 MyTicketsPage.jsx       # View user tickets
│       │   │   ├── 📄 CreateTicketPage.jsx    # Raise a new ticket
│       │   │   ├── 📄 TicketDetailPage.jsx    # Single ticket view
│       │   │   ├── 📄 WeatherPage.jsx         # Weather dashboard
│       │   │   └── 📄 LocationManagePage.jsx  # Manage saved locations
│       │   │
│       │   └── 📂 admin/
│       │       ├── 📄 AdminDashboardPage.jsx  # Admin dashboard home
│       │       ├── 📄 AdminProfilePage.jsx    # Admin profile
│       │       ├── 📄 UserListPage.jsx        # All users list
│       │       ├── 📄 CreateUserPage.jsx      # Create new user/admin
│       │       ├── 📄 UserDetailPage.jsx      # User detail (admin view)
│       │       ├── 📄 CropManagePage.jsx      # Crop management table
│       │       ├── 📄 CropAddEditPage.jsx     # Add/Edit crop form page
│       │       ├── 📄 ChemicalManagePage.jsx  # Chemical management table
│       │       ├── 📄 ChemicalAddEditPage.jsx # Add/Edit chemical form page
│       │       ├── 📄 PaymentListPage.jsx     # All payments overview
│       │       ├── 📄 RefundManagePage.jsx    # Refund requests management
│       │       ├── 📄 FeedbackManagePage.jsx  # All feedbacks management
│       │       ├── 📄 RatingOverviewPage.jsx  # Rating analytics
│       │       ├── 📄 TicketManagePage.jsx    # All tickets management
│       │       ├── 📄 TicketReplyPage.jsx     # Reply to ticket
│       │       ├── 📄 WeatherRecordsPage.jsx  # Weather records management
│       │       └── 📄 WeatherAddEditPage.jsx  # Add/Edit weather record
│       │
│       ├── 📂 redux/                     # ===== STATE MANAGEMENT =====
│       │   ├── 📄 store.js                   # Redux store configuration
│       │   │
│       │   └── 📂 slices/
│       │       ├── 📄 authSlice.js          # Auth state (login, token, user)
│       │       ├── 📄 userSlice.js          # User management state
│       │       ├── 📄 cropSlice.js          # Crop management state
│       │       ├── 📄 chemicalSlice.js      # Chemical management state
│       │       ├── 📄 cartSlice.js          # Shopping cart state
│       │       ├── 📄 paymentSlice.js       # Payment state
│       │       ├── 📄 refundSlice.js        # Refund state
│       │       ├── 📄 feedbackSlice.js      # Feedback state
│       │       ├── 📄 ticketSlice.js        # Ticket state
│       │       ├── 📄 weatherSlice.js       # Weather state
│       │       └── 📄 uiSlice.js            # UI state (sidebar, theme, modals)
│       │
│       ├── 📂 services/                  # ===== API SERVICE LAYER =====
│       │   ├── 📄 api.js                     # Axios instance & interceptors
│       │   ├── 📄 authService.js             # Auth API calls
│       │   ├── 📄 userService.js             # User API calls
│       │   ├── 📄 cropService.js             # Crop API calls
│       │   ├── 📄 chemicalService.js         # Chemical API calls
│       │   ├── 📄 paymentService.js          # Payment API calls
│       │   ├── 📄 refundService.js           # Refund API calls
│       │   ├── 📄 feedbackService.js         # Feedback API calls
│       │   ├── 📄 ticketService.js           # Ticket API calls
│       │   └── 📄 weatherService.js          # Weather API calls
│       │
│       ├── 📂 hooks/                     # ===== CUSTOM HOOKS =====
│       │   ├── 📄 useAuth.js                 # Auth state & actions hook
│       │   ├── 📄 useDebounce.js             # Debounce hook for search
│       │   ├── 📄 useOutsideClick.js         # Click outside detection
│       │   ├── 📄 useMediaQuery.js           # Responsive breakpoint hook
│       │   ├── 📄 useLocalStorage.js         # LocalStorage hook
│       │   └── 📄 useScrollPosition.js       # Scroll position tracking
│       │
│       ├── 📂 utils/                     # ===== UTILITY FUNCTIONS =====
│       │   ├── 📄 constants.js               # App-wide constants
│       │   ├── 📄 formatters.js              # Date, currency, number formatters
│       │   ├── 📄 validators.js              # Client-side validation helpers
│       │   ├── 📄 helpers.js                 # General helper functions
│       │   └── 📄 protectedRoute.jsx         # Route guard HOC
│       │
│       └── 📂 styles/
│           ├── 📄 animations.css            # Custom CSS animations & keyframes
│           └── 📄 scrollbar.css             # Custom scrollbar styles
```

---

## 🗄 Database Schemas

### 1. User Schema (`server/models/User.js`)

```javascript
{
 firstName: { type: String, required: true, trim: true },
 lastName: { type: String, required: true, trim: true },
 email: { type: String, required: true, unique: true, lowercase: true },
 password: { type: String, required: true, minlength: 8 },
 phone: { type: String },
 address: { type: String },
 avatar: { type: String, default: "default-avatar.webp" },
 role: { type: String, enum: ["user", "admin"], default: "user" },
 isActive: { type: Boolean, default: true },
 refreshToken: { type: String },
 resetPasswordToken: { type: String },
 resetPasswordExpires: { type: Date },
 createdAt: { type: Date, default: Date.now },
 updatedAt: { type: Date, default: Date.now }
}
```

### 2. Crop Schema (`server/models/Crop.js`)

```javascript
{
 name: { type: String, required: true, trim: true },
 description: { type: String, required: true },
 category: { type: String, required: true, enum: [
 "Grains", "Vegetables", "Fruits", "Pulses",
 "Oilseeds", "Spices", "Cash Crops", "Other"
 ]},
 price: { type: Number, required: true, min: 0 },
 quantity: { type: Number, required: true, min: 0 },
 unit: { type: String, required: true, enum: ["kg", "ton", "lb", "unit"] },
 image: { type: String, default: "crop-placeholder.webp" },
 status: { type: String, enum: ["In Stock", "Out of Stock"], default: "In Stock" },
 harvestDate: { type: Date },
 origin: { type: String },
 averageRating: { type: Number, default: 0, min: 0, max: 5 },
 totalReviews: { type: Number, default: 0 },
 addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
 createdAt: { type: Date, default: Date.now },
 updatedAt: { type: Date, default: Date.now }
}
// Pre-save middleware: auto-set status to "Out of Stock" when quantity === 0
```

### 3. Chemical Schema (`server/models/Chemical.js`)

```javascript
{
 name: { type: String, required: true, trim: true },
 description: { type: String, required: true },
 type: { type: String, required: true, enum: [
 "Fertilizer", "Pesticide", "Herbicide", "Fungicide",
 "Insecticide", "Growth Regulator", "Other"
 ]},
 category: { type: String, required: true },
 brand: { type: String },
 price: { type: Number, required: true, min: 0 },
 quantity: { type: Number, required: true, min: 0 },
 unit: { type: String, required: true, enum: ["litre", "kg", "ml", "g", "unit"] },
 image: { type: String, default: "chemical-placeholder.webp" },
 status: { type: String, enum: ["In Stock", "Out of Stock"], default: "In Stock" },
 applicationMethod: { type: String },
 safetyInstructions: { type: String },
 averageRating: { type: Number, default: 0, min: 0, max: 5 },
 totalReviews: { type: Number, default: 0 },
 addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
 createdAt: { type: Date, default: Date.now },
 updatedAt: { type: Date, default: Date.now }
}
// Pre-save middleware: auto-set status to "Out of Stock" when quantity === 0
```

### 4. Payment Schema (`server/models/Payment.js`)

```javascript
{
 user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
 items: [{
 itemType: { type: String, enum: ["Crop", "Chemical"], required: true },
 item: { type: mongoose.Schema.Types.ObjectId, refPath: "items.itemType" },
 name: { type: String, required: true },
 quantity: { type: Number, required: true, min: 1 },
 unitPrice: { type: Number, required: true },
 totalPrice: { type: Number, required: true }
 }],
 totalAmount: { type: Number, required: true },
 paymentMethod: { type: String, enum: ["Credit Card", "Debit Card", "Bank Transfer", "Cash"], required: true },
 paymentStatus: { type: String, enum: ["Pending", "Completed", "Failed", "Refunded"], default: "Pending" },
 transactionId: { type: String, unique: true },
 billingAddress: { type: String },
 notes: { type: String },
 createdAt: { type: Date, default: Date.now },
 updatedAt: { type: Date, default: Date.now }
}
```

### 5. RefundRequest Schema (`server/models/RefundRequest.js`)

```javascript
{
 payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment", required: true },
 user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
 reason: { type: String, required: true },
 amount: { type: Number, required: true },
 status: { type: String, enum: ["Pending", "Accepted", "Rejected", "Processed"], default: "Pending" },
 adminResponse: { type: String },
 processedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
 processedAt: { type: Date },
 createdAt: { type: Date, default: Date.now },
 updatedAt: { type: Date, default: Date.now }
}
```

### 6. Feedback Schema (`server/models/Feedback.js`)

```javascript
{
 user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
 targetType: { type: String, enum: ["Crop", "Chemical", "AI Advice"], required: true },
 target: { type: mongoose.Schema.Types.ObjectId, refPath: "targetType" },
 comment: { type: String, required: true },
 rating: { type: Number, required: true, min: 1, max: 5 },
 isAnonymous: { type: Boolean, default: false },
 adminReply: { type: String },
 repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
 repliedAt: { type: Date },
 createdAt: { type: Date, default: Date.now },
 updatedAt: { type: Date, default: Date.now }
}
```

### 7. Ticket Schema (`server/models/Ticket.js`)

```javascript
{
 user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
 subject: { type: String, required: true },
 description: { type: String, required: true },
 category: { type: String, required: true, enum: [
 "Crop Issue", "Chemical Issue", "Payment Issue",
 "Account Issue", "Technical Issue", "Other"
 ]},
 priority: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },
 status: { type: String, enum: ["Open", "In Progress", "Resolved", "Closed"], default: "Open" },
 adminReplies: [{
 message: { type: String, required: true },
 repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
 repliedAt: { type: Date, default: Date.now }
 }],
 attachments: [{ type: String }],
 createdAt: { type: Date, default: Date.now },
 updatedAt: { type: Date, default: Date.now }
}
// Note: User can update ticket only when status is "Open" or "In Progress"
```

### 8. Weather Schema (`server/models/Weather.js`)

```javascript
{
 location: { type: String, required: true },
 date: { type: Date, required: true },
 temperature: { min: Number, max: Number, avg: Number },
 humidity: { type: Number },
 rainfall: { type: Number, default: 0 },
 windSpeed: { type: Number },
 weatherCondition:{ type: String, enum: [
 "Sunny", "Cloudy", "Rainy", "Stormy",
 "Windy", "Foggy", "Snowy", "Partly Cloudy"
 ]},
 forecast: { type: String },
 addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
 createdAt: { type: Date, default: Date.now },
 updatedAt: { type: Date, default: Date.now }
}
```

### 9. Location Schema (`server/models/Location.js`)

```javascript
{
 user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
 name: { type: String, required: true },
 latitude: { type: Number, required: true },
 longitude: { type: Number, required: true },
 city: { type: String },
 country: { type: String },
 isDefault: { type: Boolean, default: false },
 createdAt: { type: Date, default: Date.now },
 updatedAt: { type: Date, default: Date.now }
}
```

---

## 🔌 API Endpoints (RESTful)

**Base URL:** `http://localhost:5000/api`

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Access | Description |
|--------|---------------------------|---------|---------------------------------|
| POST | `/api/auth/signup` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login (User & Admin) |
| POST | `/api/auth/logout` | Private | Logout & invalidate token |
| POST | `/api/auth/refresh-token` | Private | Refresh access token |
| POST | `/api/auth/forgot-password`| Public | Send password reset email |
| PUT | `/api/auth/reset-password/:token` | Public | Reset password via token |

### User Routes (`/api/users`)

| Method | Endpoint | Access | Description |
|--------|-------------------------------|--------|--------------------------------------|
| GET | `/api/users/profile` | User | Get logged-in user profile |
| PUT | `/api/users/profile` | User | Update user profile |
| PUT | `/api/users/change-password` | User | Change user password |
| DELETE | `/api/users/profile` | User | Delete own account |
| GET | `/api/users` | Admin | Get all users list |
| GET | `/api/users/:id` | Admin | Get single user details |
| POST | `/api/users` | Admin | Create new user/admin |
| PUT | `/api/users/:id/role` | Admin | Change user role |
| PUT | `/api/users/admin/change-password` | Admin | Change admin password |
| DELETE | `/api/users/:id` | Admin | Delete a user |

### Crop Routes (`/api/crops`)

| Method | Endpoint | Access | Description |
|--------|-------------------------------|--------|--------------------------------------|
| GET | `/api/crops` | User | Get all crops (with filters/sort) |
| GET | `/api/crops/in-stock` | User | Get in-stock crops only |
| GET | `/api/crops/out-of-stock` | User | Get out-of-stock crops only |
| GET | `/api/crops/categories` | User | Get crop category list |
| GET | `/api/crops/:id` | User | Get single crop details |
| POST | `/api/crops` | Admin | Add a new crop |
| PUT | `/api/crops/:id` | Admin | Update crop details |
| PATCH | `/api/crops/:id/status` | Admin | Toggle crop stock status |
| DELETE | `/api/crops/:id` | Admin | Delete a crop |

### Chemical & Fertilizer Routes (`/api/chemicals`)

| Method | Endpoint | Access | Description |
|--------|-----------------------------------|--------|--------------------------------------|
| GET | `/api/chemicals` | User | Get all chemicals (with filters) |
| GET | `/api/chemicals/in-stock` | User | Get in-stock chemicals only |
| GET | `/api/chemicals/out-of-stock` | User | Get out-of-stock chemicals only |
| GET | `/api/chemicals/categories` | User | Get chemical category list |
| GET | `/api/chemicals/:id` | User | Get single chemical details |
| POST | `/api/chemicals` | Admin | Add a new chemical/fertilizer |
| PUT | `/api/chemicals/:id` | Admin | Update chemical details |
| PATCH | `/api/chemicals/:id/status` | Admin | Toggle stock status |
| DELETE | `/api/chemicals/:id` | Admin | Delete a chemical/fertilizer |

### Payment Routes (`/api/payments`)

| Method | Endpoint | Access | Description |
|--------|-----------------------------------|--------|--------------------------------------|
| POST | `/api/payments` | User | Create a new payment (purchase) |
| GET | `/api/payments/my-payments` | User | Get logged-in user's payments |
| GET | `/api/payments/:id` | User | Get single payment detail |
| GET | `/api/payments` | Admin | Get all payments |
| DELETE | `/api/payments/:id` | Admin | Delete a payment record |

### Refund Routes (`/api/refunds`)

| Method | Endpoint | Access | Description |
|--------|-----------------------------------|--------|--------------------------------------|
| POST | `/api/refunds` | User | Create a refund request |
| GET | `/api/refunds/my-requests` | User | Get user's refund requests |
| GET | `/api/refunds` | Admin | Get all refund requests |
| PUT | `/api/refunds/:id/accept` | Admin | Accept a refund request |
| PUT | `/api/refunds/:id/reject` | Admin | Reject a refund request |
| PUT | `/api/refunds/:id/process` | Admin | Process accepted refund |
| DELETE | `/api/refunds/:id` | Admin | Delete a refund request |

### Feedback Routes (`/api/feedbacks`)

| Method | Endpoint | Access | Description |
|--------|-----------------------------------|--------|--------------------------------------|
| POST | `/api/feedbacks` | User | Create a new feedback |
| GET | `/api/feedbacks` | Public | Get all feedbacks (read) |
| GET | `/api/feedbacks/my-feedbacks` | User | Get user's own feedbacks |
| GET | `/api/feedbacks/ratings-summary` | Admin | Get ratings order/summary |
| GET | `/api/feedbacks/:id` | Public | Get single feedback |
| PUT | `/api/feedbacks/:id` | User | Update own feedback |
| PATCH | `/api/feedbacks/:id/toggle-anonymous` | User | Toggle anonymous mode |
| DELETE | `/api/feedbacks/:id` | User/Admin | Delete a feedback |
| PUT | `/api/feedbacks/:id/reply` | Admin | Reply to a feedback |

### Ticket Routes (`/api/tickets`)

| Method | Endpoint | Access | Description |
|--------|-----------------------------------|--------|--------------------------------------|
| POST | `/api/tickets` | User | Raise a new support ticket |
| GET | `/api/tickets/my-tickets` | User | Get user's own tickets |
| GET | `/api/tickets/:id` | User | Get single ticket detail |
| PUT | `/api/tickets/:id` | User | Update ticket (Open/In Progress) |
| DELETE | `/api/tickets/:id` | User/Admin | Delete a ticket |
| GET | `/api/tickets` | Admin | Get all tickets |
| PUT | `/api/tickets/:id/accept` | Admin | Accept a ticket |
| PUT | `/api/tickets/:id/reply` | Admin | Reply to a ticket |
| PUT | `/api/tickets/:id/close` | Admin | Close/resolve a ticket |

### Weather Routes (`/api/weather`)

| Method | Endpoint | Access | Description |
|--------|-----------------------------------------|--------|-----------------------------------|
| POST | `/api/weather/locations` | User | Add a new location |
| GET | `/api/weather/locations` | User | Get user's saved locations |
| PUT | `/api/weather/locations/:id` | User | Update a location |
| DELETE | `/api/weather/locations/:id` | User | Delete a location |
| GET | `/api/weather/forecast/:locationId` | User | Get real-time weather forecast |
| POST | `/api/weather/records` | Admin | Add a new weather record |
| GET | `/api/weather/records` | Admin | Get all weather records |
| PUT | `/api/weather/records/:id` | Admin | Update rainfall data |
| DELETE | `/api/weather/records/:id` | Admin | Delete a weather record |

---

## 🖥 Frontend Routes & Pages

### Public Routes

| Route | Page Component | Description |
|--------------------------|------------------------------|--------------------------------|
| `/` | `HomePage.jsx` | Landing page with hero |
| `/about` | `AboutPage.jsx` | About the platform |
| `/contact` | `ContactPage.jsx` | Contact form |
| `/login` | `LoginPage.jsx` | User & Admin login |
| `/signup` | `SignupPage.jsx` | User registration |
| `/forgot-password` | `ForgotPasswordPage.jsx` | Password recovery |
| `/reset-password/:token` | `ResetPasswordPage.jsx` | Reset via email link |
| `*` | `NotFoundPage.jsx` | 404 error page |

### User Routes (Protected — requires `role: "user"`)

| Route | Page Component | Description |
|---------------------------------|-------------------------------|----------------------------------|
| `/user/dashboard` | `UserDashboardPage.jsx` | User overview dashboard |
| `/user/profile` | `UserProfilePage.jsx` | View & edit profile |
| `/user/change-password` | `ChangePasswordPage.jsx` | Change password |
| `/user/crops` | `CropBrowsePage.jsx` | Browse crops catalog |
| `/user/crops/:id` | `CropDetailPage.jsx` | Single crop details + buy |
| `/user/chemicals` | `ChemicalBrowsePage.jsx` | Browse chemicals catalog |
| `/user/chemicals/:id` | `ChemicalDetailPage.jsx` | Single chemical details + buy |
| `/user/cart` | `CartPage.jsx` | Shopping cart |
| `/user/checkout` | `CheckoutPage.jsx` | Payment checkout |
| `/user/payments` | `PaymentHistoryPage.jsx` | Payment history |
| `/user/refund-request` | `RefundRequestPage.jsx` | Request a refund |
| `/user/feedback` | `FeedbackPage.jsx` | View/Create feedback |
| `/user/tickets` | `MyTicketsPage.jsx` | View support tickets |
| `/user/tickets/new` | `CreateTicketPage.jsx` | Raise new ticket |
| `/user/tickets/:id` | `TicketDetailPage.jsx` | Ticket detail & updates |
| `/user/weather` | `WeatherPage.jsx` | Weather dashboard |
| `/user/weather/locations` | `LocationManagePage.jsx` | Manage locations |

### Admin Routes (Protected — requires `role: "admin"`)

| Route | Page Component | Description |
|---------------------------------|-------------------------------|----------------------------------|
| `/admin/dashboard` | `AdminDashboardPage.jsx` | Admin overview dashboard |
| `/admin/profile` | `AdminProfilePage.jsx` | Admin profile & password |
| `/admin/users` | `UserListPage.jsx` | All users management |
| `/admin/users/create` | `CreateUserPage.jsx` | Create user/admin account |
| `/admin/users/:id` | `UserDetailPage.jsx` | User detail & role change |
| `/admin/crops` | `CropManagePage.jsx` | All crops management |
| `/admin/crops/new` | `CropAddEditPage.jsx` | Add new crop |
| `/admin/crops/:id/edit` | `CropAddEditPage.jsx` | Edit existing crop |
| `/admin/chemicals` | `ChemicalManagePage.jsx` | All chemicals management |
| `/admin/chemicals/new` | `ChemicalAddEditPage.jsx` | Add new chemical |
| `/admin/chemicals/:id/edit` | `ChemicalAddEditPage.jsx` | Edit existing chemical |
| `/admin/payments` | `PaymentListPage.jsx` | All payments management |
| `/admin/refunds` | `RefundManagePage.jsx` | Refund requests management |
| `/admin/feedbacks` | `FeedbackManagePage.jsx` | All feedbacks management |
| `/admin/ratings` | `RatingOverviewPage.jsx` | Rating analytics & ordering |
| `/admin/tickets` | `TicketManagePage.jsx` | All tickets management |
| `/admin/tickets/:id/reply` | `TicketReplyPage.jsx` | Reply to ticket |
| `/admin/weather` | `WeatherRecordsPage.jsx` | Weather records management |
| `/admin/weather/new` | `WeatherAddEditPage.jsx` | Add weather record |
| `/admin/weather/:id/edit` | `WeatherAddEditPage.jsx` | Edit weather record |

---

## 📋 Module Breakdown & CRUD Operations

### Module 1: User Management

#### User Role Operations

| Operation | CRUD | Frontend Action | API Endpoint |
|-------------------|--------|-----------------------------------------|----------------------------------|
| Sign Up | CREATE | Fill signup form → submit | `POST /api/auth/signup` |
| Log In | READ | Fill login form → authenticate | `POST /api/auth/login` |
| View Profile | READ | Navigate to profile page | `GET /api/users/profile` |
| Update Profile | UPDATE | Edit profile form → save | `PUT /api/users/profile` |
| Change Password | UPDATE | Enter old/new password → save | `PUT /api/users/change-password` |
| Delete Account | DELETE | Confirm dialog → delete | `DELETE /api/users/profile` |

#### Admin Role Operations

| Operation | CRUD | Frontend Action | API Endpoint |
|-----------------------|--------|--------------------------------------|----------------------------------|
| Log In (only) | READ | Fill admin login form | `POST /api/auth/login` |
| Create User | CREATE | Fill user creation form | `POST /api/users` |
| Create Admin | CREATE | Fill admin creation form | `POST /api/users` (role: admin) |
| View User List | READ | Navigate to user management | `GET /api/users` |
| Change User Role | UPDATE | Toggle role dropdown → save | `PUT /api/users/:id/role` |
| Change Admin Password | UPDATE | Enter new password → save | `PUT /api/users/admin/change-password` |
| Delete User | DELETE | Select user → confirm → delete | `DELETE /api/users/:id` |

---

### Module 2: Crop Management

#### User Role Operations

| Operation | CRUD | Frontend Action | API Endpoint |
|-----------------------------|--------|--------------------------------------------|-----------------------------|
| View All Crops | READ | Browse crop catalog page | `GET /api/crops` |
| View In-Stock Crops | READ | Filter tab: In Stock | `GET /api/crops/in-stock` |
| View Out-of-Stock Crops | READ | Filter tab: Out of Stock | `GET /api/crops/out-of-stock` |
| Sort by Category | READ | Select category from filter sidebar | `GET /api/crops?category=X` |
| Buy Available Crop | CREATE | Add to cart → checkout | `POST /api/payments` |

#### Admin Role Operations

| Operation | CRUD | Frontend Action | API Endpoint |
|----------------------|--------|--------------------------------------------|------------------------------|
| Add Crop | CREATE | Fill crop form with image → submit | `POST /api/crops` |
| Change Crop Status | UPDATE | Toggle status button (auto + manual) | `PATCH /api/crops/:id/status` |
| View Crop Details | READ | Click crop row in management table | `GET /api/crops/:id` |
| Update Crop Details | UPDATE | Edit crop form → save | `PUT /api/crops/:id` |
| Delete Crop | DELETE | Select crop → confirm dialog → delete | `DELETE /api/crops/:id` |

> **Auto Stock Update:** A `pre-save` Mongoose middleware checks if `quantity === 0` and auto-sets `status` to `"Out of Stock"`. A `node-cron` job runs every hour to verify stock consistency.

---

### Module 3: Chemical & Fertilizer Management

#### User Role Operations

| Operation | CRUD | Frontend Action | API Endpoint |
|----------------------------------|--------|-----------------------------------------|--------------------------------|
| View All Chemicals | READ | Browse chemicals catalog page | `GET /api/chemicals` |
| View In-Stock Chemicals | READ | Filter tab: In Stock | `GET /api/chemicals/in-stock` |
| View Out-of-Stock Chemicals | READ | Filter tab: Out of Stock | `GET /api/chemicals/out-of-stock` |
| Sort by Category | READ | Select category from filter sidebar | `GET /api/chemicals?category=X` |
| Buy Available Chemical | CREATE | Add to cart → checkout | `POST /api/payments` |

#### Admin Role Operations

| Operation | CRUD | Frontend Action | API Endpoint |
|--------------------------|--------|--------------------------------------------|--------------------------------|
| Add Chemical/Fertilizer | CREATE | Fill chemical form with image → submit | `POST /api/chemicals` |
| Change Status | UPDATE | Toggle status button (auto + manual) | `PATCH /api/chemicals/:id/status` |
| View Details | READ | Click item row in management table | `GET /api/chemicals/:id` |
| Update Details | UPDATE | Edit chemical form → save | `PUT /api/chemicals/:id` |
| Delete Chemical | DELETE | Select item → confirm dialog → delete | `DELETE /api/chemicals/:id` |

> **Auto Stock Update:** Same `pre-save` middleware and `node-cron` strategy as Crop Management.

---

### Module 4: Financial Management

#### User Role Operations

| Operation | CRUD | Frontend Action | API Endpoint |
|------------------------|--------|--------------------------------------------|------------------------------|
| Buy Items | CREATE | Cart → Checkout → Confirm | `POST /api/payments` |
| Create Payment | CREATE | Enter payment details → process | `POST /api/payments` |
| View My Payments | READ | Navigate to payment history | `GET /api/payments/my-payments` |
| Request Refund | CREATE | Select payment → fill reason → submit | `POST /api/refunds` |

#### Admin Role Operations

| Operation | CRUD | Frontend Action | API Endpoint |
|-------------------------|--------|-------------------------------------------|-------------------------------|
| View All Payments | READ | Navigate to payments management | `GET /api/payments` |
| Accept Refund | UPDATE | Click accept button on refund request | `PUT /api/refunds/:id/accept` |
| Reject Refund | UPDATE | Click reject button + reason | `PUT /api/refunds/:id/reject` |
| Process Accepted Refund | UPDATE | Click process button on accepted refund | `PUT /api/refunds/:id/process` |
| Delete Payment | DELETE | Select payment → confirm → delete | `DELETE /api/payments/:id` |
| Delete Refund Request | DELETE | Select refund → confirm → delete | `DELETE /api/refunds/:id` |

---

### Module 5: Feedback Management

#### User Role Operations

| Operation | CRUD | Frontend Action | API Endpoint |
|-----------------------------|--------|----------------------------------------------|-----------------------------------------|
| Create Feedback | CREATE | Fill feedback form + rating → submit | `POST /api/feedbacks` |
| Read Feedbacks | READ | Browse feedback section | `GET /api/feedbacks` |
| Give Rating (1-5 stars) | CREATE | Click star rating → submit with feedback | `POST /api/feedbacks` (rating field) |
| Toggle Anonymous | UPDATE | Click anonymous toggle switch | `PATCH /api/feedbacks/:id/toggle-anonymous` |
| Delete Own Feedback | DELETE | Click delete on own feedback → confirm | `DELETE /api/feedbacks/:id` |
| Raise Support Ticket | CREATE | Fill ticket form + category → submit | `POST /api/tickets` |
| View Own Tickets | READ | Navigate to my tickets page | `GET /api/tickets/my-tickets` |
| Update Ticket (if open) | UPDATE | Edit ticket description → save | `PUT /api/tickets/:id` |
| Delete Ticket | DELETE | Click delete on own ticket → confirm | `DELETE /api/tickets/:id` |

#### Admin Role Operations

| Operation | CRUD | Frontend Action | API Endpoint |
|-----------------------------|--------|----------------------------------------------|----------------------------------|
| Reply to Feedback | UPDATE | Type reply → submit | `PUT /api/feedbacks/:id/reply` |
| Create Rating Order | READ | View ratings summary/analytics | `GET /api/feedbacks/ratings-summary` |
| Read All Tickets | READ | Navigate to ticket management | `GET /api/tickets` |
| Accept Ticket | UPDATE | Click accept on ticket | `PUT /api/tickets/:id/accept` |
| Reply to Ticket | UPDATE | Type reply message → submit | `PUT /api/tickets/:id/reply` |
| Delete Ticket | DELETE | Select ticket → confirm → delete | `DELETE /api/tickets/:id` |
| Delete Feedback | DELETE | Select feedback → confirm → delete | `DELETE /api/feedbacks/:id` |

---

### Module 6: Weather Monitoring

#### User Role Operations

| Operation | CRUD | Frontend Action | API Endpoint |
|-----------------------------|--------|--------------------------------------------|-----------------------------------|
| Add Location | CREATE | Enter location details / pick on map | `POST /api/weather/locations` |
| View Real-time Forecast | READ | Select location → view weather widget | `GET /api/weather/forecast/:locationId` |
| Update Location | UPDATE | Edit location name/coordinates → save | `PUT /api/weather/locations/:id` |
| Delete Location | DELETE | Click delete on location → confirm | `DELETE /api/weather/locations/:id` |

#### Admin Role Operations

| Operation | CRUD | Frontend Action | API Endpoint |
|-----------------------------|--------|--------------------------------------------|-----------------------------------|
| Add Weather Record | CREATE | Fill weather record form → submit | `POST /api/weather/records` |
| View All Records | READ | Navigate to weather records table | `GET /api/weather/records` |
| Update Rainfall Data | UPDATE | Edit rainfall field → save | `PUT /api/weather/records/:id` |
| Delete Weather Record | DELETE | Select record → confirm → delete | `DELETE /api/weather/records/:id` |

---

## 🎨 UI/UX Design System

### Color Palette

```css
:root {
 /* Primary - Green (Agriculture) */
 --primary-50: #f0fdf4;
 --primary-100: #dcfce7;
 --primary-200: #bbf7d0;
 --primary-300: #86efac;
 --primary-400: #4ade80;
 --primary-500: #22c55e; /* Main Primary */
 --primary-600: #16a34a;
 --primary-700: #15803d;
 --primary-800: #166534;
 --primary-900: #14532d;

 /* Secondary - Amber (Harvest/Warmth) */
 --secondary-50: #fffbeb;
 --secondary-100: #fef3c7;
 --secondary-500: #f59e0b; /* Main Secondary */
 --secondary-700: #b45309;

 /* Accent - Sky Blue (Weather/Water) */
 --accent-50: #f0f9ff;
 --accent-500: #0ea5e9; /* Main Accent */
 --accent-700: #0369a1;

 /* Neutral */
 --neutral-50: #fafafa;
 --neutral-100: #f5f5f5;
 --neutral-200: #e5e5e5;
 --neutral-500: #737373;
 --neutral-800: #262626;
 --neutral-900: #171717;

 /* Semantic */
 --success: #10b981;
 --warning: #f59e0b;
 --error: #ef4444;
 --info: #3b82f6;
}
```

### Typography

```css
/* Headings */
font-family: 'Poppins', sans-serif;
h1: 3rem/48px - Bold (Hero titles)
h2: 2.25rem/36px - Semibold (Section titles)
h3: 1.875rem/30px - Semibold (Card titles)
h4: 1.5rem/24px - Medium (Sub-sections)

/* Body */
font-family: 'Inter', sans-serif;
body: 1rem/16px - Regular (Paragraphs)
small: 0.875rem/14px - Regular (Captions)
xs: 0.75rem/12px - Medium (Badges, labels)
```

### Button System (`client/src/components/common/Button.jsx`)

| Variant | Use Case | Style |
|-------------|----------------------------------|-----------------------------------------------|
| `primary` | Main CTA, Submit, Save | `bg-green-600 hover:bg-green-700 text-white` |
| `secondary` | Secondary actions | `bg-amber-500 hover:bg-amber-600 text-white` |
| `outline` | Cancel, Back | `border-2 border-green-600 text-green-600` |
| `danger` | Delete, Remove | `bg-red-500 hover:bg-red-600 text-white` |
| `ghost` | Subtle actions | `text-green-600 hover:bg-green-50` |
| `icon` | Icon-only buttons | `p-2 rounded-full hover:bg-neutral-100` |

All buttons include:
- **Hover:** Scale 1.02 + shadow elevation
- **Active:** Scale 0.98 (press effect)
- **Focus:** Ring outline for accessibility
- **Loading:** Spinner icon + disabled state
- **Transition:** `transition-all duration-200 ease-in-out`

### Navbar Component (`client/src/components/common/Navbar.jsx`)

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ 🌾 Smart Agro │ Home Crops Chemicals Weather │ 🔔 👤 Profile ▾            │
│ [Logo]        │ [Nav Links - center]         │ [Actions - right]          │
└────────────────────────────────────────────────────────────────────────────┘

Features:
- Sticky top with glassmorphism (backdrop-blur + translucent bg)
- Logo animates on hover (subtle leaf rotation)
- Active link: green underline with slide animation
- Mobile: hamburger → full-screen slide-in drawer
- Scroll: navbar shrinks in height, adds shadow
- User dropdown: avatar + name → profile, dashboard, logout
- Notification bell with badge count
```

### Admin Sidebar (`client/src/components/common/Sidebar.jsx`)

```text
┌─────────────────────┐
│ 🌾 Smart Agro       │
│ Admin Panel         │
├─────────────────────┤
│ 📊 Dashboard        │
│ 👥 Users            │
│ 🌾 Crops            │
│ 🧪 Chemicals        │
│ 💰 Payments         │
│ 🔄 Refunds          │
│ ⭐ Feedbacks         │
│ 🎫 Tickets          │
│ 🌤 Weather          │
├─────────────────────┤
│ ⚙ Settings         │
│ 🚪 Logout          │
└─────────────────────┘

Features:
- Collapsible (icon-only mode)
- Active item: green left border + bg highlight
- Hover: slide-right indicator animation
- Sub-menu expand/collapse with smooth height transition
- Dark theme sidebar (neutral-900 bg)
- Tooltip on collapsed mode
```

### Hero Section (`client/src/components/home/HeroSection.jsx`)

```text
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│ [Background: Full-width carousel of farm images with dark overlay]       │
│                                                                          │
│ 🌾 Smart Agriculture,                                                    │
│ Smarter Future                                             [Lottie: Tractor]
│                                                                          │
│ Empowering farmers with intelligent                                      │
│ crop management, weather insights,                                       │
│ and financial tools.                                                     │
│                                                                          │
│ [ Get Started ] [ Learn More ]                                           │
│                                                                          │
│ ──  ──  ── (carousel dots)                                               │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

Features:
- Swiper.js carousel with autoplay (5s interval)
- Parallax scrolling effect on background
- Text fade-in with staggered delay (Framer Motion)
- Floating particle effect (CSS keyframes)
- CTA buttons with hover glow effect
- Responsive: stacks vertically on mobile
- Gradient overlay: linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.3))
```

### Dashboard Pages

#### User Dashboard (`client/src/pages/user/UserDashboardPage.jsx`)

```text
┌────────────────────────────────────────────────────────────────┐
│ Welcome back, John! 👋 [Lottie: Wave]                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│ │ Orders  │ │ Spent   │ │Feedbacks│ │ Tickets │               │
│ │ 12      │ │ $450    │ │ 8       │ │ 3       │               │
│ │ 📦 +3   │ │ 💰 +$50 │ │ ⭐ ↑2   │ │ 🎫 1new │               │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
│                                                                │
│ ┌─────────────────────────┐ ┌──────────────────────────┐       │
│ │ Recent Orders           │ │ Weather Widget           │       │
│ │ ─────────────────       │ │ ☀ 28°C Sunny            │       │
│ │ Wheat - $50 ✅          │ │ Humidity: 65%           │       │
│ │ Rice - $30 🔄           │ │ Wind: 12 km/h           │       │
│ │ Corn - $25 ✅           │ │ [View Full Forecast →]  │       │
│ └─────────────────────────┘ └──────────────────────────┘       │
│                                                                │
│ ┌────────────────────────────────────────────────────────────┐  │
│ │ Quick Actions                                              │  │
│ │ [ Browse Crops ] [ My Payments ] [ Raise Ticket ]          │  │
│ └────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

#### Admin Dashboard (`client/src/pages/admin/AdminDashboardPage.jsx`)

```text
┌────────────────────────────────────────────────────────────────┐
│ Admin Dashboard 🛡 [Date Range]                               │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐         │
│ │Users │ │Crops │ │Chem. │ │Sales │ │Feed. │ │Ticket│         │
│ │ 156  │ │ 48   │ │ 32   │ │$12.5K│ │ 89   │ │ 15   │         │
│ │↑12%  │ │↑5%   │ │↓2%   │ │↑18%  │ │↑8%   │ │↓20%  │         │
│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘         │
│                                                                │
│ ┌─────────────────────────┐ ┌──────────────────────────┐       │
│ │ Revenue Chart (Line)    │ │ Orders by Category (Pie)│       │
│ │ 📈 [Recharts Line]      │ │ 🥧 [Recharts Pie]       │       │
│ │                         │ │                          │       │
│ └─────────────────────────┘ └──────────────────────────┘       │
│                                                                │
│ ┌─────────────────────────┐ ┌──────────────────────────┐       │
│ │ Recent Activity Feed    │ │ Pending Refund Requests │       │
│ │ • User X bought Rice    │ │ #RF001 - $50 [Accept]   │       │
│ │ • New ticket raised     │ │ #RF002 - $30 [Accept]   │       │
│ │ • Feedback received     │ │ [View All Refunds →]    │       │
│ └─────────────────────────┘ └──────────────────────────┘       │
│                                                                │
│ ┌────────────────────────────────────────────────────────────┐  │
│ │ Top Selling Crops              │ User Growth Chart        │  │
│ │ 1. Rice ████████ 340          │ 📊 [Recharts Bar]        │  │
│ │ 2. Wheat ██████ 280           │                          │  │
│ │ 3. Corn ████ 190              │                          │  │
│ └────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

---

## 🖼 Assets & Media Plan

### Image Sources (Royalty-Free)

| Category | Source | Path |
|------------------|---------------------------------------------|---------------------------------------------|
| Hero Banners | Unsplash / Pexels (agriculture, farming) | `client/src/assets/images/hero/` |
| Crop Images | Unsplash (individual crop photos) | `client/src/assets/images/crops/` |
| Chemical Images | Product mockup / Pexels | `client/src/assets/images/chemicals/` |
| Weather Images | Unsplash (sky, clouds, rain) | `client/src/assets/images/weather/` |
| Illustrations | unDraw.co / Storyset (SVG illustrations) | `client/src/assets/images/illustrations/` |
| Backgrounds | SVG patterns / Unsplash blurred | `client/src/assets/images/backgrounds/` |
| Avatars | UI Avatars API / default image | `client/src/assets/images/avatars/` |
| Icons | Custom SVG / React Icons library | `client/src/assets/icons/` |

### Lottie Animation Sources

| Animation | Source | Path |
|----------------------|------------------|-------------------------------------------------|
| Loading Spinner | LottieFiles.com | `client/src/assets/animations/loading-spinner.json` |
| Success Checkmark | LottieFiles.com | `client/src/assets/animations/success-checkmark.json` |
| Farm Tractor | LottieFiles.com | `client/src/assets/animations/farm-tractor.json` |
| Growing Plant | LottieFiles.com | `client/src/assets/animations/growing-plant.json` |
| Weather Animations | LottieFiles.com | `client/src/assets/animations/weather-*.json` |
| Payment Success | LottieFiles.com | `client/src/assets/animations/payment-success.json` |
| Empty State | LottieFiles.com | `client/src/assets/animations/empty-box.json` |
| Error Warning | LottieFiles.com | `client/src/assets/animations/error-warning.json` |

---

## ✨ Animations & Transitions

### Global Animations (`client/src/styles/animations.css`)

```css
/* Page Transitions (Framer Motion) */
.page-enter {
 opacity: 0;
 transform: translateY(20px);
}
.page-enter-active {
 opacity: 1;
 transform: translateY(0);
 transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Card Hover Effect */
.card-hover {
 transition: all 0.3s ease;
}
.card-hover:hover {
 transform: translateY(-8px);
 box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* Floating Animation (Hero elements) */
@keyframes float {
 0%, 100% { transform: translateY(0px); }
 50% { transform: translateY(-20px); }
}

/* Pulse Glow (CTA buttons) */
@keyframes pulse-glow {
 0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
 50% { box-shadow: 0 0 20px 10px rgba(34, 197, 94, 0); }
}

/* Slide In (Sidebar items) */
@keyframes slide-in-left {
 from { transform: translateX(-100%); opacity: 0; }
 to { transform: translateX(0); opacity: 1; }
}

/* Counter Animation (Stats) */
@keyframes count-up {
 from { opacity: 0; transform: translateY(20px); }
 to { opacity: 1; transform: translateY(0); }
}

/* Skeleton Shimmer */
@keyframes shimmer {
 0% { background-position: -200% 0; }
 100% { background-position: 200% 0; }
}

/* Gradient Text Animation */
@keyframes gradient-shift {
 0% { background-position: 0% 50%; }
 50% { background-position: 100% 50%; }
 100% { background-position: 0% 50%; }
}
```

### Framer Motion Variants (Used across components)

```javascript
// Page transition
const pageVariants = {
 initial: { opacity: 0, y: 20 },
 animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
 exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

// Staggered children (cards, list items)
const containerVariants = {
 hidden: { opacity: 0 },
 visible: {
 opacity: 1,
 transition: { staggerChildren: 0.1, delayChildren: 0.2 }
 }
};

const itemVariants = {
 hidden: { opacity: 0, y: 30 },
 visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// Modal animation
const modalVariants = {
 hidden: { opacity: 0, scale: 0.8 },
 visible: { opacity: 1, scale: 1, transition: { type: "spring", damping: 25 } },
 exit: { opacity: 0, scale: 0.8 }
};

// Sidebar slide
const sidebarVariants = {
 open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
 closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } }
};
```

### AOS (Animate On Scroll) Configuration

```javascript
// Initialized in App.jsx
AOS.init({
 duration: 800,
 easing: 'ease-out-cubic',
 once: true,
 offset: 100,
 delay: 100
});

// Usage in components:
// data-aos="fade-up"
// data-aos="fade-right"
// data-aos="zoom-in"
// data-aos="flip-left"
```

---

## 🔐 Authentication & Authorization Flow

```text
┌──────────┐   POST /auth/login   ┌──────────┐
│ Client   │ ───────────────────▶ │ Server   │
│          │                      │          │
│          │ ◀──── Access Token (15m)        │
│          │ ◀──── Refresh Token (7d)        │
│          │       (httpOnly cookie)         │
└──────────┘                      └──────────┘

Protected Route Request:
┌──────────┐ Authorization: Bearer <token> ┌──────────┐
│ Client   │ ─────────────────────────────▶ │ Server   │
│          │                                │          │
│          │ ◀──── Verify JWT ──────────── │          │
│          │ ◀──── Check Role ──────────── │          │
│          │ ◀──── Return Data ─────────── │          │
└──────────┘                                └──────────┘

Token Refresh Flow:
┌──────────┐ 401 Unauthorized ┌──────────┐
│ Client   │ ◀─────────────── │ Server   │
│ (Axios   │ POST /auth/refresh-token    │
│ Inter-   │ ───────────────────────────▶│
│ ceptor)  │ ◀──── New Access Token      │
│          │ Retry Original Request ───▶ │
└──────────┘                             └──────────┘
```

### Middleware Chain

```text
Request → rateLimiter → helmet → cors → morgan → authMiddleware → adminMiddleware → Controller
```

---

## ⚙ Environment Variables

### Server (`server/.env`)

```env
# Server
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/smart-agro-system

# JWT
JWT_ACCESS_SECRET=your_access_token_secret_key_here
JWT_REFRESH_SECRET=your_refresh_token_secret_key_here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# OpenWeather API
OPENWEATHER_API_KEY=your_openweather_api_key

# Admin Seed
ADMIN_EMAIL=admin@smartagro.com
ADMIN_PASSWORD=Admin@123456

# Client URL
CLIENT_URL=http://localhost:5173
```

### Client (`client/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** v18+ & **npm** v9+
- **MongoDB** (local) or **MongoDB Atlas** account
- **Git**
- **Cloudinary** account (free tier)
- **OpenWeatherMap** API key (free tier)

### Step-by-Step Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/smart-agro-system.git
cd smart-agro-system

# 2. Install root dependencies (concurrently)
npm install

# 3. Install backend dependencies
cd server
npm install

# 4. Install frontend dependencies
cd ../client
npm install

# 5. Install AI Chatbot dependencies (Python)
cd ../CHATBOT
pip install -r ../requirements.txt

# 6. Configure environment variables
# Copy .env.example to .env in server, client, and CHATBOT folders
# and fill in your credentials.
```

### 🐍 AI Chatbot Setup

The system includes an AI-powered chatbot for crop advice.
1. Ensure you have **Python 3.9+** installed.
2. Create a virtual environment: `python -m venv venv`
3. Activate it: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
4. Install requirements: `pip install -r requirements.txt`
5. Get a **Groq API Key** and add it to `CHATBOT/.env`.
6. Run the chatbot server: `python CHATBOT/backend/app.py`

### 🚀 Starting the Application

From the root directory:
```bash
npm run dev
```
This will start:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Chatbot API**: http://localhost:5002 (must be started separately or via updated scripts)

### Available Scripts

```json
// Root package.json
{
 "scripts": {
  "dev": "concurrently \"npm run server\" \"npm run client\"",
  "server": "cd server && npm run dev",
  "client": "cd client && npm run dev",
  "build": "cd client && npm run build",
  "start": "cd server && npm start",
  "seed:admin": "cd server && node seeds/adminSeed.js",
  "seed:data": "cd server && node seeds/dataSeed.js"
 }
}

// Server package.json
{
 "scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "test": "jest --watchAll --verbose",
  "seed:admin": "node seeds/adminSeed.js",
  "seed:data": "node seeds/dataSeed.js"
 }
}

// Client package.json
{
 "scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint src --ext .js,.jsx",
  "test": "react-scripts test"
 }
}
```

---

## 📅 Development Timeline & Milestones

### Phase 1: Foundation & Setup (Week 1)

| Day | Task | Status |
|-------|----------------------------------------------------------------|--------|
| Day 1 | Project initialization, folder structure, Git setup | ⬜ |
| Day 2 | MongoDB connection, Mongoose models (all schemas) | ⬜ |
| Day 3 | Express server setup, middleware configuration | ⬜ |
| Day 4 | React + Vite setup, Tailwind config, Redux store | ⬜ |
| Day 5 | Design system: Button, Modal, Navbar, Footer, Sidebar | ⬜ |
| Day 6 | Layout components (Main, Dashboard, Auth, Admin) | ⬜ |
| Day 7 | Assets collection (images, Lottie animations, icons) | ⬜ |

### Phase 2: Authentication & User Management (Week 2)

| Day | Task | Status |
|--------|---------------------------------------------------------------|--------|
| Day 8 | Auth backend: signup, login, JWT, refresh token | ⬜ |
| Day 9 | Auth frontend: LoginPage, SignupPage, forms | ⬜ |
| Day 10 | Password recovery (forgot/reset) – backend + frontend | ⬜ |
| Day 11 | User profile: view, update, change password, delete account | ⬜ |
| Day 12 | Admin: user list, create user/admin, role change | ⬜ |
| Day 13 | Protected routes, route guards, Axios interceptors | ⬜ |
| Day 14 | Landing page: Hero, Features, About, How It Works, CTA | ⬜ |

### Phase 3: Crop Management (Week 3)

| Day | Task | Status |
|--------|---------------------------------------------------------------|--------|
| Day 15 | Crop model finalization, CRUD API endpoints | ⬜ |
| Day 16 | Auto stock status middleware & cron job | ⬜ |
| Day 17 | User: CropBrowsePage, CropCard, CropFilter, sorting | ⬜ |
| Day 18 | User: CropDetailPage, add to cart | ⬜ |
| Day 19 | Admin: CropManagePage (data table), add/edit/delete | ⬜ |
| Day 20 | Image upload (Cloudinary) for crops | ⬜ |
| Day 21 | Testing & bug fixes for crop module | ⬜ |

### Phase 4: Chemical & Fertilizer Management (Week 4)

| Day | Task | Status |
|--------|---------------------------------------------------------------|--------|
| Day 22 | Chemical model, CRUD API endpoints | ⬜ |
| Day 23 | Auto stock status middleware & cron job | ⬜ |
| Day 24 | User: ChemicalBrowsePage, filters, sorting | ⬜ |
| Day 25 | User: ChemicalDetailPage, add to cart | ⬜ |
| Day 26 | Admin: ChemicalManagePage, add/edit/delete | ⬜ |
| Day 27 | Image upload for chemicals, stock badges | ⬜ |
| Day 28 | Testing & bug fixes for chemical module | ⬜ |

### Phase 5: Financial Management (Week 5)

| Day | Task | Status |
|--------|---------------------------------------------------------------|--------|
| Day 29 | Shopping cart: Redux state, CartPage, CartSummary | ⬜ |
| Day 30 | Checkout: CheckoutForm, payment creation API | ⬜ |
| Day 31 | Payment history: user payments list | ⬜ |
| Day 32 | Refund: request form, API endpoints | ⬜ |
| Day 33 | Admin: payment list, refund accept/reject/process | ⬜ |
| Day 34 | Invoice generation, payment status tracking | ⬜ |
| Day 35 | Testing & bug fixes for financial module | ⬜ |

### Phase 6: Feedback & Ticket Management (Week 6)

| Day | Task | Status |
|--------|---------------------------------------------------------------|--------|
| Day 36 | Feedback model, CRUD API endpoints | ⬜ |
| Day 37 | User: feedback creation, star rating, anonymous toggle | ⬜ |
| Day 38 | Admin: feedback list, reply, delete, rating summary | ⬜ |
| Day 39 | Ticket model, CRUD API endpoints | ⬜ |
| Day 40 | User: create ticket, view tickets, update (if open) | ⬜ |
| Day 41 | Admin: ticket list, accept, reply, close, timeline | ⬜ |
| Day 42 | Testing & bug fixes for feedback/ticket modules | ⬜ |

### Phase 7: Weather Monitoring (Week 7)

| Day | Task | Status |
|--------|---------------------------------------------------------------|--------|
| Day 43 | Weather & Location models, API endpoints | ⬜ |
| Day 44 | OpenWeatherMap API integration | ⬜ |
| Day 45 | User: location management (add/update/delete) | ⬜ |
| Day 46 | User: weather forecast widget, Leaflet map | ⬜ |
| Day 47 | Admin: weather records management, rainfall update | ⬜ |
| Day 48 | Rainfall chart (Recharts), weather condition icons | ⬜ |
| Day 49 | Testing & bug fixes for weather module | ⬜ |

### Phase 8: Dashboard, Polish & Deployment (Week 8)

| Day | Task | Status |
|--------|---------------------------------------------------------------|--------|
| Day 50 | User dashboard: stats, recent orders, weather widget | ⬜ |
| Day 51 | Admin dashboard: charts, analytics, activity feed | ⬜ |
| Day 52 | Animations polish: AOS, Framer Motion, Lottie integration | ⬜ |
| Day 53 | Responsive design audit (mobile, tablet, desktop) | ⬜ |
| Day 54 | Error handling, loading states, empty states | ⬜ |
| Day 55 | About page, Contact page, 404 page, Footer | ⬜ |
| Day 56 | Final testing, performance optimization, build | ⬜ |
| Day 57 | Deployment (Vercel + Render/Railway) | ⬜ |
| Day 58 | Documentation, README finalization, demo video | ⬜ |

---

## 🧪 Testing Strategy

### Backend Testing (Jest + Supertest)

```text
server/tests/
├── auth.test.js         # Auth endpoint tests
├── user.test.js         # User CRUD tests
├── crop.test.js         # Crop CRUD tests
├── chemical.test.js     # Chemical CRUD tests
├── payment.test.js      # Payment CRUD tests
├── refund.test.js       # Refund CRUD tests
├── feedback.test.js     # Feedback CRUD tests
├── ticket.test.js       # Ticket CRUD tests
├── weather.test.js      # Weather CRUD tests
└── middleware.test.js   # Middleware tests
```

### Frontend Testing (React Testing Library)

```text
client/src/__tests__/
├── components/
│   ├── Navbar.test.jsx
│   ├── Button.test.jsx
│   └── CropCard.test.jsx
├── pages/
│   ├── LoginPage.test.jsx
│   └── Dashboard.test.jsx
└── utils/
    └── formatters.test.js
```

---

## 🌍 Deployment Strategy

| Component | Platform | URL |
|-------------|------------------|--------------------------------|
| Frontend | **Vercel** | `https://smartagro.vercel.app` |
| Backend | **Render** | `https://smartagro-api.onrender.com` |
| Database | **MongoDB Atlas** | Cloud cluster |
| Images | **Cloudinary** | CDN delivery |
| Domain | Custom domain | `https://smartagro.com` |

### Deployment Checklist

- [ ] Set all environment variables on hosting platforms
- [ ] Enable CORS for production client URL
- [ ] Configure MongoDB Atlas IP whitelist
- [ ] Set up Cloudinary upload presets
- [ ] Run admin seed on production database
- [ ] Enable HTTPS
- [ ] Set up monitoring (UptimeRobot / Sentry)
- [ ] Configure custom domain & SSL

---

## 🤝 Contributing

We welcome contributions from the community! Whether it's fixing bugs, adding features, or improving documentation, here's how you can help:

### 🚀 How to Contribute
1. **Fork** the repository.
2. **Clone** your fork: `git clone https://github.com/your-username/smart-agro-system.git`
3. **Create a branch** for your changes: `git checkout -b feature/your-feature-name`
4. **Make your changes** and ensure they follow the project's coding style.
5. **Test** your changes thoroughly.
6. **Commit** your changes: `git commit -m "feat: add amazing feature"`
7. **Push** to your branch: `git push origin feature/your-feature-name`
8. **Open a Pull Request** against the `develop` branch.

### 💡 Areas for Contribution
- **AI Models**: Improving the plant disease detection accuracy.
- **UI/UX**: Enhancing the dashboard designs and mobile responsiveness.
- **Localization**: Translating the app into Sinhala and Tamil.
- **New Modules**: Adding a "Seed Bank" or "Marketplace" module.

### Commit Convention

```text
feat: New feature
fix: Bug fix
docs: Documentation update
style: Formatting, CSS changes
refactor: Code refactoring
test: Adding tests
chore: Maintenance tasks
```

### Branch Strategy

```text
main ← Production-ready code
├── develop ← Integration branch
│   ├── feature/user-management
│   ├── feature/crop-management
│   ├── feature/chemical-management
│   ├── feature/financial-management
│   ├── feature/feedback-management
│   └── feature/weather-monitoring
```

---

<div align="center">

### 🌾 Built with ❤ for the Agriculture Community

**Smart Agro System** © 2025 — All Rights Reserved

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

</div>

---

