const fs = require('fs');
module.exports = function(ctx) {
  const argMode = ctx.argv.find(arg => arg.indexOf('--mode=') > -1);
  const mode = argMode ? argMode.split('=')[1]: 'normal';
  const fileContent = `// This file is replaced during build by using --mode=ill|inria
export const mode = {
  ill: ${mode === 'ill'},
  inria: ${mode === 'inria'}
};
`;
  
  fs.writeFile('src/environments/environment.mode.ts', fileContent, function (err) {
    if (err) return console.log(err);
    console.log(`Mode : ${mode}`)
  });
};
