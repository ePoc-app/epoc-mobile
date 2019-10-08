const fs = require('fs');

const SOURCE_IOS_ICON = 'resources/ios/icon/';
const SOURCE_IOS_SPLASH = 'resources/ios/splash/';

const TARGET_IOS_ICON = 'ios/App/App/Assets.xcassets/AppIcon.appiconset/';
const TARGET_IOS_SPLASH = 'ios/App/App/Assets.xcassets/Splash.imageset/';

const SOURCE_ANDROID_ICON = 'resources/android/icon/';
const SOURCE_ANDROID_SPLASH = 'resources/android/splash/';

const TARGET_ANDROID_ICON = 'android/app/src/main/res/';
const TARGET_ANDROID_SPLASH = 'android/app/src/main/res/';

const IOS_ICONS = {
  "icon-20.png":      "AppIcon-20x20@1x.png",
  "icon-20@2x.png":   "AppIcon-20x20@2x.png",
  "icon-20@2x.png":   "AppIcon-20x20@2x-1.png",
  "icon-20@3x.png":   "AppIcon-20x20@3x.png",
  "icon-29.png":      "AppIcon-29x29@1x.png",
  "icon-29@2x.png":   "AppIcon-29x29@2x.png",
  "icon-29@2x.png":   "AppIcon-29x29@2x-1.png",
  "icon-29@3x.png":   "AppIcon-29x29@3x.png",
  "icon-40.png":      "AppIcon-40x40@1x.png",
  "icon-40@2x.png":   "AppIcon-40x40@2x.png",
  "icon-40@3x.png":   "AppIcon-40x40@3x.png",
  "icon-60.png":      "AppIcon-60x60@1x.png",
  "icon-60@2x.png":   "AppIcon-60x60@2x.png",
  "icon-60@2x.png":   "AppIcon-60x60@2x-1.png",
  "icon-60@3x.png":   "AppIcon-60x60@3x.png",
  "icon-72.png":      "AppIcon-72x72.png",
  "icon-72@2x.png":   "AppIcon-72x72@2x.png",
  "icon-76.png":      "AppIcon-76x76.png",
  "icon-76.png":      "AppIcon-76x76@1x.png",
  "icon-76@2x.png":   "AppIcon-76x76@2x.png",
  "icon-83.5@2x.png": "AppIcon-83.5x83.5@2x.png",
  "icon-1024.png":    "AppIcon-512@2x.png",
};
const IOS_SPLASHES = {
  "Default-Portrait@~ipadpro.png": "splash-2732x2732.png",
  "Default-Portrait@~ipadpro.png": "splash-2732x2732-1.png",
  "Default-Portrait@~ipadpro.png": "splash-2732x2732-2.png"
}

const ANDROID_ICONS = {
  "drawable-ldpi-icon.png": "drawable-hdpi-icon.png",
  "drawable-mdpi-icon.png": "mipmap-mdpi/ic_launcher.png",
  "drawable-mdpi-icon.png": "mipmap-mdpi/ic_launcher_round.png",
  "drawable-mdpi-icon.png": "mipmap-mdpi/ic_launcher_foreground.png",
  "drawable-hdpi-icon.png": "mipmap-hdpi/ic_launcher.png",
  "drawable-hdpi-icon.png": "mipmap-hdpi/ic_launcher_round.png",
  "drawable-hdpi-icon.png": "mipmap-hdpi/ic_launcher_foreground.png",
  "drawable-xhdpi-icon.png": "mipmap-xhdpi/ic_launcher.png",
  "drawable-xhdpi-icon.png": "mipmap-xhdpi/ic_launcher_round.png",
  "drawable-xhdpi-icon.png": "mipmap-xhdpi/ic_launcher_foreground.png",
  "drawable-xxhdpi-icon.png": "mipmap-xxhdpi/ic_launcher.png",
  "drawable-xxhdpi-icon.png": "mipmap-xxhdpi/ic_launcher_round.png",
  "drawable-xxhdpi-icon.png": "mipmap-xxhdpi/ic_launcher_foreground.png",
  "drawable-xxxhdpi-icon.png": "mipmap-xxxhdpi/ic_launcher.png",
  "drawable-xxxhdpi-icon.png": "mipmap-xxxhdpi/ic_launcher_round.png",
  "drawable-xxxhdpi-icon.png": "mipmap-xxxhdpi/ic_launcher_foreground.png"
}
const ANDROID_SPLASHES = {
  "drawable-land-ldpi-screen.png": "splash.png",
  "drawable-land-mdpi-screen.png": "drawable-land-mdpi/splash.png",
  "drawable-land-hdpi-screen.png": "drawable-land-hdpi/splash.png",
  "drawable-land-xhdpi-screen.png": "drawable-land-xhdpi/splash.png",
  "drawable-land-xxhdpi-screen.png": "drawable-land-xxhdpi/splash.png",
  "drawable-land-xxxhdpi-screen.png": "drawable-land-xxxhdpi/splash.png",
  "drawable-port-mdpi-screen.png": "drawable-port-mdpi/splash.png",
  "drawable-port-hdpi-screen.png": "drawable-port-hdpi/splash.png",
  "drawable-port-xhdpi-screen.png": "drawable-port-xhdpi/splash.png",
  "drawable-port-xxhdpi-screen.png": "drawable-port-xxhdpi/splash.png",
  "drawable-port-xxxhdpi-screen.png": "drawable-port-xxxhdpi/splash.png",
}

function copyImages(sourcePath, targetPath, images) {
  for (const [key, value] of Object.entries(images)) {
    let source = sourcePath + key;
    let target = targetPath + value;
    fs.copyFile(source, target, (err) => {
      if (err) throw err;
      console.log(`${source} >> ${target}`);
    });
  }
}

copyImages(SOURCE_IOS_ICON, TARGET_IOS_ICON, IOS_ICONS);
copyImages(SOURCE_IOS_SPLASH, TARGET_IOS_SPLASH, IOS_SPLASHES);

copyImages(SOURCE_ANDROID_ICON, TARGET_ANDROID_ICON, ANDROID_ICONS);
copyImages(SOURCE_ANDROID_SPLASH, TARGET_ANDROID_SPLASH, ANDROID_SPLASHES);
