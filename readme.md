# Epoc Mobile

## Requirements

* Recent version of Node and npm
* Ionic `npm install -g ionic`
* Android studio [(guide)](https://ionicframework.com/docs/installation/android) and/or xcode [(guide)](https://ionicframework.com/docs/installation/ios)

## Getting started

```bash
# Install dependencies
npm i
```

```bash
# Serve app (browser)
ionic serve
```

**Android**
```
# Add android platform using capacitor
ionic capacitor add android

# Copy assets and plugins to android project
ionic capacitor sync android


# Run app
ionic capacitor run android

# Run app with livereload
ionic capacitor run android -l --address=[YOUR_IP_ADRESS]
```

This should have open Android Studio and you just need to run the app on a device. 
You may need to invalidate caches `File > Invalidate Caches / Restart` and sync gradle files

More info on : https://ionicframework.com/docs/building/android

**iOS**
```
# Add ios platform using capacitor
ionic capacitor add ios

# Run app
ionic capacitor run ios

# Run app with livereload
ionic capacitor run ios -l --address=[YOUR_IP_ADRESS]
```

This should have open Xcode and you just need to run the app on a device. 

More info on : https://ionicframework.com/docs/building/ios
