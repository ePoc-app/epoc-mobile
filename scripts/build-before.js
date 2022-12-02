const fs = require('fs');
module.exports = async function (ctx) {
  const argMode = ctx.argv.find(arg => arg.indexOf('--mode=') > -1);
  const mode = argMode ? argMode.split('=')[1] : 'normal';
  const fileContent = `// This file is replaced during build by using --mode=ill|inria|normal
export const mode:'ill'|'inria'|'normal' = '${mode}';
`;

  console.log(`MODE : ${mode}`)

  fs.writeFile('src/environments/environment.mode.ts', fileContent, function (err) {
    if (err) return console.log(err);
  });

  const packageIdAndroid = `fr.inria.epoc`;
  const packageIdApple = `fr.inria.learninglab.epoc`;

  const appNameSearch = mode !== 'normal' ? 'ePoc' : 'ePoc ZRR';
  const appNameReplace = mode !== 'normal' ? 'ePoc ZRR' : 'ePoc';
  const searchApple = `${packageIdApple}${mode !== 'normal' ? '' : '.zrr'};`;
  const replaceApple = `${packageIdApple}${mode !== 'normal' ? '.zrr' : ''};`;
  const searchAndroid = `${packageIdAndroid}${mode !== 'normal' ? '' : '.zrr'}"`;
  const replaceAndroid = `${packageIdAndroid}${mode !== 'normal' ? '.zrr' : ''}"`;

  console.log(`APP NAME : ${appNameReplace}`)
  console.log(`APPLE PACKAGE ID : ${replaceApple}`)
  console.log(`ANDROID PACKAGE ID : ${searchAndroid} ${replaceAndroid}`)

  await searchAndReplace('ios/App/App.xcodeproj/project.pbxproj', new RegExp(searchApple, 'g'), replaceApple)
  await searchAndReplace('ios/App/App/Info.plist', `<string>${appNameSearch}</string>`, `<string>${appNameReplace}</string>`)

  await searchAndReplace('android/app/build.gradle', new RegExp(searchAndroid, 'g'), replaceAndroid)
  await searchAndReplace('android/app/src/main/res/values/strings.xml', `<string name="app_name">${appNameSearch}</string>`, `<string name="app_name">${appNameReplace}</string>`)
  await searchAndReplace('android/app/src/main/res/values/strings.xml', `<string name="title_activity_main">${appNameSearch}</string>`, `<string name="title_activity_main">${appNameReplace}</string>`)
};

function searchAndReplace(file, search, replace) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', function (err,data) {
      if (err) return reject(err);
      const result = data.replace(search, replace);

      fs.writeFile(file, result, 'utf8', function (err) {
        if (err) return reject(err);
        resolve()
      });
    });
  })
}
