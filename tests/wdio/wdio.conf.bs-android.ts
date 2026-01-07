exports.config = {
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,
  hostname: 'hub.browserstack.com',
  services: [
    [
      'browserstack',
      {
        buildIdentifier: '${BUILD_NUMBER}',
        app: process.env.BROWSERSTACK_ANDROID_APP,
      }
    ]
  ],
  capabilities: [{
    'bstack:options': {
      deviceName: 'Google Pixel 8',
      osVersion: "14.0"
    }
  }, {
    'bstack:options': {
      deviceName: 'Samsung Galaxy A10',
      osVersion: "9.0"
    }
  }],
  commonCapabilities: {
    'bstack:options': {
      projectName: 'ePoc',
      buildName: 'ePoc Android',
      sessionName: 'ePoc e2e tests',
      debug: true,
      networkLogs: true,
      source: 'webdriverio:appium-sample-sdk:v1.0'
    }
  },
  maxInstances: 10,
  specs: ['./specs/**/*.ts'],
  exclude: [],
  logLevel: 'warn',
  coloredLogs: true,
  screenshotPath: './errorShots/',
  baseUrl: '',
  waitforTimeout: 30000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
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
    await browser.pause(5000);
    
    const contexts = await browser.getContexts();
    console.log('Contexts:', contexts);
    
    const webviewContext = contexts.find((ctx: any) => {
      const contextId = typeof ctx === 'string' ? ctx : ctx.id;
      return contextId && contextId.includes('WEBVIEW');
    });
    
    if (webviewContext) {
      const contextId = typeof webviewContext === 'string' ? webviewContext : webviewContext.id;
      console.log('Context changed:', contextId);
      await browser.switchContext(contextId);
    } else {
      console.log('No WebView context found, using native context');
    }
    
    const logo = await $('.epoc-logo');
    await logo.waitForExist({ timeout: 30000 });
  }
};

// Code to support common capabilities
exports.config.capabilities.forEach(function(caps: any){
  for(const key in exports.config.commonCapabilities)
    caps[key] = { ...caps[key], ...exports.config.commonCapabilities[key]};
});