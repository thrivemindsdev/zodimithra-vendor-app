# Layout Structure

This document describes the layout system and common components for the Zodimithra Vendor project.

## Directory Structure

```
src/
├── layouts/
│   └── MainLayout.jsx          # Main layout wrapper for all pages
├── components/
│   └── common/
│       ├── Header.jsx          # Header component (customizable)
│       ├── Footer.jsx          # Footer component
│       └── Sidebar.jsx         # Sidebar component (for desktop)
└── pages/
    └── Home/
        └── Home.jsx            # Home page content
```

## Components

### 1. **Header Component** (`src/components/common/Header.jsx`)

The Header component displays a branded header with optional online status.

**Props:**
- `title` (string, optional): Display name (default: "Acharya Pandit JI")
- `showOnlineStatus` (boolean, optional): Show/hide online status pill (default: true)

**Example Usage:**
```jsx
<Header 
  title="Acharya Pandit JI" 
  showOnlineStatus={true} 
/>
```

### 2. **Footer Component** (`src/components/common/Footer.jsx`)

The Footer component displays navigation links and copyright information.

**Features:**
- Privacy Policy link
- Terms link
- Contact link
- Auto-updating copyright year

### 3. **Sidebar Component** (`src/components/common/Sidebar.jsx`)

The Sidebar component provides navigation menu (hidden on mobile, visible on desktop).

**Menu Items:**
- Dashboard
- Services
- My Profile
- Earnings
- Reviews
- Settings

### 4. **MainLayout Component** (`src/layouts/MainLayout.jsx`)

The MainLayout wraps all pages and provides a consistent layout structure.

**Props:**
- `children` (ReactNode): Page content to render in the main area
- `headerProps` (object, optional): Props to pass to the Header component
- `showSidebar` (boolean, optional): Show/hide sidebar (default: false)

**Example Usage:**
```jsx
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home/Home';

function App() {
  return (
    <MainLayout
      headerProps={{
        title: 'Acharya Pandit JI',
        showOnlineStatus: true,
      }}
      showSidebar={false}
    >
      <Home />
    </MainLayout>
  );
}
```

## Usage in Pages

All pages should be wrapped with `MainLayout`. Here's how to create a new page:

```jsx
import React from 'react';

export default function MyNewPage() {
  return (
    <div className="w-full px-4 py-6">
      {/* Your page content here */}
    </div>
  );
}
```

Then in `App.jsx`:

```jsx
import MainLayout from './layouts/MainLayout';
import MyNewPage from './pages/MyNewPage/MyNewPage';

function App() {
  return (
    <MainLayout>
      <MyNewPage />
    </MainLayout>
  );
}
```

## Styling

The layout uses:
- **Tailwind CSS** for utility-first styling
- **Custom color palette** matching Zodimithra brand (browns, golds, blues)
- **Responsive design** that adapts from mobile (430px) to desktop
- **Gradient backgrounds** and glassmorphism effects

## Key Features

✅ Reusable layout component
✅ Common header with branding
✅ Footer with links
✅ Optional sidebar navigation
✅ Mobile-responsive design
✅ Customizable header per page
✅ Consistent styling across pages
