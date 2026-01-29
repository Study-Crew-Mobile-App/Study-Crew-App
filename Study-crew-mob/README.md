# StudyCrew Mobile App 📱

> A beautiful, organized React Native mobile application for connecting students with study assistants.

## ✨ Features

- 🎨 **Beautiful Home Page** - Modern UI with smooth animations
- 📁 **Organized Structure** - Professional folder organization for scalability
- 🚀 **Easy Navigation** - File-based routing with Expo Router
- 📱 **Cross-Platform** - Works on iOS, Android, and Web
- 🎯 **User-Friendly** - Intuitive interface designed for students

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

### 3. Run on Device/Simulator
- **Expo Go (Phone)**: Scan QR code with Expo Go app
- **iOS Simulator**: Press `i` in terminal or run `npm run ios`
- **Android Emulator**: Press `a` in terminal or run `npm run android`
- **Web Browser**: Press `w` in terminal or run `npm run web`

## 📁 Project Structure

```
Study-crew-mob/
├── app/                      # Main application (Expo Router)
│   ├── index.tsx            # Entry point (redirects to home)
│   ├── _layout.tsx          # Navigation configuration
│   │
│   ├── home/                # ✅ Home page module
│   │   └── index.tsx       # Complete home page
│   │
│   ├── auth/                # 🔜 Authentication pages
│   ├── profile/             # 🔜 User profile pages
│   ├── courses/             # 🔜 Courses module
│   └── sessions/            # 🔜 Study sessions module
│
├── components/              # Reusable UI components
├── services/                # API services
└── Documentation/
    ├── SETUP_COMPLETE.md   # Setup summary
    ├── PROJECT_STRUCTURE.md # Full documentation
    ├── QUICK_GUIDE.md      # Quick reference
    └── HOME_PAGE_README.md # Home page details
```

## 📖 Documentation

- **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** - Overview of what's been set up
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Complete project structure and design system
- **[QUICK_GUIDE.md](./QUICK_GUIDE.md)** - Quick reference for adding new pages
- **[HOME_PAGE_README.md](./HOME_PAGE_README.md)** - Home page documentation

## 🎨 Design System

### Colors
- **Primary Green**: `#8fc95d`
- **Text Dark**: `#1f2937`
- **Text Gray**: `#6b7280`
- **Background**: `#ffffff`
- **Background Light**: `#f8fdf5`

### Key Features
- Smooth animations and transitions
- Platform-specific shadows (iOS/Android)
- Responsive layouts
- Modern, clean design

## 🛠️ Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **Expo Router** - File-based navigation
- **TypeScript** - Type safety
- **expo-linear-gradient** - Gradient backgrounds
- **React Native Reanimated** - Advanced animations

## 📱 Current Pages

### ✅ Home Page (`/home`)
- Hero section with animated blobs
- "I need an assistant" card
- "I'm here to assist" card
- Feature tags and descriptions
- Smooth entrance animations

### 🔜 Coming Soon
- Login/Signup pages
- User profile
- Courses browsing
- Assistant listings
- Study sessions

## 🔧 Adding New Pages

1. Create a file in `app/` directory:
   ```
   app/auth/login.tsx
   ```

2. Use the template from `QUICK_GUIDE.md`

3. Navigate to it:
   ```typescript
   router.push('/auth/login');
   ```

See **[QUICK_GUIDE.md](./QUICK_GUIDE.md)** for detailed examples.

## 📦 Available Scripts

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web

# Lint code
npm run lint

# Clear cache and restart
npm start --clear
```

## 🎯 Navigation Flow

```
App Launch (index.tsx)
    ↓
Automatic Redirect
    ↓
Home Page (/home) ✅
```

## 🐛 Troubleshooting

### White screen on launch?
```bash
npm start --clear
```

### Navigation not working?
- Ensure files are in `app/` directory
- Use `useRouter` from `expo-router`

### Styles not applying?
- Check StyleSheet syntax
- Verify color values

## 📚 Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native](https://reactnative.dev/)

## 🤝 Contributing

This is a student project for BITS Academic Excellence. Follow the established design system and folder structure when adding new features.

## 📄 License

This project is part of the StudyCrew platform.

---

**Status**: ✅ Home Page Complete  
**Next**: Authentication Pages  
**Version**: 1.0.0  
**Last Updated**: January 29, 2026

---

Made with ❤️ for BITS Students
