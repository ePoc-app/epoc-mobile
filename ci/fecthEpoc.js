const https = require('https')
const fs = require('fs')
const path = require('path')
const AdmZip = require('adm-zip');

fs.mkdir('./dist/assets/demo/epocs/', { recursive: true }, (err) => {
    if (err) throw err;
});

https.get({
    host: 'learninglab.gitlabpages.inria.fr',
    path: process.env.LIBRARY_PATH ? process.env.LIBRARY_PATH : '/epoc/epocs/list.json',
    headers: {'User-Agent': 'request'}
}, (res) => {
    let json = '';
    res.on('data', function (chunk) {
        json += chunk;
    });
    res.on('end', function () {
        if (res.statusCode === 200) {
            try {
                const data = JSON.parse(json);
                data.forEach(epoc => {
                    download(epoc.download)
                })
            } catch (e) {
                console.log('Error parsing JSON!');
            }
        } else {
            console.log('Status:', res.statusCode);
        }
    });
}).on('error', function (err) {
    console.log('Error:', err);
});


const download = (url) => {
    const filename = path.basename(url);
    const filepath = path.join('./dist/assets/demo/epocs/', filename)
    const file = fs.createWriteStream(filepath);
    console.log(`Download ${url} into ${filepath}`);
    https.get(url, function(response) {
        response.pipe(file);
        file.on("finish", () => {
            file.close();
            console.log(`Download complete ${filepath}`);
            unzip(filepath);
        });
    });
}


const unzip = (filepath) => {
    const zip = new AdmZip(filepath, null);
    const targetPath = path.join(path.dirname(filepath), path.basename(filepath, '.zip'));
    console.log(`Extract ${filepath}`);
    zip.extractAllTo(targetPath, true, true, null);
    console.log(`Delete ${filepath}`);
    fs.unlinkSync(filepath)
}
