export abstract class Content {
    id: string;
    type: 'cover' | 'chapter' | 'html' | 'assessment' | 'video' | 'simple-question';
    name: string;
    toc?: number;
}
