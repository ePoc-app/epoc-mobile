// Fix for file-transfer to be able to download from files.inria.fr
const fs = require('fs');

console.log('FIX config.xml')
searchAndReplace(
    'android/app/src/main/res/xml/config.xml',
    '<access origin="*" />',
    `<access origin="*" subdomains="true" />
  <allow-navigation href="http://*/*" />
  <allow-navigation href="https://*/*" />
  <allow-intent href="http://*/*" />
  <allow-intent href="https://*/*" />`
)

function searchAndReplace(file, search, replace) {
  fs.readFile(file, 'utf8', function (err,data) {
    if (err) return console.log(err);
    const result = data.replace(search, replace);

    fs.writeFile(file, result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });
}
