import path from 'path';
import fs from 'fs';

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
        platformName: 'Android',
        'appium:deviceName': 'Pixel 6',
        'appium:platformVersion': '14',
        'appium:automationName': 'UiAutomator2',
        'appium:app': path.join(__dirname, '../../android/app/build/outputs/apk/debug/app-debug.apk'),
        'appium:autoWebview': true,
        'appium:noReset': false,
        'appium:fullReset': false,
        'appium:newCommandTimeout': 240,
        'wdio:enforceWebDriverClassic': true,
    }],
    
    logLevel: 'warn',
    bail: 0,
    
    waitforTimeout: 30000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    
    hostname: '127.0.0.1',
    port: 4723,
    path: '/',
    
    services: [ // need npm install -g appium && appium driver install uiautomator2
        ['appium', {
            command: 'appium',
            args: {
                allowInsecure: '*:chromedriver_autodownload',
            }
        }]
    ],
    
    framework: 'mocha',
    reporters: ['spec'],
    
    mochaOpts: {
        ui: 'bdd',
        timeout: 120000
    },
    
    tsConfigPath: './tests/wdio/tsconfig.json',
    
    before: async function () {
        testCounter = 0;
        currentTestDir = getTestScreenshotDir();
        if (!fs.existsSync(currentTestDir)) {
            fs.mkdirSync(currentTestDir, { recursive: true });
        }
        
        await browser.startRecordingScreen();
        
        await browser.pause(5000);
        
        const contexts = await browser.getContexts();
        
        const webviewContext = contexts.find((ctx: any) => {
            const id = typeof ctx === 'string' ? ctx : ctx.id;
            return id && id.includes('WEBVIEW');
        });
        
        if (webviewContext) {
            const id = typeof webviewContext === 'string' ? webviewContext : webviewContext.id;
            await browser.switchContext(id);
        }
        
        const logo = await $('.epoc-logo');
        await logo.waitForExist({ timeout: 30000 });
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
    },
    
    after: async function () {
        const videoBase64 = await browser.stopRecordingScreen();
        const videoPath = path.join(currentTestDir, 'recording.mp4');
        fs.writeFileSync(videoPath, Buffer.from(videoBase64, 'base64'));
        console.log(`Video recording saved to: ${videoPath}`);
    }
};
