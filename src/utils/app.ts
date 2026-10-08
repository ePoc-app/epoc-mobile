import { i18n } from '@/i18n';
import { alertController, IonicSafeString } from '@ionic/vue';
import { EpocMetadata } from '@epoc/epoc-types/src/v1';

export async function displayLicence(epoc: EpocMetadata) {
    let message = '';

    if (epoc.license?.name) {
        if (epoc.license.url) {
            message = i18n.global.t('LICENSE_MODAL.MESSAGE', {
                epoc: epoc.title,
                licenseName: epoc.license.name,
                licenseUrl: epoc.license.url
            });
        } else {
            message = i18n.global.t('LICENSE_MODAL.MESSAGE_WITHOUT_LINK', {
                epoc: epoc.title,
                licenseName: epoc.license.name
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
