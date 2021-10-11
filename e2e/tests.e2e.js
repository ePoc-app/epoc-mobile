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
    it('should show course details', async () => {
        await $('app-home .start-course').click();
        
        const title = await $('app-about-epoc ion-title');
        await title.waitForDisplayed({ timeout: 1000 });
        await expect(await title.getText()).toBe('Informations');
    });
    it('should show course table of content', async () => {
        await $('app-about-epoc .start-course').click();
        
        const toc = await $('app-toc-epoc .tocContent');
        await toc.waitForDisplayed({ timeout: 1000 });
        await expect(toc).toBeExisting();
    });
    
    it('should click on first chapter and show chapter content', async () => {
        await $$('.tocContent .chapters .part')[0].click();
        
        const chapterContent = await $('.page-content-chapter');
        await chapterContent.waitForDisplayed({ timeout: 1000 });
        await expect(chapterContent).toBeExisting();
    });
    
    it('should have clickable slides', async () => {
        await driver.pause(300);
        const slides = await $$('ion-slide');
        // Go to next page
        await $('.page-action.page-next').click();
        await driver.pause(300);
        await expect(slides[1]).toHaveElementClass('swiper-slide-active')
        // Go back to previous page
        await $('.page-action.page-prev').click()
        await driver.pause(300)
        await expect(slides[0]).toHaveElementClass('swiper-slide-active')
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

