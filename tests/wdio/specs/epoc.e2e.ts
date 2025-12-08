describe('ePoc Vue e2e tests suite', () => {
    before(async () => {
        await browser.pause(2000);
    });

    describe('Library Page', () => {
        it('should launch and display the logo', async () => {
            const logo = await $('.epoc-logo');
            await expect(logo).toBeExisting();
        });

        it('should display the by-inria logo', async () => {
            const byInria = await $('.by-inria');
            await expect(byInria).toBeExisting();
        });

        it('should display the toolbar with two buttons', async () => {
            const toolbar = await $('ion-toolbar');
            await expect(toolbar).toBeExisting();
            
            // Settings and about buttons
            const buttons = await $$('ion-toolbar ion-button');
            await expect(buttons.length).toBeGreaterThanOrEqual(2);
        });

        it('should have library content', async () => {
            const content = await $('ion-content');
            await expect(content).toBeExisting();
        });

        it('should display library if available', async () => {
            const container = await $('#container');
            await expect(container).toBeExisting();
        });

        it('should have at least one library item', async () => {
            const libraryItems = await $$('#container .library-item');
            await expect(libraryItems.length).toBeGreaterThan(0);
        });
    });

    describe('About Page', () => {
        it('should navigate to about page via info button', async () => {
            const buttons = await $$('ion-toolbar ion-button');
            const aboutButton = buttons[1]; // about
            await aboutButton.waitForClickable({ timeout: 5000 });
            await aboutButton.click();
            await browser.pause(2000);

            const aboutContent = await $('.about-content-wrapper');
            await expect(aboutContent).toBeExisting();
        });

        it('should display about header with logos', async () => {
            const aboutHeader = await $('.about-header');
            await expect(aboutHeader).toBeExisting();

            const logos = await $$('.about-header .logo');
            await expect(logos.length).toBe(2);
        });

        it('should display contact section', async () => {
            const contactSection = await $('.about-contact');
            await expect(contactSection).toBeExisting();
        });

        it('should display contact email links', async () => {
            const mailLinks = await $$('.about-contact a[href^="mailto:"]');
            await expect(mailLinks.length).toBeGreaterThan(0);
        });

        it('should return to library from about page', async () => {
            const backButton = await $('ion-back-button');
            await backButton.waitForClickable({ timeout: 5000 });
            await backButton.click();
            await browser.pause(2000);

            const logo = await $('.epoc-logo');
            await expect(logo).toBeExisting();
        });
    });

    describe('Settings Page', () => {
        it('should navigate to settings page via gear button', async () => {
            const buttons = await $$('ion-toolbar ion-button');
            const settingsButton = buttons[0]; // settings
            await settingsButton.waitForClickable({ timeout: 5000 });
            await settingsButton.click();
            await browser.pause(2000);

            const settingsContent = await $('ion-content .wrapper');
            await expect(settingsContent).toBeExisting();
        });

        it('should display settings title', async () => {
            const title = await $('ion-title');
            await title.waitForDisplayed({ timeout: 5000 });
            await expect(title).toBeExisting();
        });

        it('should display settings sections', async () => {
            const listHeaders = await $$('ion-list-header');
            await expect(listHeaders.length).toBeGreaterThan(0);
        });

        it('should have debug toggle', async () => {
            const toggle = await $('ion-toggle');
            await expect(toggle).toBeExisting();
        });

        it('should debug toggle be clickable', async () => {
            const toggle = await $('ion-toggle');
            await toggle.waitForClickable({ timeout: 5000 });
            await toggle.click();
            await browser.pause(1000);
        });

        it('should debug toggle back to original state', async () => {
            const toggle = await $('ion-toggle');
            await toggle.waitForClickable({ timeout: 5000 });
            await toggle.click();
            await browser.pause(1000);
        });

        it('should have language selector', async () => {
            const selects = await $$('ion-select');
            const languageSelect = selects[0];
            await expect(languageSelect).toBeExisting();
        });

        it('should have language selector options', async () => {
            const selects = await $$('ion-select');
            const languageSelect = selects[0];
            await languageSelect.waitForClickable({ timeout: 5000 });
            await languageSelect.click();
            await browser.pause(1000);

            const alert = await $('ion-alert');
            await expect(alert).toBeExisting();

            const alertButtons = await $$('ion-alert button');
            await expect(alertButtons.length).toBeGreaterThan(0);
        });

        it('should language selector close on cancel', async () => {
            const alertButtons = await $$('ion-alert button');
            const cancelButton = alertButtons[await alertButtons.length - 2];
            await cancelButton.waitForClickable({ timeout: 5000 });
            await cancelButton.click();
            await browser.pause(1000);
        });

        it('should have theme selector', async () => {
            const selects = await $$('ion-select');
            const themeSelect = selects[1];
            await expect(themeSelect).toBeExisting();
        });

        it('should have theme selector options', async () => {
            const selects = await $$('ion-select');
            const themeSelect = selects[1];
            await themeSelect.waitForClickable({ timeout: 5000 });
            await themeSelect.click();
            await browser.pause(1000);

            const alert = await $('ion-alert');
            await expect(alert).toBeExisting();
        });

        it('should theme selector close on cancel', async () => {
            const alertButtons = await $$('ion-alert button');
            const cancelButton = alertButtons[await alertButtons.length - 2];
            await cancelButton.waitForClickable({ timeout: 5000 });
            await cancelButton.click();
            await browser.pause(1000);
        });

        it('should return to library page', async () => {
            const backButton = await $('ion-back-button');
            await backButton.waitForClickable({ timeout: 5000 });
            await backButton.click();
            await browser.pause(2000);

            const logo = await $('.epoc-logo');
            await expect(logo).toBeExisting();
        });
    });

    describe('first ePoc Download Test', () => {
        it('should find the first ePoc in official collection', async () => {
            const firstEpocInCollection = await $('#container .library-item');
            await expect(firstEpocInCollection).toBeExisting();
        });

        it('should click download button and wait for "Discover" button', async () => {
            const firstEpoc = await $('#container .library-item');
            
            const downloadButton = await firstEpoc.$('ion-button.expanded[color="inria-base-button"]');
            
            if (await downloadButton.isExisting()) {
                await downloadButton.waitForClickable({ timeout: 5000 });
                await downloadButton.click();
                
                // Wait for download
                await browser.waitUntil(
                    async () => {
                        const discoverBtn = await firstEpoc.$('ion-button.expanded[color="inria"]');
                        if (await discoverBtn.isExisting()) {
                            return true;
                        }

                        return false;
                    },
                    { 
                        timeout: 120000, 
                        interval: 2000,
                        timeoutMsg: 'Download did not complete within 120 seconds' 
                    }
                );
            } else {
                const discoverButton = await firstEpoc.$('ion-button.expanded[color="inria"]');
                if (await discoverButton.isExisting()) {
                    console.log(`ePoc already downloaded`);
                } else {
                    throw new Error('No download or discover button found');
                }
            }
        });

        it('should have "Discover" button visible', async () => {
            const firstEpoc = await $('#container .library-item');
            const discoverButton = await firstEpoc.$('ion-button.expanded[color="inria"]');
            await expect(discoverButton).toBeExisting();
        });

        it('should have "..." options button visible', async () => {
            const firstEpoc = await $('#container .library-item');
            const optionsButton = await firstEpoc.$('ion-button.round');
            await expect(optionsButton).toBeExisting();
            
            const buttonText = await optionsButton.getText();
            await expect(buttonText.trim()).toBe('...');
        });

        it('should open ePoc TOC when clicking Discover', async () => {
            const firstEpoc = await $('#container .library-item');
            const discoverButton = await firstEpoc.$('ion-button.expanded[color="inria"]');
            
            await discoverButton.waitForClickable({ timeout: 5000 });
            await discoverButton.click();
            await browser.pause(2000);

            const tocHeader = await $('.toc-header');
            await expect(tocHeader).toBeExisting();
        });

        it('should display chapters list in TOC', async () => {
            const chapters = await $$('.toc-chapter');
            await expect(chapters.length).toBeGreaterThan(0);
        });

        it('should return to library from TOC', async () => {
            const backButton = await $('ion-back-button');
            await backButton.waitForClickable({ timeout: 5000 });
            await backButton.click();
            await browser.pause(2000);

            const logo = await $('.epoc-logo');
            await expect(logo).toBeExisting();
        });
    });

    describe('ePoc page', () => {
        it('should open ePoc informations when clicking the image', async () => {
            const firstEpoc = await $('#container .library-item');
            const epocImage = await firstEpoc.$('.library-item-image');
            
            await epocImage.waitForClickable({ timeout: 5000 });
            await epocImage.click();
            await browser.pause(2000);

            const epocTitle = await $('ion-content .wrapper .epoc-title');
            await expect(epocTitle).toBeExisting();
        });

        it('should have one header with 3 tabs', async () => {
            const tabs = await $$('ion-content .wrapper .tabs-headers .tabs-header');
            await expect(tabs).toBeElementsArrayOfSize(3);
        });

        it('should the 3 tabs be clickable', async () => {
            const tabs = await $$('ion-content .wrapper .tabs-headers .tabs-header');
            for (const tab of tabs) {
                await tab.waitForClickable({ timeout: 5000 });
                await tab.click();
                await browser.pause(1000);
            }
        });

        it('should author tab have at least one author', async () => {
            const authors = await $$('ion-content .wrapper .tabs .tab .epoc-author');
            await expect(authors.length).toBeGreaterThan(0);
        });

        it('should return to library from ePoc info', async () => {
            const backButton = await $('ion-back-button');
            await backButton.waitForClickable({ timeout: 5000 });
            await backButton.click();
            await browser.pause(2000);

            const logo = await $('.epoc-logo');
            await expect(logo).toBeExisting();
        });
    });

    after(async () => {
        await browser.pause(1000);
    });
});
