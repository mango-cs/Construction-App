# Construction Site Progress Dashboard

A mobile-first React app for construction site management with role-based access, photo/video updates, automated WhatsApp reminders, and incentive tracking.

## Features

### ✅ Core Features (Always Available)
- **User Authentication** - Email/password login with role-based access (Admin/Manager)
- **Progress Updates** - Create updates with photos (5 max) and videos (2 min max)
- **Mobile-First Design** - Optimized for construction site use
- **Real-time Updates** - Firebase Firestore for instant data sync

### 🔄 Admin-Configurable Features
- **Project Management** - Create and assign projects to managers
- **Task Assignment** - Assign specific tasks with due dates
- **Incentive System** - Set goals and track progress
- **WhatsApp Reminders** - Automated reminders during work hours
- **Work Hours Configuration** - Customizable reminder schedules

### 👥 User Roles
- **Admin** - Full access, configuration, analytics, user management
- **Manager** - Create updates, view progress, manage assigned projects

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS (mobile-first)
- **Backend**: Firebase (Firestore, Storage, Auth)
- **State Management**: React Query + Context
- **Routing**: React Router
- **Icons**: Lucide React
- **Deployment**: Vercel (frontend) + Firebase (backend)

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Main app pages
├── hooks/         # Custom React hooks
├── services/      # Firebase and API calls
├── utils/         # Helper functions
├── types/         # TypeScript definitions
└── locales/       # Telugu/English translations
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Firebase Setup
1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Enable Storage
5. Copy your Firebase config

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id_here
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

## Firebase Security Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Updates - users can create, read their own
    match /updates/{updateId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Projects - read all, write admin only
    match /projects/{projectId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/updates/{updateId}/{allPaths=**} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
  }
}
```

## Construction Sites Data

The app comes pre-configured with 6 construction sites:

1. **China Town** - 50% complete, Roof work
2. **Unos (dismantling)** - Dismantling phase
3. **Mango (big basket structure)** - 50% complete, Steel framing
4. **Mkh (dismantling)** - Dismantling phase
5. **Sandhya Hotel (AMP‑M)** - 5% complete, Foundation
6. **Sandhya Hospital (Petrol Bunk)** - 5% complete, Foundation

## Mobile Optimization

- **Touch-friendly** - Large buttons and touch targets
- **Fast loading** - Optimized for mobile networks
- **Responsive design** - Works on all screen sizes
- **Simple navigation** - Easy to use on construction sites

## WhatsApp Integration

- **Twilio WhatsApp Business API** for reminders
- **Customizable work hours** - Admin sets reminder times
- **Template messages** in Telugu/English
- **Automated scheduling** - Only during work hours

## Incentive System

- **Goal-based rewards** - Set targets for managers
- **Progress tracking** - Visual progress bars
- **Achievement notifications** - Celebrate milestones
- **Flexible targets** - Date-based or completion-based

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Support

For support and questions, contact the development team.

---

**Built for construction sites in Hyderabad, India** 🇮🇳
