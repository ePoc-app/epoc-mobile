import {uid} from './types';

export class OnboardingItem {
    id: uid;
    title: string;
    text: string;
    image?: string;
    link?: {
        text: string;
        url: string;
    }
}
