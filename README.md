# 🧭 Diabetes Compass

**Your comprehensive guide to diabetes care and management**

A full-stack web application providing information, tools, and community support for people living with diabetes. Built with modern web technologies and AI-assisted development using GitHub Copilot.

🌐 **Live Demo:** [https://diabetes-compassv2.netlify.app](https://diabetes-compassv2.netlify.app)

## 📋 Table of Contents

- [Project Description](#-project-description)
- [Features](#-features)
- [Architecture](#-architecture)
- [Database Schema](#-database-schema)
- [Authentication & Authorization](#-authentication--authorization)
- [Storage](#-storage)
- [User Interface](#-user-interface)
- [Local Development Setup](#-local-development-setup)
- [Project Structure](#-project-structure)
- [Demo Credentials](#-demo-credentials)
- [Deployment](#-deployment)
- [GitHub Repository](#-github-repository)
- [Development Methodology](#-development-methodology)

---

## 📖 Project Description

**Diabetes Compass** is a comprehensive diabetes management platform that helps users:

- **Track Health Metrics** - Log glucose levels, insulin doses, physical activities, and weight
- **Access Information** - Learn about nutrition, treatments, and physical activities for diabetes management
- **Connect with Community** - Share stories and experiences with others living with diabetes
- **Calculate BMI** - Get personalized calorie recommendations based on body metrics
- **Find Healthcare** - Connect with qualified healthcare providers specializing in diabetes care

### Who Can Do What

| User Type | Capabilities |
|-----------|-------------|
| **Visitors** | View all public content, read stories, access information pages |
| **Registered Users** | Personal profile, health tracking (glucose, insulin, activity, weight), export data, share stories |
| **Administrators** | All user capabilities + Analytics Dashboard, User Management (CRUD), Image Management |

---

## ✨ Features

### User Interface (UI)
- ✅ **10+ App Screens** - Home, Login/Register modals, Profile, Dashboard, Nutrition, Treatments, Physical Activities, BMI Calculator, Share Your Story, FAQ, About Us
- ✅ **Responsive Design** - Fully optimized for desktop and mobile browsers
- ✅ **Icons & Visual Cues** - Emojis, gradient effects, smooth transitions, loading states
- ✅ **Modular Architecture** - Separate HTML files for each screen

### Backend (Supabase)
- ✅ **Supabase Database** - PostgreSQL with 6 data tables
- ✅ **Supabase Auth** - User registration, login, logout with JWT tokens
- ✅ **Supabase Storage** - Image uploads for site assets and profile photos
- ✅ **Supabase Edge Functions** - Server-side user management (create-user, update-user, delete-user, upload-image)

### Authentication & Authorization
- ✅ **JWT-based Auth** - Secure token authentication via Supabase Auth
- ✅ **User Roles** - Normal users and administrators
- ✅ **Row-Level Security (RLS)** - Fine-grained access control on all tables
- ✅ **Admin Panel** - Analytics dashboard with user and image management

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   HTML5     │  │   CSS3      │  │ JavaScript  │              │
│  │   Pages     │  │   Styles    │  │   Logic     │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                           │                                      │
│              Supabase JS Client Library                          │
└───────────────────────────┼─────────────────────────────────────┘
                            │ HTTPS/REST API
┌───────────────────────────▼─────────────────────────────────────┐
│                       SUPABASE BACKEND                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Auth       │  │  Database   │  │  Storage    │              │
│  │  (JWT)      │  │ (PostgreSQL)│  │  (Files)    │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│  ┌─────────────────────────────────────────────────┐            │
│  │           Edge Functions (Deno)                  │            │
│  │  create-user | update-user | delete-user        │            │
│  └─────────────────────────────────────────────────┘            │
│  ┌─────────────────────────────────────────────────┐            │
│  │           Row-Level Security (RLS)               │            │
│  │     Policy-based access control per table        │            │
│  └─────────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      DEPLOYMENT                                  │
│           Netlify (Static Site Hosting)                          │
│              GitHub (Source Control)                             │
└─────────────────────────────────────────────────────────────────┘
```

### Technologies Used

| Layer | Technology |
|-------|------------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Supabase (PostgreSQL, Auth, Storage, Edge Functions) |
| **Database** | PostgreSQL via Supabase |
| **Authentication** | Supabase Auth with JWT |
| **Storage** | Supabase Storage |
| **Charts** | Chart.js |
| **Hosting** | Netlify |
| **Version Control** | Git + GitHub |
| **AI Development** | GitHub Copilot |

---

## 📊 Database Schema

### Tables Overview

The database consists of **6 tables** with relationships:

```
┌──────────────────┐       ┌──────────────────┐
│   auth.users     │       │   user_roles     │
│  (Supabase Auth) │◄──────│                  │
│                  │       │  - id (PK)       │
│  - id (PK)       │       │  - user_id (FK)  │
│  - email         │       │  - user_role     │
│  - created_at    │       │  - created_at    │
└────────┬─────────┘       └──────────────────┘
         │
         │ 1:1
         ▼
┌──────────────────┐
│    profiles      │
│                  │
│  - user_id (PK)  │
│  - email         │
│  - name          │
│  - phone_number  │
│  - diabetes_type │
│  - glucose_unit  │
│  - insulin_user  │
│  - photo_url     │
│  - created_at    │
└────────┬─────────┘
         │
         │ 1:N
         ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ glucose_entries  │  │ insulin_entries  │  │ activity_entries │  │  weight_entries  │
│                  │  │                  │  │                  │  │                  │
│  - id (PK)       │  │  - id (PK)       │  │  - id (PK)       │  │  - id (PK)       │
│  - user_id (FK)  │  │  - user_id (FK)  │  │  - user_id (FK)  │  │  - user_id (FK)  │
│  - glucose_value │  │  - insulin_units │  │  - activity_type │  │  - weight_value  │
│  - measured_at   │  │  - insulin_type  │  │  - duration_min  │  │  - recorded_at   │
│  - notes         │  │  - injected_at   │  │  - recorded_at   │  │  - notes         │
│  - created_at    │  │  - notes         │  │  - notes         │  │  - created_at    │
└──────────────────┘  │  - created_at    │  │  - created_at    │  └──────────────────┘
                      └──────────────────┘  └──────────────────┘
```

### Table Details

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `profiles` | User profile data | user_id, name, email, diabetes_type, glucose_unit, insulin_user, photo_url |
| `user_roles` | Role-based access control | user_id, user_role (enum: 'user', 'admin') |
| `glucose_entries` | Blood glucose tracking | user_id, glucose_value, measured_at, notes |
| `insulin_entries` | Insulin dose tracking | user_id, insulin_units, insulin_type, injected_at |
| `activity_entries` | Physical activity logging | user_id, activity_type, duration_min, recorded_at |
| `weight_entries` | Weight tracking | user_id, weight_value, recorded_at |

### Row-Level Security (RLS) Policies

All tables have RLS enabled with these access patterns:

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `profiles` | Anyone | Owner only | Owner only | - |
| `user_roles` | Anyone | Owner or Admin | Admin only | Admin only |
| `glucose_entries` | Owner only | Owner only | Owner only | Owner only |
| `insulin_entries` | Owner only | Owner only | Owner only | Owner only |
| `activity_entries` | Owner only | Owner only | Owner only | Owner only |
| `weight_entries` | Owner only | Owner only | Owner only | Owner only |
| `storage.objects` (images) | Anyone | Admin only | Admin only | Admin only |

---

## 🔐 Authentication & Authorization

### Authentication Flow

1. **Registration**: User signs up with email/password → Supabase creates auth.users entry → Frontend creates profile and user_role entries
2. **Login**: User enters credentials → Supabase validates → Returns JWT token → Stored in browser session
3. **Session**: JWT token included in all API requests → Supabase validates token → RLS policies enforce access

### User Roles

```sql
CREATE TYPE app_role AS ENUM ('user', 'admin');

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_role app_role DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Admin Functions

Admins have access to:
- 📊 Analytics Dashboard (user statistics, charts)
- 👥 User Administration (create, edit, delete users)
- 🖼️ Image Manager (upload, delete site images)

---

## 📁 Storage

### Supabase Storage Buckets

| Bucket | Purpose | Access |
|--------|---------|--------|
| `images` | Site images (logos, icons, photos) | Public read, Admin write |
| `Videos.mp4` | Support videos for community pages | Public read |

### Storage RLS Policies

```sql
-- Anyone can view images
CREATE POLICY "Anyone can view images" ON storage.objects 
FOR SELECT USING (bucket_id = 'images');

-- Only admins can upload/modify/delete
CREATE POLICY "Admins can upload images" ON storage.objects 
FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'images' AND is_admin());
```

---

## 🖥 User Interface

### App Screens (10+ pages)

| Page | File | Description |
|------|------|-------------|
| **Home** | `index.html` | Main landing page with navigation tiles, sidebar, video |
| **Login/Register** | `login-modal-inject.js` | Modal dialogs for authentication |
| **My Profile** | `my-profile.html` | User profile with health tracking tabs |
| **Analytics Dashboard** | `dashboard.html` | Admin-only analytics, user management, image manager |
| **Nutrition** | `nutrition.html` | Diabetes-friendly recipes and meal plans |
| **Treatments** | `treatments.html` | Latest diabetes treatments and breakthroughs |
| **Physical Activities** | `physical-activities.html` | Exercise routines and guides |
| **BMI Calculator** | `bmi-calculator.html` | BMI and calorie calculator |
| **Share Your Story** | `share-your-story.html` | Community story submission form |
| **FAQ** | `faq.html` | Frequently asked questions |
| **About Us** | `about-us.html` | Organization information |

### Responsive Design

- Desktop: Full layout with sidebars
- Tablet: Adjusted grid layouts
- Mobile: Stacked layouts, collapsible navigation

---

## 🛠 Local Development Setup

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Git
- A Supabase account (free tier works)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/F19C-B351/DIABETES-COMPASS_V2.git
   cd DIABETES-COMPASS_V2
   ```

2. **Install dependencies** (if using build tools)
   ```bash
   npm install
   ```

3. **Configure Supabase**
   
   Update `supabase-init.js` with your Supabase credentials:
   ```javascript
   const SUPABASE_URL = 'https://your-project.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key';
   ```

4. **Run locally**
   
   Option A - Simple HTTP server:
   ```bash
   npx serve .
   ```
   
   Option B - VS Code Live Server extension

5. **Open in browser**
   ```
   http://localhost:3000
   ```

### Database Migrations

Migrations are stored in the Supabase dashboard. Key migrations include:
- User roles system (app_role enum, user_roles table)
- Health tracking tables (glucose, insulin, activity, weight entries)
- Storage policies for images bucket

---

## 📂 Project Structure

```
DIABETES-COMPASS_V2/
├── index.html              # Home page
├── login.html              # Login page (legacy)
├── my-profile.html         # User profile with health tracking
├── dashboard.html          # Admin analytics dashboard
├── nutrition.html          # Nutrition information
├── treatments.html         # Treatments information
├── physical-activities.html # Exercise guides
├── bmi-calculator.html     # BMI calculator
├── share-your-story.html   # Story submission
├── faq.html                # FAQ page
├── about-us.html           # About page
├── diagnose.html           # Diagnosis information
├── cycling.html            # Cycling activity guide
├── running.html            # Running activity guide
├── swimming.html           # Swimming activity guide
├── hiking.html             # Hiking activity guide
├── yoga.html               # Yoga activity guide
├── group-activities.html   # Group activities guide
│
├── styles.css              # Main stylesheet
├── responsive.css          # Responsive breakpoints
├── modal-styles.css        # Modal styling
├── assistant-styles.css    # Sidebar and layout styles
├── user-styles.css         # User-specific styles
│
├── script.js               # Main JavaScript
├── login.js                # Login logic
├── login-modal-inject.js   # Auth modals + admin link visibility
├── supabase-init.js        # Supabase client initialization
├── supabaseClient.js       # Supabase client export
├── supabase-utils.js       # Utility functions
│
├── upload-images.js        # Bulk image upload script
│
├── images/                 # Local image assets
│   ├── Diabetes Compass.jpg
│   ├── avatar_DIA.png
│   └── ...
│
├── icons/                  # Icon assets
│   └── *.svg
│
├── docs/                   # Additional documentation
│
├── README.md               # This file
├── SETUP.md                # Setup instructions
├── SUPABASE_INTEGRATION.md # Supabase details
└── TROUBLESHOOTING.md      # Common issues
```

---

## 🔑 Demo Credentials

### Test User Account
```
Email: demo@diabetescompass.com
Password: demo123456
Role: User
```

### Admin Account
```
Email: admin@diabetescompass.com
Password: admin123456
Role: Admin
```

> **Note:** These are sample credentials for testing purposes.

---

## 🚀 Deployment

### Netlify Deployment

The project is deployed on **Netlify** at: [https://diabetes-compassv2.netlify.app](https://diabetes-compassv2.netlify.app)

**Deployment Process:**
1. Connect GitHub repository to Netlify
2. Configure build settings (none needed - static HTML)
3. Deploy automatically on push to `main` branch

### Environment Variables

Supabase credentials are embedded in frontend code (anon key is safe for public use).

---

## 📦 GitHub Repository

**Repository:** [https://github.com/F19C-B351/DIABETES-COMPASS_V2](https://github.com/F19C-B351/DIABETES-COMPASS_V2)

### Commit History

- ✅ **15+ commits** demonstrating iterative development
- ✅ **Development over multiple days** showing sustained effort
- ✅ **Meaningful commit messages** describing changes

### Key Commits

| Commit | Description |
|--------|-------------|
| Initial commit | Project setup and basic structure |
| Add Supabase integration | Database connection and auth |
| Implement user profile | Profile page with health tracking |
| Add user roles system | Admin/user role-based access |
| Create Edge Functions | Server-side user management |
| Add Image Manager | Storage management UI |
| Implement responsive design | Mobile-friendly layouts |

---

## 🤖 Development Methodology

### AI-Assisted Development

This project was developed using **GitHub Copilot** as an AI development assistant, following this workflow:

```
┌─────────────────────────────────────────────────────────────┐
│                    AI DEV LOOP                               │
│                                                              │
│    ┌──────────┐    ┌──────────┐    ┌──────────┐            │
│    │  Prompt  │───▶│Implement │───▶│   Run    │            │
│    │ Copilot  │    │  Code    │    │  & Test  │            │
│    └──────────┘    └──────────┘    └────┬─────┘            │
│         ▲                               │                   │
│         │         ┌──────────┐          │                   │
│         │         │  Refine  │◀─────────┘                   │
│         │         └────┬─────┘                              │
│         │              │                                    │
│         │         ┌────▼─────┐                              │
│         └─────────│  Commit  │───▶ GitHub                   │
│                   │  & Push  │                              │
│                   └──────────┘                              │
└─────────────────────────────────────────────────────────────┘
```

### Development Steps

1. **Requirements Analysis** - Define features and user stories
2. **Database Design** - Create schema with tables and relationships
3. **Backend Setup** - Configure Supabase (Auth, DB, Storage, RLS)
4. **Frontend Development** - Build UI pages and components
5. **Integration** - Connect frontend to Supabase backend
6. **Testing** - Verify functionality across devices
7. **Deployment** - Deploy to Netlify
8. **Documentation** - Create comprehensive README

---

## 📄 License

This project is developed as a capstone project for educational purposes.

---

## 👤 Author

**Denitsa Rylands**

- GitHub: [@F19C-B351](https://github.com/F19C-B351)
- Project: Diabetes Compass V2

---

*Built with ❤️ for the diabetes community*
