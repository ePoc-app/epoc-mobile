import {uid} from '../types';

export abstract class Content {
    id: uid;
    type: 'cover' | 'chapter' | 'html' | 'assessment' | 'video' | 'simple-question' | 'choice';
    name: string;
    depth?: number;
    children?: Content[];
}
