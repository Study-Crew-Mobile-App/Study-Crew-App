# StudyCrew Mobile App - Home Page

## Overview
This is a complete React Native home page replica based on the web version (`study-crew-frontend-main`). The mobile app features a beautiful, user-friendly interface optimized for mobile devices.

## Features Implemented

### 🎨 Design Elements
- **Decorative Background Blobs**: Animated green gradient blobs for visual appeal
- **Smooth Animations**: Fade-in, slide-up, and scale animations on page load
- **Gradient Cards**: Beautiful gradient backgrounds on feature cards
- **Responsive Layout**: Optimized for various mobile screen sizes
- **Platform-Specific Shadows**: iOS and Android-specific shadow implementations

### 📱 UI Components

#### Hero Section
- **Badge**: "BITS ACADEMIC EXCELLENCE" with subtle border and shadow
- **Main Heading**: Large, bold heading with brand name in green
- **Subheading**: Clear description of the platform's purpose
- **Feature Tags**: Three pill-shaped tags highlighting key features:
  - ✓ Expert Assistants
  - ✓ 24/7 Support
  - ✓ Verified Tutors

#### Cards Section
Two interactive cards with:
1. **"I need an assistant"** card
   - Book emoji icon (📚)
   - Green circular icon background with pulse effect
   - "Get Help Now" CTA button
   - Features list:
     - Instant matching with available assistants
     - Track your learning progress
     - Secure and verified platform

2. **"I'm here to assist"** card
   - People emoji icon (👥)
   - Green circular icon background with pulse effect
   - "Become an Assistant" CTA button
   - Features list:
     - Flexible scheduling options
     - Build your teaching portfolio
     - Earn knowledge while you help

## Color Scheme
- **Primary Green**: `#8fc95d`
- **Text Dark**: `#1f2937`
- **Text Gray**: `#6b7280`, `#4b5563`
- **Background**: `#ffffff`
- **Gradient**: White to light green (`#f8fdf5`)

## Technical Stack
- **React Native**: Core framework
- **Expo**: Development platform
- **expo-linear-gradient**: For gradient backgrounds
- **Animated API**: For smooth animations
- **TypeScript**: Type safety

## Installation & Setup

### Prerequisites
- Node.js installed
- Expo CLI installed
- Expo Go app on your mobile device (for testing)

### Steps
1. Navigate to the project directory:
   ```bash
   cd Study-crew-mob
   ```

2. Install dependencies (already done):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

## File Structure
```
Study-crew-mob/
├── app/
│   ├── index.tsx          # Main home page component
│   └── _layout.tsx        # Layout configuration
├── assets/                # Images and assets
├── package.json           # Dependencies
└── README.md             # This file
```

## Animations
The home page includes several smooth animations:
- **Fade-in**: Hero content fades in on load (800ms)
- **Slide-up**: Hero content slides up from below (800ms)
- **Scale**: Cards scale up with spring animation
- **Staggered**: Second card animation delayed by 200ms

## Next Steps / TODOs
- [ ] Implement navigation to login/signup screens
- [ ] Add authentication context
- [ ] Connect to backend API
- [ ] Implement role-based routing (user vs assistant)
- [ ] Add more pages (profile, courses, etc.)
- [ ] Implement state management (Redux/Context)

## Platform Support
- ✅ iOS
- ✅ Android
- ✅ Web (via Expo)

## Performance Optimizations
- Native driver enabled for all animations
- Optimized shadow rendering for both platforms
- Efficient re-rendering with React hooks
- ScrollView with optimized content container

## Customization
To customize colors, update the following in `app/index.tsx`:
- Primary color: Search for `#8fc95d`
- Text colors: Update in StyleSheet
- Animation timing: Modify duration values in useEffect

## Testing
Run the app on:
- **Physical Device**: Best for testing animations and performance
- **iOS Simulator**: `npm run ios`
- **Android Emulator**: `npm run android`
- **Web Browser**: `npm run web`

## Credits
Based on the web version from `study-crew-frontend-main/src/pages/home/page.tsx`

---
**Version**: 1.0.0  
**Last Updated**: January 29, 2026  
**Developer**: StudyCrew Team
