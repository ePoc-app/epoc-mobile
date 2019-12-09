import {Author} from './author';
import {Content} from './contents/content';

export class Epoc {
    id: string;
    title: string;
    image: string;
    authors: Author[];
    summary: string;
    outline: Array<string>;
    content: Array<Content>;
}
