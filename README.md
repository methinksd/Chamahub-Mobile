# Chamahub Mobile

A mobile application for Chamahub built with Ionic Framework and Angular.

## Project Information

- **Framework**: Ionic 8.7.11 with Angular 20.3.13
- **Platform**: Android (Capacitor 7.4.4)
- **Package ID**: `com.chamahub.mobile`
- **Architecture**: Standalone Components

## Prerequisites

- Node.js v22.19.0 or higher
- npm 10.9.3 or higher
- Ionic CLI 7.2.1 or higher
- Android Studio (for Android development)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/methinksd/Chamahub-Mobile.git
cd Chamahub-Mobile
```

2. Install dependencies:
```bash
npm install
```

## Development

### Running in Browser
```bash
ionic serve
```

### Building for Production
```bash
ionic build
```

### Android Development

#### Sync with Android platform
```bash
npx cap sync android
```

#### Open in Android Studio
```bash
npx cap open android
```

#### Run on Android device/emulator
```bash
ionic capacitor run android
```

## Project Structure

```
Chamahub-Mobile/
├── android/              # Native Android project
├── src/
│   ├── app/             # Application components and routing
│   │   ├── home/        # Home page component
│   │   ├── app.component.ts
│   │   └── app.routes.ts
│   ├── assets/          # Static assets (images, icons)
│   ├── environments/    # Environment configurations
│   └── theme/           # Global styles and theme variables
├── capacitor.config.ts  # Capacitor configuration
├── ionic.config.json    # Ionic CLI configuration
├── angular.json         # Angular CLI configuration
└── package.json         # Dependencies and scripts
```

## Capacitor Plugins

The following Capacitor plugins are installed:
- `@capacitor/app` - App state and URL handling
- `@capacitor/haptics` - Haptic feedback
- `@capacitor/keyboard` - Keyboard control
- `@capacitor/status-bar` - Status bar styling

## Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `npm run lint` - Run ESLint

## Configuration Files

- **capacitor.config.ts**: Capacitor configuration including app ID, name, and web directory
- **ionic.config.json**: Ionic framework configuration
- **angular.json**: Angular build and serve options
- **tsconfig.json**: TypeScript compiler options

## Troubleshooting

### Build Issues
- Ensure all dependencies are installed: `npm install`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Sync Capacitor: `npx cap sync`

### Android Issues
- Open Android project in Android Studio and sync Gradle
- Check Android SDK installation
- Verify ANDROID_HOME environment variable is set

## Initial Setup Notes

The project was initialized with:
- Ionic blank starter template
- Angular with Standalone Components architecture
- Capacitor for native functionality
- Android platform pre-configured

## Version Control

The project is connected to GitHub repository:
- **Repository**: https://github.com/methinksd/Chamahub-Mobile
- **Branch**: master

## License

[Add license information here]

## Contributors

[Add contributor information here]
