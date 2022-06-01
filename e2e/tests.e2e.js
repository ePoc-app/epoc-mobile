describe('ePoc e2e tests suite', () => {
    beforeAll(async () => {
        if (browser.options.baseUrl) {
            await browser.url(browser.options.baseUrl+'/home/default');
        }
        await browser.pause(2000);
    })
    it('should launch and have a logo', async () => {
        await expect($('.logo')).toBeExisting();
    });
    it('should show avaible ePoc', async () => {
        await $('app-library ion-toolbar ion-button').click();

        const title = await $('app-settings ion-title');
        await title.waitForDisplayed({ timeout: 1000 });
        await expect(await title.getText()).toBe('PARAMÈTRES');
    });
    it('should show bibliotheque', async () => {
        const list = $$('app-settings ion-list')[2];
        const item = list.$$('ion-item')[1];
        const select = item.$('ion-select');
        await select.click();
        
    });
    it('should choose QLF', async () => {
        const alert = $('ion-alert');
        const button = alert.$$('button')[1];
        await button.click();
    });
    it('should leave bibliotheque', async () => {
        const alert = $('ion-alert');
        const button = alert.$$('button')[3];
        await button.click();
    });
    it('should return on home', async () => {
        const alert = $('ion-toolbar ion-buttons');
        await alert.click();

        await expect($('.logo')).toBeExisting();
    });
    it('should enter demo', async () => {
        const alert = $('app-library .library-item-toolbar ion-button');
        await alert.click();

        await expect($('.logo')).toBeExisting();
    });
    
    it('should click on first chapter and show chapter content', async () => {
        await $$('.toc-chapter-open')[3].click();

        const element = await $('.chapter-specs');
        await element.waitForDisplayed({ timeout: 1000 });
    });
    
    it('should go on first txt', async () => {

        const element2 = await $('.reader-action');
        await element2.waitForDisplayed({ timeout: 1000 });
        const btn = await $$('.reader-action');
        if(btn.length >= 3){
            await $$('.reader-action')[2].click();    
        }else{
            await $$('.reader-action')[1].click();
        }
    });
    it('should go on second page', async () => {
        const element = await $('html-content');
        await element.waitForDisplayed({ timeout: 1000 });

        await $$('.reader-action')[2].click();
    });
    it('should go on third page', async () => {
        const element = await $('html-content img');
        await element.waitForDisplayed({ timeout: 2000 });

        await $$('.reader-action')[2].click();
        await $$('.reader-action')[2].click();
        await $$('.reader-action')[2].click();

    });
    it('should start swipe act', async () => {
        const element = await $('assessment-content ion-button');
        await element.waitForDisplayed({ timeout: 2000 });
        
        await $('assessment-content ion-button').click();
        await browser.pause(5000);
        
    });
    
    // it('should have swipeable slides', async () => {
    //     await driver.performActions([
    //         {
    //             type: 'pointer',
    //             id: 'finger1',
    //             parameters: { pointerType: 'touch' },
    //             actions: [
    //                 { type: 'pointerMove', duration: 0, x: 250, y: 333 },
    //                 { type: 'pointerDown', button: 0 },
    //                 { type: 'pause', duration: 50 },
    //                 { type: 'pointerMove', duration: 300, x: 10, y: 333 },
    //                 { type: 'pointerUp', button: 0 },
    //             ],
    //         },
    //     ]);
    //     await driver.pause(300);
    //
    //     const slides = await $$('ion-slide');
    //     await expect(slides[1]).toHaveElementClass('swiper-slide-active')
    // });
    
    afterAll(async () => {
        await browser.pause(2000);
    })
});

