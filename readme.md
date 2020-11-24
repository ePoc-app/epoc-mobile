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
# Build app
ionic build

# Serve app (browser)
ionic serve
```

**Android**
```
# Add android platform using capacitor (need to build first)
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
# Add ios platform using capacitor (need to build first)
ionic capacitor add ios

# Run app
ionic capacitor run ios

# Run app with livereload
ionic capacitor run ios -l --address=[YOUR_IP_ADRESS]
```

This should have open Xcode and you just need to run the app on a device. 

More info on : https://ionicframework.com/docs/building/ios

## App mode version (normal, inria, ill)

### ILL

This mode build the app for Inria Learning Lab internal use and allow to open an ePoc from a zip.

`ionic serve --mode=ill` ou `ionic cap run android --mode=ill`

### Inria

This mode build the app for Inria internal use (ZRR) and lock the cotnent behind an authentication guard.

`ionic serve --mode=inria` ou `ionic cap run android --mode=inria`


#### Inria : Authentication

Authentication is based on oAuth and the callback url is 
`http://localhost/callback` this works on mobile by using `InAppBrowser`
thats catches the callback and save it. 

To make it work on development environment you need to redirect the 
browser callback to `http://localhost:8100/callback` or whatever port
you are using. For this you can use an iptable rule :

```bash
# Add
sudo iptables -t nat -A OUTPUT -o lo -p tcp --dport 80 -j REDIRECT --to-port 8100

# Remove
sudo iptables -t nat -D OUTPUT -o lo -p tcp --dport 80 -j REDIRECT --to-port 8100
```
