# ePoc Mobile

Mobile application for reading ePoc (Electronic Pocket Open Course) content.

## About

ePoc Mobile is a cross-platform mobile application built with Ionic 8, Vue 3, and Capacitor 5. It allows users to browse, download, and read ePoc content from various libraries.

## Features

- Browse ePoc libraries
- Download and manage ePoc content
- Read ePoc content offline
- Track progress and scores
- Support for multiple languages
- Dark mode support
- Accessibility features

## Technology Stack

- **Framework**: Vue 3
- **UI Library**: Ionic 8
- **Native Bridge**: Capacitor 5
- **State Management**: Pinia
- **Internationalization**: Vue I18n
- **Styling**: SCSS
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Ionic CLI 7.x or higher

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/epoc-mobile.git
   cd epoc-mobile
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run the development server
   ```bash
   npm run dev
   ```

### Building for Production

```bash
npm run build
```

### Running on iOS

```bash
npm run ios
```

### Running on Android

```bash
npm run android
```

## Project Structure

```
epoc-mobile/
├── public/              # Static assets
├── src/                 # Source code
│   ├── assets/          # Assets (images, fonts, etc.)
│   ├── components/      # Reusable Vue components
│   ├── environments/    # Environment configuration
│   ├── router/          # Vue Router configuration
│   ├── stores/          # Pinia stores
│   ├── theme/           # Theme configuration
│   ├── views/           # Vue views/pages
│   ├── App.vue          # Main App component
│   └── main.ts          # Application entry point
├── capacitor.config.ts  # Capacitor configuration
├── index.html           # HTML entry point
├── ionic.config.json    # Ionic configuration
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the terms of the LICENSE file included in the repository.

## Acknowledgements

- [Inria Learning Lab](https://learninglab.inria.fr) for the ePoc platform
- [Ionic Framework](https://ionicframework.com) for the UI components
- [Vue.js](https://vuejs.org) for the frontend framework
- [Capacitor](https://capacitorjs.com) for the native runtime
