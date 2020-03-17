export abstract class Content {
    id: string;
    type: 'cover' | 'chapter' | 'html' | 'assessment' | 'video';
    name: string;
    toc?: number;
}
