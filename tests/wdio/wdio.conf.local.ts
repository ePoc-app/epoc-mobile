import fs from 'fs';
import path from 'path';

const screenshotDir = path.join(__dirname, 'screenshots');

function getTestScreenshotDir(): string {
    const now = new Date();
    const dateStr = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    return path.join(screenshotDir, dateStr);
}

let currentTestDir: string;
let testCounter = 0;

exports.config = {
    runner: 'local',
    
    specs: ['./specs/**/*.ts'],
    exclude: [],
    
    maxInstances: 1,
    
    capabilities: [{
        browserName: 'chrome',
        acceptInsecureCerts: true,
        'wdio:enforceWebDriverClassic': true,
        'goog:chromeOptions': {
            args: ['--window-size=390,844', '--disable-bidi'],
            mobileEmulation: { deviceName: 'iPhone 12 Pro' }
        }
    }],
    
    logLevel: 'warn',
    bail: 0,
    baseUrl: 'http://localhost:8100',
    
    waitforTimeout: 15000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    
    services: [],
    
    framework: 'mocha',
    reporters: ['spec'],
    
    mochaOpts: {
        ui: 'bdd',
        timeout: 120000
    },
    
    autoCompileOpts: {
        autoCompile: true,
        tsNodeOpts: {
            project: './tests/wdio/tsconfig.json',
            transpileOnly: true
        }
    },
    
    before: async function () {
        testCounter = 0;
        currentTestDir = getTestScreenshotDir();
        if (!fs.existsSync(currentTestDir)) {
            fs.mkdirSync(currentTestDir, { recursive: true });
        }
        
        await browser.url('/');
        const logo = await $('.epoc-logo');
        await logo.waitForExist({ timeout: 10000 });
    },
    
    afterTest: async function (test: any, context: any, { passed }: any) {
        testCounter++;
        const testNum = String(testCounter).padStart(2, '0');
        const parentSuite = test.parent ? test.parent.replace(/[^a-zA-Z0-9]/g, '_') : '';
        const testName = test.title.replace(/[^a-zA-Z0-9]/g, '_');
        const status = passed ? 'PASS' : 'FAIL';
        const filename = parentSuite 
            ? `${testNum}_${status}_${parentSuite}__${testName}.png`
            : `${testNum}_${status}_${testName}.png`;
        const filepath = path.join(currentTestDir, filename);
        
        await browser.saveScreenshot(filepath);
    }
};
