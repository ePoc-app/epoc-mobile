import {uid} from '@epoc/epoc-types/dist/v1';


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
