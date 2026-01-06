import { useStorage } from './useStorage';
import { ref, Ref } from 'vue';

export type User = {
    firstname: string;
    lastname: string;
};

const user: Ref<User | null> = ref(null);

export function useUser() {
    const { getValue, setValue } = useStorage();

    async function getUser() {
        const userString = await getValue('user');
        user.value = userString ? JSON.parse(userString) : null;

        return user.value;
    }

    async function setUser(userData: User | null) {
        await setValue('user', JSON.stringify(userData));
        user.value = userData;
    }

    return {
        user,
        getUser,
        setUser,
    };
}
