import { alertController } from '@ionic/vue';
import { useUser, type User } from '@/composables';
import { i18n } from '@/i18n';

export async function handleSetUser(): Promise<User | null> {
    const { setUser } = useUser();

    return new Promise((resolve) => {
        alertController
            .create({
                header: i18n.global.t('SETTINGS_PAGE.SET_USER.INFO'),
                message: i18n.global.t('SETTINGS_PAGE.SET_USER.MESSAGE'),
                inputs: [
                    {
                        name: 'lastname',
                        type: 'text',
                        placeholder: i18n.global.t('SETTINGS_PAGE.SET_USER.LASTNAME_PLACEHOLDER'),
                    },
                    {
                        name: 'firstname',
                        type: 'text',
                        placeholder: i18n.global.t('SETTINGS_PAGE.SET_USER.FIRSTNAME_PLACEHOLDER'),
                    },
                ],
                buttons: [
                    {
                        text: i18n.global.t('CANCEL'),
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: () => resolve(null),
                    },
                    {
                        text: i18n.global.t('CONFIRM'),
                        handler: async (data: User) => {
                            if (!data.firstname?.trim() || !data.lastname?.trim()) {
                                return false;
                            }
                            await setUser(data);
                            resolve(data);
                        },
                    },
                ],
            })
            .then((alert) => alert.present());
    });
}
