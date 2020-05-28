import {Author} from './author';
import {Content} from './contents/content';

export class Epoc {
    id: string;
    title: string;
    image: string;
    teaser?: string;
    authors: Author[];
    summary: string;
    objectives: string[];
    parts: Array<Part>;
    content: Array<Content>;
}

export class Part {
    title: string;
    outline: Array<string>;
}
