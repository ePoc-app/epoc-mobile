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
    outline: Array<string>;
    content: Array<Content>;
}
