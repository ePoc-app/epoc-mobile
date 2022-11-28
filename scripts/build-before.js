const fs = require('fs');
module.exports = function(ctx) {
  const argMode = ctx.argv.find(arg => arg.indexOf('--mode=') > -1);
  const mode = argMode ? argMode.split('=')[1]: 'normal';
  const fileContent = `// This file is replaced during build by using --mode=ill|inria|normal
export const mode:'ill'|'inria'|'normal' = '${mode}';
`;

  console.log(`MODE : ${mode}`)
  
  fs.writeFile('src/environments/environment.mode.ts', fileContent, function (err) {
    if (err) return console.log(err);
  });

  const packageIdAndroid = `fr.inria.epoc`;
  const packageIdApple = `fr.inria.learninglab.epoc`;

  console.log(`ANDROID PACKAGE ID : ${packageIdAndroid}${mode !== 'normal' ? '.zrr' : ''}`)
  console.log(`APPLE PACKAGE ID : ${packageIdAndroid}${mode !== 'normal' ? '.zrr' : ''}`)

  searchAndReplace('android/app/build.gradle', new RegExp(`${packageIdAndroid}${mode !== 'normal' ? '': '.zrr'}`,'g'), `${packageIdAndroid}${mode !== 'normal' ? '.zrr' : ''}`)
  searchAndReplace('ios/App/App.xcodeproj/project.pbxproj', new RegExp(`${packageIdApple}${mode !== 'normal' ? '': '.zrr'}`,'g'), `${packageIdApple}${mode !== 'normal' ? '.zrr' : ''}`)
};

function searchAndReplace(file, search, replace) {
  fs.readFile(file, 'utf8', function (err,data) {
    if (err) return console.log(err);
    const result = data.replace(search, replace);

    fs.writeFile(file, result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });
}
