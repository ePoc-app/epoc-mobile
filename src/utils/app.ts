import { i18n } from '@/i18n';
import { alertController, IonicSafeString } from '@ionic/vue';
import { EpocMetadata } from '@epoc/epoc-types/src/v1';
import { License } from '@epoc/epoc-types/src/v1/license';

export async function displayLicence(epoc: EpocMetadata, fallbackLicense?: License) {
    let message = '';
    const license = epoc.license?.name ? epoc.license : fallbackLicense;

    if (license?.name) {
        if (license.url) {
            message = i18n.global.t('LICENSE_MODAL.MESSAGE', {
                epoc: epoc.title,
                licenseName: license.name,
                licenseUrl: license.url
            });
        } else {
            message = i18n.global.t('LICENSE_MODAL.MESSAGE_WITHOUT_LINK', {
                epoc: epoc.title,
                licenseName: license.name
            });
        }
    } else {
        message = i18n.global.t('LICENSE_MODAL.MESSAGE_NO_LICENSE', {
            epoc: epoc.title,
        });
    }

    const alert = await alertController.create({
        header: i18n.global.t('LICENSE_MODAL.HEADER'),
        message: new IonicSafeString(message),
        buttons: [i18n.global.t('OK')],
    });

    await alert.present();
}
