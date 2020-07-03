export abstract class Content {
    id: string;
    type: 'cover' | 'chapter' | 'html' | 'assessment' | 'video' | 'simple-question';
    name: string;
    depth?: number;
    children?: Content[];
}
